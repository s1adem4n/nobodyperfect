/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import { lazy } from 'solid-js';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found');
}

render(
	() => (
		<div class="mx-auto flex h-full w-full max-w-xl flex-col gap-4 p-4">
			<Router>
				<Route path="/" component={lazy(() => import('./routes/home'))} />
				<Route path="/join-game" component={lazy(() => import('./routes/join-game'))} />
				<Route path="/game" component={lazy(() => import('./routes/game'))} />
			</Router>
		</div>
	),
	root
);
