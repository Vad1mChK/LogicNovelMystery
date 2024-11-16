import { test, expect } from '@playwright/test';

test.describe('Example e2e Test Suite', () => {
	test('Home page loads with correct title', async ({ page }) => {
		await page.goto('http://localhost:5173');
		await expect(page).toHaveTitle('LogicNovelMystery'); // Проверка заголовка страницы
	});
});
