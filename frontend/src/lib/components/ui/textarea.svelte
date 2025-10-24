<script lang="ts" module>
	export interface TextareaProps extends HTMLTextareaAttributes {}
</script>

<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';

	let {
		class: className = '',
		value = $bindable(),
		...rest
	}: TextareaProps = $props();

	function autoResize(textarea: HTMLTextAreaElement) {
		textarea.style.height = textarea.scrollHeight + 'px';
		textarea.style.overflowY = 'hidden';

		textarea.addEventListener('input', function () {
			this.style.height = 'auto';
			this.style.height = this.scrollHeight + 'px';
		});
	}
</script>

<textarea
	{...rest}
	bind:value
	class={cn(
		'bg-muted ring-primary min-h-24 resize-none rounded border px-4 py-2 outline-none focus-visible:ring',
		className
	)}
	use:autoResize
>
</textarea>
