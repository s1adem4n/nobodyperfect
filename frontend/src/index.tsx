/* @refresh reload */
import { Route, Router } from '@solidjs/router';
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';

// Preload to avoid layout shift
import Home from '@/routes/home';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found');
}

render(
	() => (
		<Router>
			<Route path="/" component={Home} />
			<Route path="/join-game" component={lazy(() => import('./routes/join-game'))} />
			<Route path="/game" component={lazy(() => import('./routes/game'))} />
		</Router>
	),
	root
);
