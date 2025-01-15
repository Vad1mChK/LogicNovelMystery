import { simpleHash } from './hash';

describe('simpleHash', () => {
	it('should return 0 for an empty string input', () => {
		const result = simpleHash('');
		expect(result).toBe(0);
	});

	it('should return the same hash for identical string inputs', () => {
		const input = 'test string';
		const firstHash = simpleHash(input);
		const secondHash = simpleHash(input);
		expect(firstHash).toBe(secondHash);
	});

	it('should return different hashes for different string inputs', () => {
		const input1 = 'test string 1';
		const input2 = 'test string 2';
		const hash1 = simpleHash(input1);
		const hash2 = simpleHash(input2);
		expect(hash1).not.toBe(hash2);
	});

	it('should produce consistent results for Unicode characters', () => {
		const unicodeString = '你好世界';
		const firstHash = simpleHash(unicodeString);
		const secondHash = simpleHash(unicodeString);
		expect(firstHash).toBe(secondHash);
		expect(typeof firstHash).toBe('number');
	});
});
