import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
	const mockOnChange = jest.fn();
	const languages = [
		{ code: 'en', label: 'English' },
		{ code: 'fr', label: 'French' },
		{ code: 'es', label: 'Spanish' },
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the component with dark mode enabled', () => {
		render(
			<LanguageSelector
				dark={true}
				currentLanguage="en"
				languages={languages}
				onChange={mockOnChange}
			/>
		);

		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText(/Language/g)).toBeInTheDocument();
	});

	it('renders the component with dark mode disabled', () => {
		render(
			<LanguageSelector
				dark={false}
				currentLanguage="en"
				languages={languages}
				onChange={mockOnChange}
			/>
		);

		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText(/Language/g)).toBeInTheDocument();
	});

	it('displays the current language correctly', () => {
		render(
			<LanguageSelector
				dark={false}
				currentLanguage="es"
				languages={languages}
				onChange={mockOnChange}
			/>
		);

		expect(screen.getByText('Spanish')).toBeInTheDocument();
	});

	it('displays the Translate icon', () => {
		render(
			<LanguageSelector
				dark={false}
				currentLanguage="en"
				languages={languages}
				onChange={mockOnChange}
			/>
		);

		const icon = screen.getByTestId('TranslateIcon');
		expect(icon).toBeInTheDocument();
	});
});
