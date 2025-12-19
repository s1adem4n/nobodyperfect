import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { Logo } from '@/lib/components/logo';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { pb } from '@/lib/pb';

export default function Home() {
	const navigate = useNavigate();

	const [name, setName] = createSignal(localStorage.getItem('name') || '');
	const [loading, setLoading] = createSignal(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const submitter = e.submitter as HTMLButtonElement;

		if (submitter?.id === 'create-button') {
			setLoading(true);
			try {
				const game = await pb.collection('games').create();
				navigate(`/game?code=${game.code}`);
			} catch (err) {
				console.error(err);
				setLoading(false);
			}
		} else {
			navigate('/join-game');
		}
	}

	return (
		<form class="flex flex-1 flex-col justify-center gap-4" onsubmit={handleSubmit}>
			<Logo />

			<div class="flex flex-col gap-2">
				<label for="name" class="font-semibold">
					Dein Name
				</label>
				<Input
					id="name"
					placeholder="Gib deinen Namen ein"
					value={name()}
					oninput={(e) => {
						setName(e.target.value);
						localStorage.setItem('name', e.target.value);
					}}
					required
				/>
			</div>

			<div class="flex flex-col gap-4 sm:flex-row">
				<Button id="create-button" type="submit" disabled={loading()}>
					Neues Spiel erstellen
				</Button>

				<Button id="join-button" type="submit" disabled={loading()}>
					Einem Spiel beitreten
				</Button>
			</div>
		</form>
	);
}
