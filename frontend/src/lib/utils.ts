import clsx, { type ClassValue } from 'clsx';
import { toSvgSource } from 'lean-qr/extras/svg';
import { generate } from 'lean-qr/nano';
import type { RecordService } from 'pocketbase';
import { createEffect, createResource, onCleanup } from 'solid-js';

import type { Base } from '@/lib/pb';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

export async function transition(action: () => Promise<unknown> | unknown) {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) {
		await action();
		return;
	}

	if (!document.startViewTransition) {
		await action();
		return;
	}
	await document.startViewTransition(action).finished;
}

export function useSubscribe<T extends Base>({
	service,
	filter,
	sort,
	transform
}: {
	service: RecordService<T>;
	filter?: () => string;
	sort?: string;
	transform?: (items: T[]) => T[];
}) {
	const [items, { mutate }] = createResource(filter, async (filter) => {
		const response = await service.getList(1, 1000, {
			filter,
			sort
		});
		return transform ? transform(response.items) : response.items;
	});

	createEffect(() => {
		if (items() === undefined) return;

		const unsubscribe = service.subscribe('*', (e) => {
			transition(() => {
				switch (e.action) {
					case 'create':
						mutate((prev) => {
							const next = [...(prev ?? []), e.record];
							return transform ? transform(next) : next;
						});
						break;
					case 'update':
						mutate((prev) => {
							const next = (prev || []).map((r) => (r.id === e.record.id ? e.record : r));
							return transform ? transform(next) : next;
						});
						break;
					case 'delete':
						mutate((prev) => {
							const next = (prev || []).filter((r) => r.id !== e.record.id);
							return transform ? transform(next) : next;
						});
						break;
				}
			});
		});

		onCleanup(async () => (await unsubscribe)());
	});

	return items;
}

export function generateQrCode(s: string) {
	return toSvgSource(generate(s), {
		//@ts-ignore
		height: '100%',
		//@ts-ignore
		width: '100%',
		pad: 0
	});
}
