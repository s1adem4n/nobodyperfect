<script lang="ts" module>
	export interface ImageProps extends HTMLImgAttributes {
		img?: HTMLImageElement;
		container?: HTMLDivElement;
	}
</script>

<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	let {
		class: className,
		img = $bindable(),
		container = $bindable(),
		...rest
	}: ImageProps = $props();

	let loaded = $state(false);

	$effect(() => {
		if (img) {
			img.onload = () => {
				loaded = true;
			};
		}
	});
</script>

<div
	bind:this={container}
	class={cn('bg-secondary relative rounded', className)}
>
	<img
		bind:this={img}
		loading="lazy"
		class={cn(
			'rounded object-contain transition-opacity',
			loaded ? 'opacity-100' : 'opacity-0'
		)}
		{...rest}
	/>
</div>
