import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
// import './css/App.css';
// import MainPage from './pages/MainPage';
// import SelectedMode from './pages/SelectedMode';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
	dsn: "https://2a79b7cbcd0c952c1d8bb6dcf79cc459@o4508292474339328.ingest.de.sentry.io/4508292540530768",
	integrations: [new BrowserTracing()],
	tracesSampleRate: 0.3,
})



const App: React.FC = () => {

	return (
		<Routes>
			<Route path="auth/login" element={<Login />} />
			<Route path="auth/register" element={<Register />} />
			<Route path="dashboard" element={<Dashboard />} />
			{/* <Route path="/main" element={<MainPage />} /> */}
			{/* <Route path="/select" element={<SelectedMode />} /> */}
			<Route path="/" element={<Navigate to="auth/login" />} />
		</Routes>
	);
};

export default App;
