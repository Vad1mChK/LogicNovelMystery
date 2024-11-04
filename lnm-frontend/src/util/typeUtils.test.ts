/* eslint-disable no-magic-numbers */
import { objectToMap, toEnumValue } from './typeUtils.ts';

enum _GameMode {
	SINGLE = 'single',
	PAIR = 'pair',
} // Sample string enum

describe('Test type utils', () => {
	test('object should be converted to Map<string, number>', () => {
		const obj = {
			key1: 420,
			key2: 69,
		};
		const objAsMap = objectToMap<number>(obj);
		expect(objAsMap).toBeInstanceOf(Map<string, number>);
		expect(objAsMap.get('key1')).toBe(420);
		expect(objAsMap.get('key2')).toBe(69);
	});
	test('value should be converted to enum if such value exists', () => {
		expect(toEnumValue(_GameMode, 'single')).toBe(_GameMode.SINGLE);
		expect(toEnumValue(_GameMode, 'pair')).toBe(_GameMode.PAIR);
	});
	test("value should be converted to null if such value doesn't exist", () => {
		expect(toEnumValue(_GameMode, 'vsBots')).toBeNull();
	});
});
