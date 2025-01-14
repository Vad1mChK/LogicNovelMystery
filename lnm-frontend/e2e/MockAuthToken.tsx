// Функция для генерации токена
export function generateMockAuthToken(): string {
	// Данные полезной нагрузки токена
	const payload = {
		username: 'mockUser',
		sub: 'mockUser',
		// eslint-disable-next-line no-magic-numbers
		iat: Math.floor(Date.now() / 1000),
		// eslint-disable-next-line no-magic-numbers
		exp: Math.floor(Date.now() / 1000) + 60 * 60, // Токен валиден 1 час
	};

	// Кодирование полезной нагрузки в Base64
	const base64Encode = (obj: object) =>
		Buffer.from(JSON.stringify(obj)).toString('base64url');
	const header = base64Encode({ alg: 'HS256', typ: 'JWT' });
	const body = base64Encode(payload);
	const signature = 'mock-signature'; // Заглушка для подписи

	return `Bearer ${header}.${body}.${signature}`;
}
