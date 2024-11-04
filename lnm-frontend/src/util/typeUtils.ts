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
