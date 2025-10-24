<script lang="ts">
	import { Button, Input, Textarea } from '$lib/components/ui';
	import { pb, type Answer, type Round } from '$lib/pb';
	import { subscribeMultiple } from '$lib/utils';
	import CreateRoundDialog from './create-round-dialog.svelte';

	let { data } = $props();

	const game = $derived(await pb.collection('games').getOne(data.gameId));

	let rounds: Round[] = $state((await pb.collection('rounds').getList(1, 100)).items);
	$effect(() => {
		const unsubscribe = subscribeMultiple(
			pb.collection('rounds'),
			() => rounds,
			(state) =>
				(rounds = state
					.filter((r) => r.game === game.id)
					.toSorted((a, b) => a.created.localeCompare(b.created))),
			'*'
		);
		return () => unsubscribe();
	});
	const currentRound = $derived(rounds.at(-1));

	let answers: Answer[] = $state([]);
	$effect(() => {
		if (!currentRound) return;

		pb.collection('answers')
			.getList(1, 100, {
				filter: pb.filter('round = {:round}', { round: currentRound.id })
			})
			.then((list) => {
				answers = list.items;
				letteredAnswers = [];
				assignLetters();
			});

		const unsubscribe = subscribeMultiple(
			pb.collection('answers'),
			() => answers,
			(state) => {
				answers = state
					.filter((a) => a.round === currentRound?.id)
					.toSorted((a, b) => a.created.localeCompare(b.created));
				assignLetters();
			},
			'*'
		);
		return () => unsubscribe();
	});

	let name = $state(localStorage.getItem('name') || '');

	let nameInput = $state('');
	let answerInput = $state('');

	let answerSubmitted = $derived(
		localStorage.getItem(`answerSubmitted${currentRound?.id}`) === 'true'
	);

	let isModerator = $state(false);
	$effect(() => {
		if (currentRound && localStorage.getItem('isModerator') === currentRound.id) {
			isModerator = true;
		}
	});

	let createRoundDialogOpen = $state(false);

	let loading = $state(false);

	// Letter assignments for moderator
	interface LetteredAnswer {
		letter: string;
		player: string;
		text: string;
		isCorrect: boolean;
	}
	let letteredAnswers = $state<LetteredAnswer[]>([]);

	function assignLetters() {
		if (!currentRound) return;

		// Total items = player answers + correct answer
		const totalItems = answers.length + 1;

		// Get only the letters we need (A-G, but only as many as totalItems)
		const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].slice(0, totalItems);

		// Shuffle the letters
		for (let i = letters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[letters[i], letters[j]] = [letters[j], letters[i]];
		}

		// Assign letters to answers
		const letterAssignments = new Map<string, string>();
		answers.forEach((answer, index) => {
			letterAssignments.set(answer.id, letters[index]);
		});

		// Assign the last letter to correct answer
		const correctAnswerLetter = letters[letters.length - 1];

		// Create lettered answers array including correct answer
		const allAnswers: LetteredAnswer[] = [
			...answers.map((answer) => ({
				letter: letterAssignments.get(answer.id) || '',
				player: answer.player,
				text: answer.text,
				isCorrect: false
			})),
			{
				letter: correctAnswerLetter,
				player: 'Korrekte Antwort',
				text: currentRound.correctAnswer,
				isCorrect: true
			}
		];

		// Sort by letter
		letteredAnswers = allAnswers.sort((a, b) => a.letter.localeCompare(b.letter));
	}

	async function submitAnswer() {
		if (!currentRound || loading) return;

		loading = true;

		await pb.collection('answers').create({
			round: currentRound.id,
			text: answerInput,
			player: name
		});
		answerInput = '';
		localStorage.setItem(`answerSubmitted${currentRound.id}`, 'true');
		answerSubmitted = true;

		loading = false;
	}
</script>

<h1 class="text-2xl font-semibold">
	{game.name}
</h1>

<CreateRoundDialog
	bind:open={createRoundDialogOpen}
	gameId={game.id}
	onCreate={(round) => {
		localStorage.setItem('isModerator', round.id);
		isModerator = true;
	}}
/>

{#if !name}
	<form
		class="flex flex-col gap-4"
		onsubmit={(e) => {
			e.preventDefault();
			localStorage.setItem('name', nameInput);
			name = nameInput;
		}}
	>
		<Input bind:value={nameInput} placeholder="Dein Name" />
		<Button disabled={!nameInput.trim()}>Speichern</Button>
	</form>
{:else}
	{#if currentRound}
		<p>Frage: {currentRound.question}</p>
		{#if isModerator}
			<p>Du bist der Moderator</p>

			{#each letteredAnswers as answer}
				<div class="flex flex-col">
					<span class="font-bold" class:text-green-600={answer.isCorrect}>
						[{answer.letter}] {answer.player}
					</span>
					<pre class="bg-muted overflow-x-auto rounded px-4 py-2">{answer.text}</pre>
				</div>
			{/each}
		{:else if answerSubmitted}
			<p>Antwort abgeschickt!</p>
		{:else}
			<Textarea bind:value={answerInput} placeholder="Deine Antwort" />
			<Button onclick={submitAnswer} disabled={!answerInput.trim() || loading}>
				Antwort abschicken
			</Button>
		{/if}
	{/if}
	<Button onclick={() => (createRoundDialogOpen = true)} disabled={loading}>
		Neue Runde starten
	</Button>
{/if}
