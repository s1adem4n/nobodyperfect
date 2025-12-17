import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [solid(), tailwindcss(), icons({ compiler: 'solid' })],
	resolve: {
		alias: {
			'@': '/src'
		}
	},
	server: {
		proxy: {
			'/api': 'http://localhost:8090'
		}
	}
});
