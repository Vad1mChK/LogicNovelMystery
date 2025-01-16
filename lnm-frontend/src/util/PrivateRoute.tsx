import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem('AuthToken');

	// Проверяем наличие токена и его валидность
	const isAuthenticated = token !== null && isTokenValid(token);

	const [isTabActive, setIsTabActive] = useState(true);

	useEffect(() => {
		const tabKey = 'activeTab';
		const currentTabId = sessionStorage.getItem(tabKey) || generateTabId();

		const checkOtherTabs = () => {
			const storedTabId = localStorage.getItem(tabKey);

			// Если ключ уже занят, блокируем текущую вкладку
			if (storedTabId && storedTabId !== currentTabId) {
				setIsTabActive(false);
			} else {
				// Устанавливаем текущую вкладку как активную
				localStorage.setItem(tabKey, currentTabId);
			}
		};

		// Генерируем ID текущей вкладки при первой загрузке
		if (!sessionStorage.getItem(tabKey)) {
			sessionStorage.setItem(tabKey, currentTabId);
		}

		checkOtherTabs();

		// Слушаем изменения в `localStorage`
		const handleStorageChange = () => {
			const storedTabId = localStorage.getItem(tabKey);
			if (storedTabId !== currentTabId) {
				setIsTabActive(false);
			}
		};

		window.addEventListener('storage', handleStorageChange);

		// Удаляем текущую вкладку из `localStorage` при закрытии
		const handleBeforeUnload = () => {
			const storedTabId = localStorage.getItem(tabKey);
			if (storedTabId === currentTabId) {
				localStorage.removeItem(tabKey);
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('beforeunload', handleBeforeUnload);

			// Убираем вкладку из `localStorage` при размонтировании
			const storedTabId = localStorage.getItem(tabKey);
			if (storedTabId === currentTabId) {
				localStorage.removeItem(tabKey);
			}
		};
	}, []);

	// Перенаправление, если вкладка не активна
	if (!isTabActive) {
		return <Navigate to="/tab-error" />;
	}

	// Перенаправление, если пользователь не авторизован
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

// Генерация уникального идентификатора вкладки
// eslint-disable-next-line no-magic-numbers
const generateTabId = (): string => Math.random().toString(36).substring(2);

export default PrivateRoute;
