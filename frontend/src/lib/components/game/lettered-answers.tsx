import { createMemo, For } from 'solid-js';

import type { Answer } from '@/lib/pb';

interface LetteredAnswer {
	letter: string;
	player: string;
	text: string;
	isCorrect: boolean;
}

export function LetteredAnswers({
	answers,
	correctAnswer
}: {
	answers: () => Answer[];
	correctAnswer: () => string;
}) {
	const letteredAnswers = createMemo(() => {
		// Total items = player answers + correct answer
		const totalItems = answers().length + 1;
		console.log(answers());

		// Get only the letters we need (A-G, but only as many as totalItems)
		const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].slice(0, totalItems);

		// Shuffle the letters
		for (let i = letters.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[letters[i], letters[j]] = [letters[j], letters[i]];
		}

		// Assign letters to answers
		const letterAssignments = new Map<string, string>();
		answers().forEach((answer, index) => {
			letterAssignments.set(answer.id, letters[index]);
		});

		// Assign the last letter to correct answer
		const correctAnswerLetter = letters[letters.length - 1];

		// Create lettered answers array including correct answer
		const allAnswers: LetteredAnswer[] = [
			...answers().map((answer) => ({
				letter: letterAssignments.get(answer.id) || '',
				player: answer.player,
				text: answer.text,
				isCorrect: false
			})),
			{
				letter: correctAnswerLetter,
				player: 'Korrekte Antwort',
				text: correctAnswer(),
				isCorrect: true
			}
		];

		// Sort by letter
		return allAnswers.sort((a, b) => a.letter.localeCompare(b.letter));
	});

	return (
		<For each={letteredAnswers()}>
			{(answer) => (
				<div class="flex flex-col">
					<span class="font-bold" class:text-green-600={answer.isCorrect}>
						[{answer.letter}] {answer.player}
					</span>
					<pre class="overflow-x-auto rounded bg-muted px-4 py-2">{answer.text}</pre>
				</div>
			)}
		</For>
	);
}
