import { pb, type Round } from '@/lib/pb';
import { createSignal } from 'solid-js';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function ModeratorAnswer({ round }: { round: Round }) {
	const [status, setStatus] = createSignal<'idle' | 'loading'>('idle');
	const [name, setName] = createSignal('');
	const [answer, setAnswer] = createSignal('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		setStatus('loading');

		await pb.collection('answers').create({
			round: round.id,
			player: name(),
			text: answer()
		});

		setStatus('idle');
		setName('');
		setAnswer('');
	}

	return (
		<details class="rounded border px-4">
			<summary class="my-2 cursor-pointer font-bold">Antwort manuell eingeben</summary>

			<form class="mt-2 mb-4 flex flex-col gap-4" onsubmit={handleSubmit}>
				<div class="flex flex-col gap-1">
					<label for="name" class="font-semibold">
						Name des Spielers
					</label>
					<Input
						id="name"
						placeholder="Name"
						value={name()}
						oninput={(e) => setName(e.target.value)}
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label for="answer" class="font-semibold">
						Antwort
					</label>
					<Textarea
						id="answer"
						placeholder="Antwort"
						value={answer()}
						oninput={(e) => setAnswer(e.currentTarget.value)}
					/>
				</div>

				<Button type="submit" disabled={status() === 'loading'}>
					Antwort einreichen
				</Button>
			</form>
		</details>
	);
}
