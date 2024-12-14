import { shuffle } from './arrayUtils.ts';

describe('Test array utils', () => {
	test('array should contain the same elements after shuffle', () => {
		const arr = [1, 2, 3, 4, 5];

		const shuffled = shuffle(arr);

		expect(arr.sort()).toBe(shuffled.sort());
	});
});
