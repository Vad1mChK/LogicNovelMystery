/* eslint-disable no-magic-numbers */
import {
	allEnumValues,
	assignIfValidType,
	objectToMap,
	toEnumValue,
} from './typeUtils';

enum _GameMode {
	SINGLE = 'single',
	PAIR = 'pair',
} // Sample string enum

enum _Wuxing {
	FIRE,
	WATER,
	EARTH,
	WOOD,
	METAL,
} // Sample number enum

enum _Mixed {
	A = 'Alpha',
	B = 1,
} // Sample mixed enum

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
	test('value should be converted to enum value if such value exists', () => {
		expect(toEnumValue(_GameMode, 'single')).toBe(_GameMode.SINGLE);
		expect(toEnumValue(_GameMode, 'pair')).toBe(_GameMode.PAIR);
	});
	test("value should be converted to null if such value doesn't exist", () => {
		expect(toEnumValue(_GameMode, 'vsBots')).toBeNull();
	});
	test('value should be returned as is if it conforms to a specified type', () => {
		expect(assignIfValidType('some string', 'string')).toBe('some string');
		expect(assignIfValidType(42, 'number')).toBe(42);
	});
	test('return undefined if a value does not conform to a specified type', () => {
		expect(assignIfValidType('some string', 'number')).toBeUndefined();
		expect(assignIfValidType(42, 'string')).toBeUndefined();
	});
	it('should return all string-based enum values', () => {
		expect(allEnumValues(_GameMode)).toEqual([
			_GameMode.SINGLE,
			_GameMode.PAIR,
		]);
	});

	it('should return all numeric enum values (ignore reverse mappings)', () => {
		expect(allEnumValues(_Wuxing)).toEqual([0, 1, 2, 3, 4]); // Numeric enums
	});

	it('should handle mixed enums', () => {
		expect(allEnumValues(_Mixed)).toEqual(['Alpha', 1]);
	});

	it('should return an empty array for an empty enum', () => {
		enum Empty {}
		expect(allEnumValues(Empty)).toEqual([]);
	});
});
