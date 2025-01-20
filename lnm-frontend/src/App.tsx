import React, { /*useContext, */ useEffect } from 'react';
import {
	Routes,
	Route,
	Navigate,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import './App.css';
import './css/global.scss';
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import SelectMode from './pages/SelectMode';
import GamePage from './pages/GamePage';

import SecretPage from './pages/SecretPage';

import TagManager from 'react-gtm-module';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
import WaitRoom from './pages/WaitRoom.tsx';
import PrivateRoute, { isTokenValid } from './util/PrivateRoute';
import TabErrorPage from './pages/TabErrorPage';
import LandingPage from './pages/LandingPage';

Sentry.init({
	dsn: 'https://2a79b7cbcd0c952c1d8bb6dcf79cc459@o4508292474339328.ingest.de.sentry.io/4508292540530768',
	integrations: [new BrowserTracing()],
	// eslint-disable-next-line no-magic-numbers
	tracesSampleRate: 0.3,
});

const App: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const authToken = localStorage.getItem('AuthToken');

	// Перенаправляем на последнюю страницу только с `/auth/login`
	useEffect(() => {
		if (
			(location.pathname === '/auth/login' ||
				location.pathname === '/') &&
			isTokenValid(authToken)
		) {
			const lastVisitedPage =
				localStorage.getItem('lastVisitedPage') || '/main';
			if (lastVisitedPage != location.pathname) {
				navigate(lastVisitedPage, { replace: true });
			}
		}
	}, [location.pathname]);

	useEffect(() => {
		// Сохраняем текущий маршрут в `localStorage`, если токен валиден
		if (isTokenValid(authToken)) {
			localStorage.setItem('lastVisitedPage', location.pathname);
		}
	}, [location.pathname, authToken]);

	useEffect(() => {
		TagManager.initialize({ gtmId: 'GTM-MJ5F957M' });
	}, []);
	const { i18n } = useTranslation();
	const currentLanguage = useSelector(
		(state: RootState) => state.languageState.currentLanguage
	);

	useEffect(() => {
		// Synchronize i18n with Redux on app load
		if (i18n.language !== currentLanguage) {
			i18n.changeLanguage(currentLanguage);
		}
	}, [currentLanguage, i18n]);
	return (
		<Routes>
			<Route path="/landing" element={<LandingPage />} />
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route path="/tab-error" element={<TabErrorPage />} />
			<Route
				path="/main"
				element={
					<PrivateRoute>
						<MainPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="/select"
				element={
					<PrivateRoute>
						<SelectMode />
					</PrivateRoute>
				}
			/>
			<Route
				path="/waitRoom"
				element={
					<PrivateRoute>
						<WaitRoom />
					</PrivateRoute>
				}
			/>
			<Route
				path="/single-player"
				element={
					<PrivateRoute>
						<GamePage />
					</PrivateRoute>
				}
			/>
			<Route
				path="/multi-player"
				element={
					<PrivateRoute>
						<GamePage />
					</PrivateRoute>
				}
			/>
			<Route
				path="/secret"
				element={
					<PrivateRoute>
						<SecretPage />
					</PrivateRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/landing" />} />
		</Routes>
	);
};

export default App;
