import { randomChoice, shuffle } from './arrayUtils';

describe('Test array utils', () => {
	test('shuffle should not modify the original array', () => {
		const arr = [1, 2, 3, 4, 5];

		const original = [...arr];
		shuffle(arr);

		expect(arr).toEqual(original);
	});

	test('array should contain the same elements after shuffle', () => {
		const arr = [1, 2, 3, 4, 5];

		const shuffled = shuffle(arr);

		expect(arr.sort()).toEqual(shuffled.sort());
	});

	test('shuffling an empty array should return an empty array', () => {
		const arr: number[] = [];
		expect(shuffle(arr)).toEqual([]);
	});

	test('shuffling a single-element array should return the same array', () => {
		const arr = [1];
		expect(shuffle(arr)).toEqual([1]);
	});

	test('randomChoice should return the single element when array has only one item', () => {
		const arr = [42];
		expect(randomChoice(arr)).toBe(42);
	});

	test('randomChoice should return a different element than the last parameter when possible', () => {
		const arr = [1, 2, 3, 4, 5];
		const last = 3;
		const result = randomChoice(arr, last);

		expect(result).not.toBe(last);
		expect(arr).toContain(result);
	});

	test('randomChoice should return null on empty arrays', () => {
		const arr: number[] = [];
		expect(randomChoice(arr)).toBeNull();
	});
});
