import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // Svarbu: būtent šitas kelias!

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Dokumentacija sako naudoti masyvą: [vitePreprocess()]
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter()
	}
};

export default config;