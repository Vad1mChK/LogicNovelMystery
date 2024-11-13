import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
// import './css/App.css';
import MainPage from './pages/MainPage';
// import SelectedMode from './pages/SelectedMode';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/auth/login" />}
			<Route path="auth/login" element={<Login />} />
			<Route path="auth/register" element={<Register />} />
			<Route path="/main" element={<MainPage />} />
			{/* <Route path="/select" element={<SelectedMode />} /> */}
		</Routes>
	);
};

export default App;
