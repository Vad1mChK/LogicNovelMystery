import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HintDisplay from './HintDisplay';

// Mock i18next translations
jest.mock('i18next', () => ({
	t: jest.fn((key) => key),
}));

// Mock the TextSyntaxHighlighter component
jest.mock('./TextSyntaxHighlighter', () => ({
	__esModule: true,
	default: ({ input }: { input: string }) => <span>{input}</span>,
}));

jest.mock('../css/HintDisplay.scss', () => ({}));

describe('HintDisplay Component', () => {
	const hintText = 'This is a sample hint text.';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		render(<HintDisplay hintText={hintText} />);

		expect(
			screen.getByText('game.taskWindow.hint.hintTitle')
		).toBeInTheDocument();
		expect(screen.getByText(hintText)).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('initially hides the hint text', () => {
		render(<HintDisplay hintText={hintText} />);

		const hintElement = screen.getByText(hintText).parentElement;
		expect(hintElement).toHaveClass('hint-display-text-hidden');
	});

	it('toggles hint visibility when clicked', () => {
		render(<HintDisplay hintText={hintText} />);

		const hintElement = screen.getByText(hintText).parentElement;
		const button = screen.getByRole('button');

		// Initially hidden
		expect(hintElement).toHaveClass('hint-display-text-hidden');

		// Click to show the hint
		fireEvent.click(button);
		expect(hintElement).not.toHaveClass('hint-display-text-hidden');

		// Click to hide the hint again
		fireEvent.click(button);
		expect(hintElement).toHaveClass('hint-display-text-hidden');
	});

	it('uses the correct tooltip text for the button', () => {
		render(<HintDisplay hintText={hintText} />);

		const button = screen.getByRole('button');
		expect(button).toHaveAccessibleName('game.taskWindow.hint.toggle');
	});

	it('toggles visibility when the hint text is clicked', () => {
		render(<HintDisplay hintText={hintText} />);

		const hintTextElement = screen.getByText(hintText);
		const hintElement = hintTextElement.parentElement;

		// Initially hidden
		expect(hintElement).toHaveClass('hint-display-text-hidden');

		// Click to show the hint
		fireEvent.click(hintTextElement);
		expect(hintElement).not.toHaveClass('hint-display-text-hidden');

		// Click to hide the hint again
		fireEvent.click(hintTextElement);
		expect(hintElement).toHaveClass('hint-display-text-hidden');
	});
});
