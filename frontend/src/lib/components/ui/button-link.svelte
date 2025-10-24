<script lang="ts" module>
	export interface ButtonLinkProps
		extends HTMLAnchorAttributes,
			VariantProps<typeof buttonVariants> {}
</script>

<script lang="ts">
	import { buttonVariants } from './button.svelte';
	import type { VariantProps } from 'class-variance-authority';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	let {
		class: className = '',
		variant,
		size,
		children,
		...rest
	}: ButtonLinkProps = $props();
</script>

<a
	{...rest}
	class={cn(buttonVariants({ variant: variant, size: size, className }))}
>
	{@render children?.()}
</a>
