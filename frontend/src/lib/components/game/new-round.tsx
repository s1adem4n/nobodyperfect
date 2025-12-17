import { pb, type Game, type Round } from '@/lib/pb';
import { Textarea } from '@/lib/components/ui/textarea';
import { Button } from '@/lib/components/ui/button';
import { createSignal } from 'solid-js';

export function NewRound({ game, onCreate }: { game: Game; onCreate: (round: Round) => void }) {
	const [status, setStatus] = createSignal<'idle' | 'loading'>('idle');
	const [question, setQuestion] = createSignal('');
	const [answer, setAnswer] = createSignal('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		setStatus('loading');

		const round = await pb.collection('rounds').create({
			game: game.id,
			question: question(),
			correctAnswer: answer()
		});
		onCreate(round);

		setStatus('idle');
		setQuestion('');
		setAnswer('');
	}

	return (
		<details class="rounded border px-4">
			<summary class="my-2 cursor-pointer font-bold">Neue Runde erstellen</summary>

			<form class="mt-2 mb-4 flex flex-col gap-4" onsubmit={handleSubmit}>
				<div class="flex flex-col">
					<label for="question" class="font-semibold">
						Frage
					</label>
					<Textarea
						value={question()}
						onInput={(e) => setQuestion(e.currentTarget.value)}
						id="question"
						placeholder="Gib hier die Frage für die neue Runde ein"
					/>
				</div>

				<div class="flex flex-col">
					<label for="answer" class="font-semibold">
						Richtige Antwort
					</label>
					<Textarea
						value={answer()}
						onInput={(e) => setAnswer(e.currentTarget.value)}
						id="answer"
						placeholder="Gib hier die richtige Antwort ein"
					/>
				</div>

				<Button
					type="submit"
					disabled={status() === 'loading' || !question().trim() || !answer().trim()}
				>
					Runde erstellen
				</Button>
			</form>
		</details>
	);
}
