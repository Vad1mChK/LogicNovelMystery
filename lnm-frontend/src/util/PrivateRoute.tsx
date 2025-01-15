import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem('AuthToken');

	// Проверяем наличие токена и его валидность (например, срок действия)
	const isAuthenticated = token !== null && isTokenValid(token);

	return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

// Простая проверка токена (например, истечение срока действия)
const isTokenValid = (token: string): boolean => {
	try {
		// Убираем "Bearer" из начала строки
		const jwt = token.replace('Bearer ', '');

		// Разделяем токен на три части
		const [, payload] = jwt.split('.');

		// Декодируем полезную нагрузку (payload) из base64
		const decoded = JSON.parse(atob(payload));

		// Получаем текущее время
		// eslint-disable-next-line no-magic-numbers
		const currentTime = Math.floor(Date.now() / 1000);

		// Проверяем срок действия
		return decoded.exp > currentTime;
	} catch (error) {
		console.error('Ошибка при проверке токена:', error);
		return false;
	}
};

export default PrivateRoute;
