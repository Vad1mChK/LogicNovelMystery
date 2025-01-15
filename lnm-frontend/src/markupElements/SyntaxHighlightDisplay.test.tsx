import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SyntaxHighlightDisplay from './SyntaxHighlightDisplay';
import { copyTextToClipboard } from './markupUtils';
import Prism from 'prismjs';

jest.mock('prismjs', () => ({
	highlight: jest.fn((content) => content),
	languages: { prolog: true },
}));
jest.mock('prismjs/components/prism-prolog', () => {});
jest.mock('i18next', () => ({
	t: jest.fn((key) => key),
}));

// Mock copy-to-clipboard utility
jest.mock('./markupUtils', () => ({
	copyTextToClipboard: jest.fn(),
}));
jest.mock('../css/SyntaxHighlightComponents.scss', () => ({}));
jest.mock('prismjs/themes/prism-twilight.css', () => ({}));

describe('SyntaxHighlightDisplay Component', () => {
	const sampleCode = 'fact(a).';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the component with correct default styles', () => {
		render(<SyntaxHighlightDisplay value={sampleCode} />);

		const container = screen.getByTestId('syntax-highlight-display');
		expect(container).toBeInTheDocument();
		expect(container).toHaveStyle({ width: '100%' });
	});

	it('renders the highlighted code correctly', () => {
		render(<SyntaxHighlightDisplay value={sampleCode} />);

		const preElement = screen.getByTestId('syntax-highlight-display');
		expect(preElement).toBeInTheDocument();
		expect(preElement).toHaveTextContent(sampleCode);
	});

	it('handles Prolog syntax highlighting', () => {
		render(<SyntaxHighlightDisplay value={sampleCode} />);

		expect(Prism.highlight).toHaveBeenCalledWith(
			sampleCode,
			Prism.languages['prolog'],
			'prolog'
		);
	});

	it('displays raw code if Prolog syntax highlighting is unavailable', () => {
		// Simulate absence of Prolog syntax highlighting
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		Prism.languages.prolog = undefined;

		// Spy on console.error to verify error logging
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		render(<SyntaxHighlightDisplay value={sampleCode} />);

		const preElement = screen.getByTestId(
			'syntax-highlight-display-content'
		);
		expect(preElement).toBeInTheDocument();
		expect(preElement).toHaveTextContent(sampleCode);
		// Ensure that highlightedContent is set to raw value
		expect(preElement).not.toHaveProperty(
			'innerHTML',
			`<highlighted>${sampleCode}</highlighted>`
		);

		// Prism.highlight should not have been called
		expect(Prism.highlight).not.toHaveBeenCalled();

		// Verify that console.error was called
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Prolog syntax highlighting data could not be loaded'
		);

		// Restore console.error
		consoleErrorSpy.mockRestore();
	});

	it('copies the code to the clipboard when the copy button is clicked', () => {
		render(<SyntaxHighlightDisplay value={sampleCode} />);
		const copyButton = screen.getByRole('button');

		fireEvent.click(copyButton);

		expect(copyTextToClipboard).toHaveBeenCalledWith(sampleCode);
	});

	it('renders with custom width and height when provided', () => {
		render(
			<SyntaxHighlightDisplay
				value={sampleCode}
				width="50%"
				height="200px"
			/>
		);

		const container = screen.getByTestId('syntax-highlight-display');
		expect(container).toHaveStyle({ width: '50%', height: '200px' });
	});
});
