import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';

import { Button } from '@/lib/components/ui/button';
import { ButtonLink } from '@/lib/components/ui/button-link';
import { Input } from '@/lib/components/ui/input';
import { pb } from '@/lib/pb';

export default function Home() {
	const navigate = useNavigate();

	const [name, setName] = createSignal(localStorage.getItem('name') || '');
	const [loading, setLoading] = createSignal(false);

	return (
		<div class="flex flex-1 flex-col justify-center gap-4">
			<img src="/logo.png" alt="Logo" class="h-auto w-full" />

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
				/>
			</div>

			<div class="flex flex-col gap-4 sm:flex-row">
				<Button
					onclick={() => {
						setLoading(true);
						pb.collection('games')
							.create()
							.then((game) => {
								navigate(`/game?code=${game.code}`);
							});
					}}
					classList={{
						'pointer-events-none opacity-50': !name() || loading()
					}}
				>
					Neues Spiel erstellen
				</Button>

				<ButtonLink
					href="/join-game"
					classList={{
						'pointer-events-none opacity-50': !name() || loading()
					}}
				>
					Einem Spiel beitreten
				</ButtonLink>
			</div>
		</div>
	);
}
