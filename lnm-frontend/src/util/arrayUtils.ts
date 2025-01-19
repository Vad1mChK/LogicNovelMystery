export function shuffle<T>(array: T[]): T[] {
	if (array.length <= 1) {
		return array;
	}

	const newArray = [...array];

	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[newArray[currentIndex], newArray[randomIndex]] = [
			newArray[randomIndex],
			newArray[currentIndex],
		];
	}

	return newArray;
}

export function randomChoice<T>(array: T[], last?: T): T | null {
	if (array.length === 0) return null;
	if (array.length === 1) return array[0];

	const index = Math.floor(Math.random() * array.length);
	if (array[index] === last) {
		return array[(index + 1) % array.length];
	}
	return array[index];
}
