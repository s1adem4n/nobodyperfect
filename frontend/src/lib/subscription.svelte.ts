import type { Base } from './pb';
import type { RecordService } from 'pocketbase';

export class SingleSubscription<T extends Base> {
	record = $state<T | null>(null);
	private unsubscribePromise: Promise<() => void> | null = null;

	constructor(
		private service: RecordService<T>,
		private id: string
	) {
		this.subscribe();
	}

	private subscribe() {
		this.unsubscribePromise = this.service.subscribe(this.id, (e) => {
			switch (e.action) {
				case 'update':
					this.record = e.record;
					break;
				case 'delete':
					this.record = null;
					break;
			}
		});
	}

	async unsubscribe() {
		if (this.unsubscribePromise) {
			const unsubscribe = await this.unsubscribePromise;
			unsubscribe();
		}
	}
}

export class MultipleSubscription<T extends Base> {
	records = $state<T[]>([]);
	private unsubscribePromise: Promise<() => void> | null = null;

	constructor(
		private service: RecordService<T>,
		initialRecords: T[] = [],
		private query: string = '*',
		private filter: (item: T) => boolean = () => true
	) {
		this.records = initialRecords;

		$effect(() => {
			this.subscribe();

			return () => this.unsubscribe();
		});
	}

	private subscribe() {
		this.unsubscribePromise = this.service.subscribe(this.query, (e) => {
			switch (e.action) {
				case 'create':
					if (!this.filter(e.record)) {
						return;
					}
					this.records = [...this.records, e.record];
					break;
				case 'update':
					this.records = this.records.map((r) => (r.id === e.record.id ? e.record : r));
					break;
				case 'delete':
					this.records = this.records.filter((r) => r.id !== e.record.id);
					break;
			}
		});
	}

	async unsubscribe() {
		if (this.unsubscribePromise) {
			const unsubscribe = await this.unsubscribePromise;
			unsubscribe();
		}
	}
}
