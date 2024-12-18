export function objectToMap<T>(obj: Record<string, T>): Map<string, T> {
	return new Map(Object.entries(obj));
}

export function toEnumValue<T extends object>(
	enumObj: T,
	value: string | number
): T[keyof T] | null {
	const isValidEnumValue = Object.values(enumObj).includes(
		value as T[keyof T]
	);
	return isValidEnumValue ? (value as T[keyof T]) : null;
}

export function assignIfValidType<T>(
	value: unknown,
	typeName: string
): T | undefined {
	return typeof value === typeName ? (value as T) : undefined;
}

/**
 * Utility to retrieve all enum values.
 */
export function allEnumValues<T extends object>(enumObj: T): Array<T[keyof T]> {
	return Object.keys(enumObj)
		.filter((key) => isNaN(Number(key))) // Ignore reverse mappings for numeric enums
		.map((key) => enumObj[key as keyof T]);
}
