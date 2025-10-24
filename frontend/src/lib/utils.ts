import clsx, { type ClassValue } from 'clsx';
import type { Base } from './pb';
import type { RecordService } from 'pocketbase';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

export function shuffleArray<T>(array: T[]): T[] {
	const shuffledArray = array.slice();
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}
	return shuffledArray;
}

export function subscribeSingle<T extends Base>(
	service: RecordService<T>,
	id: string,
	setState: (state: T | null) => void
) {
	const unsubscribe = service.subscribe(id, (e) => {
		switch (e.action) {
			case 'update':
				setState(e.record);
				break;
			case 'delete':
				setState(null);
				break;
		}
	});

	return () => unsubscribe.then((fn) => fn());
}

export function subscribeMultiple<T extends Base>(
	service: RecordService<T>,
	getState: () => T[],
	setState: (state: T[]) => void,
	query: string
) {
	const unsubscribe = service.subscribe(query, (e) => {
		switch (e.action) {
			case 'create':
				setState(getState().concat(e.record));
				break;
			case 'update':
				setState(getState().map((r) => (r.id === e.record.id ? e.record : r)));
				break;
			case 'delete':
				setState(getState().filter((r) => r.id !== e.record.id));
				break;
		}
	});

	return () => unsubscribe.then((fn) => fn());
}
