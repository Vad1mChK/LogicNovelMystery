import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const form = document.getElementById('form') as HTMLFormElement | null;
		const checkbox = document.getElementById(
			'pass-logging'
		) as HTMLInputElement | null;

		const handleSubmit = (event: Event) => {
			event.preventDefault();
			if (checkbox && checkbox.checked) {
				navigate('/menu'); // Переход на страницу /menu
			}
		};

		if (form) {
			form.addEventListener('submit', handleSubmit);
		}

		return () => {
			if (form) {
				form.removeEventListener('submit', handleSubmit);
			}
		};
	}, [navigate]);

	return null;
};

// Используем BrowserRouter, чтобы задать контекст для useNavigate
ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
);
