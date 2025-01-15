onmessage = function () {
	// Генерируем случайное число от 1 до 5
	// eslint-disable-next-line no-magic-numbers
	const randomChance = Math.floor(Math.random() * 5) + 1;

	if (randomChance === 1) {
		// 1 из 5 - пасхалка
		postMessage({
			type: 'question',
		});
	} else {
		// Стандартный случай - запрашиваем данные
		postMessage({ type: 'fetch' });
	}
};
