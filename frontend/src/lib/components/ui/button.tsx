import { cva, type VariantProps } from 'class-variance-authority';
import { splitProps, type JSX } from 'solid-js';

export const buttonVariants = cva(
	'inline-flex items-center rounded font-semibold uppercase disabled:cursor-not-allowed disabled:opacity-70 w-full transition-opacity',
	{
		variants: {
			variant: {
				primary: 'bg-primary text-primary-foreground hover:opacity-90',
				secondary: 'bg-muted text-primary hover:opacity-80 border'
			},
			size: {
				base: 'gap-3 px-4 py-2',
				sm: 'gap-2 px-3 py-1.5 text-sm'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'base'
		}
	}
);

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants>;

export function Button(props: ButtonProps) {
	const [local, rest] = splitProps(props, ['class', 'variant', 'size', 'children']);

	return (
		<button
			class={buttonVariants({ variant: local.variant, size: local.size, class: local.class })}
			{...rest}
		>
			{local.children}
		</button>
	);
}
