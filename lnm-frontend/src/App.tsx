import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import SelectMode from './pages/SelectMode';
import GamePage from './pages/GamePage';
import Task from './pages/task.tsx';
import { AudioProvider, AudioContext } from './pages/AudioContext';

const App: React.FC = () => {
	return (
		<AudioProvider>
		  <Routes>
			<Route path="/" element={<Navigate to="/auth/login" />} />
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route path="/main" element={<MainPage />} />
			<Route path="/select" element={<SelectMode />} />
			<Route path="/single-player" element={<GamePage />} />
			<Route path="/task" element={<Task />} />
		  </Routes>
		</AudioProvider>
	);
};

export default App;
