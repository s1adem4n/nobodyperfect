import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { useNavigate } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';

export default function JoinGame() {
	const navigate = useNavigate();
	const [status, setStatus] = createSignal<'idle' | 'loading'>('idle');
	const [name, setName] = createSignal(localStorage.getItem('name') || '');
	const [code, setCode] = createSignal(
		new URLSearchParams(window.location.search).get('code') || ''
	);

	function handleSubmit(e: Event) {
		e.preventDefault();
		setStatus('loading');

		localStorage.setItem('name', name());
		navigate(`/game?code=${code()}`);

		setStatus('idle');
	}

	return (
		<form class="flex flex-1 flex-col items-center justify-center gap-4" onsubmit={handleSubmit}>
			<img src="/logo.png" alt="Logo" class="h-auto w-full" />

			<Show when={localStorage.getItem('name') === null}>
				<Input
					placeholder="Dein Name"
					value={name()}
					oninput={(e) => {
						setName(e.target.value);
						localStorage.setItem('name', e.target.value);
					}}
					required
				/>
			</Show>

			<div class="flex w-full flex-col gap-2">
				<Input
					placeholder="Spielcode"
					value={code()}
					oninput={(e) => setCode(e.target.value)}
					required
				/>

				<p class="text-sm text-muted-foreground">
					Bitte gib den Spielcode ein, den du von dem Spielleiter erhalten hast.
				</p>
			</div>

			<Button disabled={status() === 'loading'}>Spiel beitreten</Button>
		</form>
	);
}
