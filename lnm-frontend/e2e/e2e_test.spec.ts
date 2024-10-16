import { test, expect } from '@playwright/test';

test.describe('Example e2e Test Suite', () => {

    test('Home page loads with correct title', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await expect(page).toHaveTitle("Vite + React - TS");  // Проверка заголовка страницы
    });

    test('User can log in', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.click('input[type="checkbox"]')
        await page.fill('input[name="login"]', 'test_user');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:5173/menu');  // Проверка перехода на menu
    });

    test('User can\'t log in', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.fill('input[name="login"]', 'test_user2');
        await page.fill('input[name="password"]', 'password1234');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:5173'); // Проверка что остались там же
    });
});
