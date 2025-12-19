import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createEffect, createSignal, Show } from 'solid-js';

import { pb, type Round } from '@/lib/pb';
import { transition } from '@/lib/utils';

export function PlayerAnswer({ round }: { round: () => Round }) {
	const [status, setStatus] = createSignal<'idle' | 'loading'>('idle');
	const [answer, setAnswer] = createSignal('');
	const [submitted, setSubmitted] = createSignal(false);

	createEffect(() => {
		if (localStorage.getItem(`answered-${round().id}`) === 'true') {
			setSubmitted(true);
		} else {
			setSubmitted(false);
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		setStatus('loading');

		await pb.collection('answers').create({
			round: round().id,
			text: answer(),
			player: localStorage.getItem('name')
		});

		localStorage.setItem(`answered-${round().id}`, 'true');

		transition(() => {
			setSubmitted(true);
			setStatus('idle');
			setAnswer('');
		});
	}

	return (
		<Show when={!submitted()} fallback={<span>Antwort eingereicht!</span>}>
			<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
				<div class="flex flex-col gap-2">
					<label for="answer" class="font-semibold">
						Deine Antwort
					</label>
					<Textarea
						id="answer"
						value={answer()}
						oninput={(e) => setAnswer(e.currentTarget.value)}
						disabled={status() === 'loading'}
						required
					/>
				</div>

				<Button type="submit" disabled={status() === 'loading'}>
					Antwort einreichen
				</Button>
			</form>
		</Show>
	);
}
