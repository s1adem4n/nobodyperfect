/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import { Home } from '@/routes/home';
import { JoinGame } from '@/routes/join-game';
import { Game } from '@/routes/game';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found');
}

render(
	() => (
		<div class="mx-auto flex h-full w-full max-w-xl flex-col gap-4 p-4">
			<Router>
				<Route path="/" component={Home} />
				<Route path="/join-game" component={JoinGame} />
				<Route path="/game" component={Game} />
			</Router>
		</div>
	),
	root
);
