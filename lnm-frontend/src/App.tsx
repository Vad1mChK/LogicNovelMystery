import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Dashboard from './pages/Dashboard.tsx';

const App: React.FC = () => {
	return (
		<Routes>
			<Route path="auth/login" element={<Login />} />
			<Route path="auth/register" element={<Register />} />
			<Route path="dashboard" element={<Dashboard />} />

			<Route path="/" element={<Navigate to="auth/login" />} />
		</Routes>
	);
};

export default App;
