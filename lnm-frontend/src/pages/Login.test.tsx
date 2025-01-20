import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Needed for routing
import Login from './Login';

jest.mock('../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081/',
}));

// Mock axios to simulate API calls
jest.mock('axios');

// Mocking the i18n translation hook
jest.mock('i18next', () => ({
	t: (key: string) => key, // Mock translation function
}));

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

describe('Login Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the login form', () => {
		render(
			<Router>
				<Login />
			</Router>
		);

		expect(
			screen.getByPlaceholderText('login.usernamePlaceholder')
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('login.passwordPlaceholder')
		).toBeInTheDocument();
		expect(screen.getByText('login.loginButton')).toBeInTheDocument();
		expect(screen.getByText('login.noAccount')).toBeInTheDocument();
		expect(screen.getByText('login.registerLink')).toBeInTheDocument();
	});

	it('should update username and password input fields', () => {
		render(
			<Router>
				<Login />
			</Router>
		);

		const usernameInput = screen.getByPlaceholderText(
			'login.usernamePlaceholder'
		);
		const passwordInput = screen.getByPlaceholderText(
			'login.passwordPlaceholder'
		);

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });

		expect(usernameInput).toHaveValue('testuser');
		expect(passwordInput).toHaveValue('password123');
	});

	it('should navigate to the registration page when the register link is clicked', () => {
		render(
			<Router>
				<Login />
			</Router>
		);

		const registerLink = screen.getByText('login.registerLink');
		fireEvent.click(registerLink);

		expect(window.location.pathname).toBe('/auth/register'); // Assuming the register page is at '/auth/register'
	});
});
