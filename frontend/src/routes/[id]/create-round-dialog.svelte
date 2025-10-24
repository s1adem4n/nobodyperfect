<script lang="ts">
	import { Button, Dialog, Textarea } from '$lib/components/ui';
	import { pb, type Round } from '$lib/pb';

	let {
		open = $bindable(),
		gameId,
		onCreate
	}: {
		open: boolean;
		gameId: string;
		onCreate: (round: Round) => void;
	} = $props();

	let question = $state('');
	let correctAnswer = $state('');
	let loading = $state(false);

	async function createRound() {
		if (loading) return;
		loading = true;

		const round = await pb.collection('rounds').create({
			game: gameId,
			question,
			correctAnswer
		});
		loading = false;
		open = false;

		onCreate(round);
	}
</script>

<Dialog bind:open title="Neue Runde erstellen">
	<form
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			e.preventDefault();
			createRound();
		}}
	>
		<Textarea bind:value={question} placeholder="Frage" required />
		<Textarea bind:value={correctAnswer} placeholder="Korrekte Antwort" required />
		<Button type="submit" disabled={loading || !question.trim() || !correctAnswer.trim()}>
			Runde erstellen
		</Button>
	</form>
</Dialog>
