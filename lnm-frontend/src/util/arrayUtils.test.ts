import { shuffle } from './arrayUtils';

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
});
