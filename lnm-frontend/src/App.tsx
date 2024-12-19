import React, { /*useContext, */ useEffect } from 'react';
import { Routes, Route, Navigate /*, useLocation*/ } from 'react-router-dom';
import './App.css';
import './css/global.scss';

import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import SelectMode from './pages/SelectMode';
import GamePage from './pages/GamePage';

import SecretPage from './pages/SecretPage.tsx';

import TagManager from 'react-gtm-module';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';

Sentry.init({
	dsn: 'https://2a79b7cbcd0c952c1d8bb6dcf79cc459@o4508292474339328.ingest.de.sentry.io/4508292540530768',
	integrations: [new BrowserTracing()],
	tracesSampleRate: 0.3,
});

const App: React.FC = () => {
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
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route path="/main" element={<MainPage />} />
			<Route path="/select" element={<SelectMode />} />
			<Route path="/single-player" element={<GamePage />} />
			<Route path="/secret" element={<SecretPage />} />
			<Route path="/" element={<Navigate to="/auth/login" />} />
		</Routes>
	);
};

export default App;
