<script lang="ts" module>
	export interface InputProps extends HTMLInputAttributes {}
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	let {
		class: className = '',
		value = $bindable(),
		...rest
	}: InputProps = $props();
</script>

<input
	{...rest}
	bind:value
	class={cn(
		'bg-muted ring-primary rounded border px-4 py-2 outline-none focus-visible:ring',
		className
	)}
/>
