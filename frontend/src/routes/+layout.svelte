<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="mx-auto flex max-w-xl flex-col gap-4 p-4">
<svelte:boundary>
    {@render children?.()}
    
    {#snippet pending()}
    <p>Lädt...</p>
    {/snippet}
  </svelte:boundary>
</div>
