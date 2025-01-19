import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import GameSelection from './SelectMode';
import '@testing-library/jest-dom';
import axios from 'axios';

// Мокаем axios
jest.mock('axios');

// Create a mock for dispatch
const mockDispatch = jest.fn();

// Mock react-redux to return the mock dispatch
jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'), // Preserve other functionalities
	useDispatch: () => mockDispatch,
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

jest.mock('../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081',
}));

describe('GameSelection Component', () => {
	beforeEach(() => {
		// Очистим localStorage перед каждым тестом
		localStorage.clear();
	});

	it('should render the start game button and navigate based on selected mode', async () => {
		// Мокаем axios
		(axios.post as jest.Mock).mockResolvedValueOnce({});

		render(
			<Router>
				<GameSelection />
			</Router>
		);

		// Ищем элементы через alt текст
		const gameForOneButton = screen.getByAltText(/character1/i);
		fireEvent.click(gameForOneButton);

		const startGameButton = screen.getByRole('button', {
			name: /start game/i,
		});
		expect(startGameButton).toBeEnabled();

		await act(async () => {
			fireEvent.click(startGameButton);
		});

		expect(mockNavigate).toHaveBeenCalledWith('/single-player');
	});

	it('should render the start game button and navigate to wait room when "Game for two" is selected', async () => {
		(axios.post as jest.Mock).mockResolvedValueOnce({});

		render(
			<Router>
				<GameSelection />
			</Router>
		);

		const gameForTwoButton = screen.getByAltText(/character2/i);
		fireEvent.click(gameForTwoButton);

		const startGameButton = screen.getByRole('button', {
			name: /start game/i,
		});
		expect(startGameButton).toBeEnabled();

		await act(async () => {
			fireEvent.click(startGameButton);
		});

		expect(mockNavigate).toHaveBeenCalledWith('/waitRoom');
	});
});
