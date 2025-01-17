import { generateSessionToken } from './generateSessionToken';

describe('generateSessionToken', () => {
	it("should return a different token each time it's called", () => {
		const token1 = generateSessionToken();
		const token2 = generateSessionToken();
		const token3 = generateSessionToken();

		expect(token1).not.toBe(token2);
		expect(token1).not.toBe(token3);
		expect(token2).not.toBe(token3);
	});

	it('should generate a token of approximately 32 characters in length', () => {
		const token = generateSessionToken();
		expect(token.length).toBeGreaterThanOrEqual(30);
		expect(token.length).toBeLessThanOrEqual(34);
		expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
	});

	it('should only contain URL-safe characters', () => {
		const token = generateSessionToken();
		expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
	});
});
