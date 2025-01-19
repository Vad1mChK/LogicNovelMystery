import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Needed for routing
import Register from './Register';

// Mock axios to simulate API calls
jest.mock('axios');

// Mocking the i18n translation hook
jest.mock('react-i18next', () => ({
	useTranslation: jest.fn(() => ({
		t: (key: string) => key, // Mock translation function
	})),
}));

jest.mock('../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081/',
}));

describe('Register Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the registration form', () => {
		render(
			<Router>
				<Register />
			</Router>
		);

		expect(
			screen.getByPlaceholderText('register.usernamePlaceholder')
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('register.emailPlaceholder')
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('register.passwordPlaceholder')
		).toBeInTheDocument();
		expect(screen.getByText('register.registerButton')).toBeInTheDocument();
		expect(
			screen.getByText('register.alreadyHaveAccount')
		).toBeInTheDocument();
		expect(screen.getByText('register.loginLink')).toBeInTheDocument();
	});

	it('should validate email input and show error for invalid email', () => {
		render(
			<Router>
				<Register />
			</Router>
		);

		const usernameInput = screen.getByPlaceholderText(
			'register.usernamePlaceholder'
		);
		const emailInput = screen.getByPlaceholderText(
			'register.emailPlaceholder'
		);
		const passwordInput = screen.getByPlaceholderText(
			'register.passwordPlaceholder'
		);
		const registerButton = screen.getByText('register.registerButton');

		fireEvent.change(usernameInput, { target: { value: 'testuser' } });
		fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });

		fireEvent.click(registerButton);

		expect(screen.getByText('register.invalidEmail')).toBeInTheDocument(); // Assuming "register.invalidEmail" is the key for the error message
	});
});
