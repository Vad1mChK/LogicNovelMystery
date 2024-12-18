import { test, expect } from '@playwright/test';

test.describe('Example e2e Test Suite', () => {
	test('Home page loads with correct title', async ({ page }) => {
		await page.goto('http://localhost:5173');
		await expect(page).toHaveTitle('LogicNovelMystery'); // Проверка заголовка страницы
	});
	test('Should switch from login to register', async ({ page }) => {
		await page.goto('http://localhost:5173/LogicNovelMystery/auth/login');
		const registerLink = page.locator(
			'a[href="/LogicNovelMystery/auth/register"]'
		);
		await registerLink.click();
		await expect(page).toHaveURL(
			'http://localhost:5173/LogicNovelMystery/auth/register'
		);
	});
	test('Should switch from register to login', async ({ page }) => {
		await page.goto(
			'http://localhost:5173/LogicNovelMystery/auth/register'
		);
		const registerLink = page.locator(
			'a[href="/LogicNovelMystery/auth/login"]'
		);
		await registerLink.click();
		await expect(page).toHaveURL(
			'http://localhost:5173/LogicNovelMystery/auth/login'
		);
	});
	test('Language change should change text', async ({ page }) => {
		await page.goto('http://localhost:5173/LogicNovelMystery/main');

		// Open settings modal
		const settingsButton = page.locator('.settings-button');
		await settingsButton.click();

		// Ensure settings modal is visible
		const settingsModal = page.locator('#settings-modal');
		await expect(settingsModal).toBeVisible();

		// Locate the language select dropdown
		const languageSelect = settingsModal.locator('#language-select');

		// Select English and check the button text
		await languageSelect.selectOption('en');
		const buttonTextInEnglish = await settingsButton.innerText(); // Await the innerText() call
		expect(buttonTextInEnglish).toBe('Settings'); // Compare the string

		// Select Russian and check the button text
		await languageSelect.selectOption('ru');
		const buttonTextInRussian = await settingsButton.innerText(); // Await the innerText() call
		expect(buttonTextInRussian).toBe('Настройки'); // Compare the string
	});
	test('Selected language should persist across reloads', async ({
		page,
	}) => {
		await page.goto('http://localhost:5173/LogicNovelMystery/main');

		// Open settings and select Russian
		const settingsButton = page.locator('.settings-button');
		await settingsButton.click();
		const languageSelect = page.locator('#language-select');
		await languageSelect.selectOption('ru');

		// Reload the page
		await page.reload();
		await expect(page.locator('.settings-button')).toHaveText('Настройки'); // Verify persistence
	});
	test('Single game page should have background of 100vh 100vw', async ({
		page,
	}) => {
		await page.goto(
			'http://localhost:5173/LogicNovelMystery/single-player'
		);
		const background = page.locator('.frame-renderer .game-background');
		await expect(background).toBeVisible();

		const viewportSize = page.viewportSize();
		expect(page.viewportSize()).not.toBeNull();
		await expect(background).toHaveCSS(
			'height',
			`${viewportSize?.height}px`
		);
		await expect(background).toHaveCSS('width', `${viewportSize?.width}px`);
	});
	test('Single game page should have HUD visible', async ({ page }) => {
		await page.goto(
			'http://localhost:5173/LogicNovelMystery/single-player'
		);
		const frameRenderer = page.locator('.frame-renderer');
		const dialogueBox = frameRenderer.locator('.game-dialogue-box');
		await expect(dialogueBox).toBeVisible();
		const speakerNameBox = dialogueBox.locator('.speaker-name');
		if (await speakerNameBox.isVisible()) {
			expect(await speakerNameBox.innerText()).not.toHaveLength(0);
		}
		const nextFrameButton = frameRenderer.locator('.next-frame-button');
		await expect(nextFrameButton).toBeVisible();
	});
	test('Single game page should have health between 0% and 100%', async ({
		page,
	}) => {
		// Navigate to the single-player page
		await page.goto(
			'http://localhost:5173/LogicNovelMystery/single-player'
		);

		const frameRenderer = page.locator('.frame-renderer');
		const healthBar = frameRenderer.locator('.health-bar');
		await healthBar.waitFor({ state: 'visible' });

		// Ensure the health bar is visible; if not, exit the test
		if (!(await healthBar.isVisible())) {
			console.warn('Health bar is not visible on the page.');
			return;
		}

		const healthBarFill = healthBar.locator('.health-bar-fill');

		const fillWidthPx = await healthBarFill.evaluate((el) =>
			parseFloat(getComputedStyle(el).width)
		);
		const parentWidthPx = await healthBar.evaluate((el) =>
			parseFloat(getComputedStyle(el).width)
		);

		const healthPercentage = (fillWidthPx / parentWidthPx) * 100;
		console.log('Health Percentage:', healthPercentage);

		expect(healthPercentage).toBeGreaterThanOrEqual(0);
		expect(healthPercentage).toBeLessThanOrEqual(100);
	});
	test('Give up should leave you with 0% health', async ({ page }) => {
		// Navigate to the single-player page
		await page.goto(
			'http://localhost:5173/LogicNovelMystery/single-player'
		);

		const giveUpButton = page.locator('.give-up-button'); // Adjust the selector as needed
		await expect(giveUpButton).toBeVisible();
		await giveUpButton.click();

		const healthBar = page.locator('.health-bar');
		const healthBarFill = healthBar.locator('.health-bar-fill');

		await expect(healthBar).toBeVisible();
		// Ensure the health bar is visible; if not, exit the test
		if (!(await healthBar.isVisible())) {
			console.warn('Health bar is not visible on the page.');
			return;
		}

		const fillWidthPx = await healthBarFill.evaluate((el) =>
			parseFloat(getComputedStyle(el).width)
		);
		const parentWidthPx = await healthBar.evaluate((el) =>
			parseFloat(getComputedStyle(el).width)
		);

		const healthPercentage = (fillWidthPx / parentWidthPx) * 100;
		console.log('Health Percentage After Give Up:', healthPercentage);
		expect(healthPercentage).toBe(0);
	});
});
