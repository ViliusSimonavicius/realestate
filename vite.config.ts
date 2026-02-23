import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		watch: {
			usePolling: true // Užtikrina, kad MacBook matytų failų pakeitimus
		},
		hmr: {
			clientPort: 5173 // Išsprendžia DevTools ir HMR klaidas naršyklėje
		}
	}
});