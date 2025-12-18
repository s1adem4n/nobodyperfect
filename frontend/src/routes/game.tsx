import { useNavigate, useSearchParams } from '@solidjs/router';
import { createResource, Show } from 'solid-js';
import IconQuestionMark from '~icons/mdi/question-mark';

import { LetteredAnswers } from '@/lib/components/game/lettered-answers';
import { ModeratorAnswer } from '@/lib/components/game/moderator-answer';
import { NewRound } from '@/lib/components/game/new-round';
import { PlayerAnswer } from '@/lib/components/game/player-answer';
import { pb } from '@/lib/pb';
import { generateQrCode, useSubscribe } from '@/lib/utils';

export default function Game() {
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const code = () =>
		(Array.isArray(searchParams.code) ? searchParams.code[0] : searchParams.code) || '';

	if (!localStorage.getItem('name')) {
		navigate(`/join-game?code=${code()}`);
	}

	const [game] = createResource(code, async (code) => {
		return await pb.collection('games').getFirstListItem(pb.filter('code = {:code}', { code }));
	});

	const rounds = useSubscribe({
		service: pb.collection('rounds'),
		filter: () => (game() ? pb.filter('game = {:id}', { id: game()?.id }) : ''),
		sort: 'created',
		transform: (v) =>
			v.filter((a) => a.game === game()?.id).toSorted((a, b) => a.created.localeCompare(b.created))
	});
	const currentRound = () => rounds()?.at(-1) || null;

	const answers = useSubscribe({
		service: pb.collection('answers'),
		filter: () => (currentRound() ? pb.filter('round.id = {:id}', { id: currentRound()?.id }) : ''),
		sort: 'created',
		transform: (v) => v.filter((a) => a.round === currentRound()?.id)
	});

	const qrCode = () => generateQrCode(`${window.location.origin}/join-game?code=${code()}`);

	const [isModerator, { mutate: setIsModerator }] = createResource(currentRound, async (round) => {
		if (!round) return false;
		return localStorage.getItem(`moderator-${round.id}`) === 'true';
	});

	return (
		<Show when={game()} fallback={<span>Lädt...</span>}>
			<div class="flex justify-between">
				<div class="flex flex-col justify-between">
					<span class="font-mono text-xl font-bold">Code: {code()}</span>

					<Show when={isModerator()}>
						<span class="text-sm font-semibold text-green-600">Du bist der Moderator</span>
					</Show>
					<Show when={!isModerator()}>
						<span class="text-sm font-semibold text-blue-600">Du bist ein Spieler</span>
					</Show>
				</div>

				<button
					class="h-16 w-16 overflow-hidden rounded-sm dark:invert"
					innerHTML={qrCode()}
				></button>
			</div>

			<hr class="border-t" />

			<Show when={currentRound()} fallback={<span>Warte auf die nächste Runde...</span>}>
				<div class="flex items-center gap-4 rounded border bg-muted px-4 py-2">
					<IconQuestionMark class="h-8 w-8 shrink-0 text-primary" />

					<div class="flex flex-col justify-between">
						<span class="font-bold">Frage:</span>
						<p>{currentRound()?.question}</p>
					</div>
				</div>
			</Show>

			<Show when={!isModerator() && currentRound()}>
				<PlayerAnswer round={() => currentRound()!} />
			</Show>

			<Show when={isModerator() && currentRound()}>
				<LetteredAnswers
					answers={() => answers() || []}
					correctAnswer={() => currentRound()!.correctAnswer}
				/>
			</Show>

			<hr class="border-t" />

			<NewRound
				game={game()!}
				onCreate={(round) => {
					localStorage.setItem(`moderator-${round.id}`, 'true');
					setIsModerator(true);
				}}
			/>

			<Show when={isModerator() && currentRound()}>
				<ModeratorAnswer round={currentRound()!} />
			</Show>
		</Show>
	);
}
