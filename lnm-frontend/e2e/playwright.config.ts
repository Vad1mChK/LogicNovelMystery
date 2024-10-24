import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './',
    timeout: 60000,
    retries: 2,
    use: {
        baseURL: 'http://localhost:5173', // базовый URL фронтенда
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        { name: 'chromium' },
        { name: 'firefox' },
    ],
    reporter: "list"
});
