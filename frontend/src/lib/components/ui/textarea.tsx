import { createEffect, createSignal, splitProps } from 'solid-js';
import type { JSX } from 'solid-js/h/jsx-runtime';

import { cn } from '@/lib/utils';

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea(props: TextareaProps) {
	const [local, rest] = splitProps(props, ['class']);
	const [ref, setRef] = createSignal<HTMLTextAreaElement | undefined>(undefined);

	createEffect(() => {
		const el = ref();
		if (!el) return;

		el.style.height = el.scrollHeight + 'px';
		el.style.overflowY = 'hidden';

		el.addEventListener('input', function () {
			this.style.height = 'auto';
			this.style.height = this.scrollHeight + 'px';
		});
	});

	return (
		//@ts-ignore
		<textarea
			class={cn(
				'min-h-24 resize-none rounded border bg-muted px-4 py-2 ring-primary outline-none focus-visible:ring',
				local.class
			)}
			ref={(el) => setRef(el)}
			{...rest}
		/>
	);
}
