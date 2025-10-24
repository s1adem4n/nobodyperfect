<script lang="ts" module>
	export interface DialogProps {
		title: string;
		open: boolean;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	import Close from '~icons/mdi/close';

	let { title, open = $bindable(), children }: DialogProps = $props();

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});
</script>

{#if open}
	<div
		transition:fade={{ duration: 250 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				open = false;
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				open = false;
			}
		}}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-label={title}
	>
		<div class="w-xl p-4">
			<div
				transition:scale={{ duration: 250, start: 0.95 }}
				class="bg-background text-foreground flex flex-col rounded border"
			>
				<div class="bg-muted flex rounded-t p-2">
					<h2 class="ml-2 text-lg font-semibold">
						{title}
					</h2>
					<button
						class="ml-auto"
						onclick={() => (open = false)}
						aria-label="Close dialog"
					>
						<Close class="text-muted-foreground ml-auto h-6 w-6" />
					</button>
				</div>
				<div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
					{@render children?.()}
				</div>
			</div>
		</div>
	</div>
{/if}
