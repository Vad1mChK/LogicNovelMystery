import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './',
	// eslint-disable-next-line no-magic-numbers
	timeout: 60000,
	// eslint-disable-next-line no-magic-numbers
	retries: 2,
	use: {
		baseURL: 'http://localhost:5173', // базовый URL фронтенда
		headless: true,
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
	projects: [{ name: 'chromium' }, { name: 'firefox' }],
	reporter: 'list',
});
