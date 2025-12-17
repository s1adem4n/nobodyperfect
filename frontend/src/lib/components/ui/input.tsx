import { cn } from '@/lib/utils';
import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js/h/jsx-runtime';

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
	const [local, rest] = splitProps(props, ['class']);

	return (
		//@ts-ignore
		<input
			class={cn(
				'w-full rounded border bg-muted px-4 py-2 ring-primary outline-none focus-visible:ring',
				local.class
			)}
			{...rest}
		/>
	);
}
