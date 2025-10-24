<script lang="ts" module>
	export const buttonVariants = cva(
		'inline-flex items-center rounded font-semibold uppercase disabled:cursor-not-allowed disabled:opacity-50',
		{
			variants: {
				variant: {
					primary:
						'bg-primary text-primary-foreground hover:bg-primary/90',
					secondary: 'bg-muted text-primary hover:bg-muted/80 border'
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

	export interface ButtonProps
		extends HTMLButtonAttributes,
			VariantProps<typeof buttonVariants> {}
</script>

<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	let {
		class: className = '',
		variant,
		size,
		children,
		...rest
	}: ButtonProps = $props();
</script>

<button
	{...rest}
	class={cn(buttonVariants({ variant: variant, size: size, className }))}
>
	{@render children?.()}
</button>
