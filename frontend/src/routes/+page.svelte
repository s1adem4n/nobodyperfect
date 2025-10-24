<script lang="ts">
	import IconPlus from '~icons/mdi/plus';
	import { pb, type Game } from '$lib/pb';
	import { subscribeMultiple } from '$lib/utils';
	import { ButtonLink } from '$lib/components/ui';

	let games: Game[] = $state((await pb.collection('games').getList(1, 100)).items);
	$effect(() => {
		const unsubscribe = subscribeMultiple(
			pb.collection('games'),
			() => games,
			(state) => (games = state),
			'*'
		);
		return () => unsubscribe();
	});
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold">Verfügbare Spiele</h1>
	<ButtonLink href="/new">
		<IconPlus class="h-6 w-6" />
	</ButtonLink>
</div>

{#each games as game}
	<a
		href="/{game.id}"
		class="hover:bg-secondary bg-muted rounded border px-4 py-2 text-xl font-semibold"
	>
		{game.name}
	</a>
{:else}
	<p>Keine Spiele verfügbar.</p>
{/each}
