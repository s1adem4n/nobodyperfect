import { type VariantProps } from 'class-variance-authority';
import { splitProps, type ComponentProps } from 'solid-js';
import { buttonVariants } from './button';
import { A } from '@solidjs/router';

export type ButtonLinkProps = ComponentProps<typeof A> & VariantProps<typeof buttonVariants>;

export function ButtonLink(props: ButtonLinkProps) {
	const [local, rest] = splitProps(props, ['class', 'classList', 'variant', 'size', 'children']);

	return (
		<A
			{...rest}
			class={buttonVariants({
				variant: local.variant,
				size: local.size,
				class: local.class
			})}
			classList={local.classList}
		>
			{local.children}
		</A>
	);
}
