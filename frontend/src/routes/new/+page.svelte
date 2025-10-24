<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pb';
	import { Input, Button } from '$lib/components/ui';

	let name = $state('');
	let loading = $state(false);

	async function createGame() {
		if (loading) return;
		loading = true;

		const game = await pb.collection('games').create({ name });
		loading = false;

		goto(`/${game.id}`);
	}
</script>

<h1 class="text-2xl font-bold">Neues Spiel erstellen</h1>

<form
	class="flex flex-col gap-4"
	onsubmit={(e) => {
		e.preventDefault();
		createGame();
	}}
>
	<Input placeholder="Gib den Namen des Spiels ein" bind:value={name} />
	<Button type="submit">Spiel erstellen</Button>
</form>
