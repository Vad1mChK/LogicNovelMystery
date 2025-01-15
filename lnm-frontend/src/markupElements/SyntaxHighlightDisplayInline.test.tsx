// SyntaxHighlightDisplayInline.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SyntaxHighlightDisplayInline from './SyntaxHighlightDisplayInline';
import { copyTextToClipboard } from './markupUtils';
import Prism from 'prismjs';

// Mock the copy-to-clipboard utility
jest.mock('./markupUtils', () => ({
	copyTextToClipboard: jest.fn(),
}));

// Mock i18next's `t` function
jest.mock('i18next', () => ({
	t: (key: string) => key, // Simple mock: returns the key itself
}));

// Mock Prism.js with a mutable languages object
jest.mock('prismjs', () => {
	const actualPrism = jest.requireActual('prismjs');
	return {
		...actualPrism,
		highlight: jest.fn(
			(value: string) => `<highlighted>${value}</highlighted>`
		),
		languages: {
			prolog: true, // Initially set prolog to true
		},
	};
});
jest.mock('prismjs/components/prism-prolog', () => {});

// Mock copy-to-clipboard utility
jest.mock('./markupUtils', () => ({
	copyTextToClipboard: jest.fn(),
}));
jest.mock('../css/SyntaxHighlightComponents.scss', () => ({}));
jest.mock('prismjs/themes/prism-twilight.css', () => ({}));

describe('SyntaxHighlightDisplayInline Component', () => {
	const sampleCode = 'fact(a).';

	beforeEach(() => {
		jest.clearAllMocks();
		// @ts-expect-error Prism grammar should not normally be boolean
		Prism.languages.prolog = true; // Reset to default before each test
	});

	it('renders the highlighted code correctly when Prolog is available', () => {
		render(<SyntaxHighlightDisplayInline value={sampleCode} />);

		const codeElement = screen.getByTestId(
			'syntax-highlight-display-inline-code'
		);
		expect(codeElement).toBeInTheDocument();
		expect(codeElement).toHaveProperty(
			'innerHTML',
			`<highlighted>${sampleCode}</highlighted>`
		);

		// Ensure Prism.highlight was called with correct arguments
		expect(Prism.highlight).toHaveBeenCalledWith(
			sampleCode,
			Prism.languages['prolog'],
			'prolog'
		);
	});

	it('renders the copy button when copyable is true (default)', () => {
		render(<SyntaxHighlightDisplayInline value={sampleCode} />);

		const copyButton = screen.getByTestId('syntax-highlight-copy-button');
		expect(copyButton).toBeInTheDocument();
	});

	it('does not render the copy button when copyable is false', () => {
		render(
			<SyntaxHighlightDisplayInline value={sampleCode} copyable={false} />
		);

		const copyButton = screen.queryByTestId('syntax-highlight-copy-button');
		expect(copyButton).not.toBeInTheDocument();
	});

	it('copies the code to the clipboard when the copy button is clicked', () => {
		render(<SyntaxHighlightDisplayInline value={sampleCode} />);

		screen.debug();

		const copyButton = screen.getByRole('button');

		fireEvent.click(copyButton);

		expect(copyTextToClipboard).toHaveBeenCalledWith(sampleCode);
	});

	it('handles missing Prolog syntax highlighting by logging error and displaying raw code', () => {
		// Simulate absence of Prolog syntax highlighting
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		Prism.languages.prolog = undefined;

		// Spy on console.error
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		render(<SyntaxHighlightDisplayInline value={sampleCode} />);

		const codeElement = screen.getByTestId(
			'syntax-highlight-display-inline-code'
		);
		expect(codeElement).toBeInTheDocument();
		expect(codeElement).toHaveTextContent(sampleCode);
		expect(codeElement).not.toHaveProperty(
			'innerHTML',
			`<highlighted>${sampleCode}</highlighted>`
		);

		// Ensure Prism.highlight was not called
		expect(Prism.highlight).not.toHaveBeenCalled();

		// Ensure console.error was called with the correct message
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Prolog syntax highlighting data could not be loaded'
		);

		// Restore console.error
		consoleErrorSpy.mockRestore();
	});

	it('renders with custom props (copyable=false)', () => {
		render(
			<SyntaxHighlightDisplayInline value={sampleCode} copyable={false} />
		);

		const codeElement = screen.getByTestId(
			'syntax-highlight-display-inline-code'
		);
		expect(codeElement).toHaveProperty(
			'innerHTML',
			`<highlighted>${sampleCode}</highlighted>`
		);

		// Ensure copy button is not present
		const copyButton = screen.queryByTestId('syntax-highlight-copy-button');
		expect(copyButton).not.toBeInTheDocument();
	});

	it('handles missing Prolog syntax highlighting by logging error and displaying raw code', () => {
		// Simulate absence of Prolog syntax highlighting
		// eslint-disable-next-line
		// @ts-ignore
		Prism.languages.prolog = undefined;

		// Spy on console.error
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		render(<SyntaxHighlightDisplayInline value={sampleCode} />);

		const codeElement = screen.getByTestId(
			'syntax-highlight-display-inline-code'
		);
		expect(codeElement).toBeInTheDocument();
		expect(codeElement).toHaveTextContent(sampleCode);
		expect(codeElement).not.toHaveProperty(
			'innerHTML',
			`<highlighted>${sampleCode}</highlighted>`
		);

		// Ensure Prism.highlight was not called
		expect(Prism.highlight).not.toHaveBeenCalled();

		// Ensure console.error was called with the correct message
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Prolog syntax highlighting data could not be loaded'
		);

		// Restore console.error
		consoleErrorSpy.mockRestore();
	});
});
