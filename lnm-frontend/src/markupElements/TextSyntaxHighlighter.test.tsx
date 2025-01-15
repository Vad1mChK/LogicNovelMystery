// TextSyntaxHighlighter.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextSyntaxHighlighter from './TextSyntaxHighlighter';

// Mock SyntaxHighlightDisplay component
jest.mock('./SyntaxHighlightDisplay', () => ({
	__esModule: true,
	default: ({ value }: { value: string }) => (
		<div data-testid="syntax-highlight-display">{value}</div>
	),
}));

// Mock SyntaxHighlightDisplayInline component
jest.mock('./SyntaxHighlightDisplayInline', () => ({
	__esModule: true,
	default: ({ value }: { value: string }) => (
		<span data-testid="syntax-highlight-display-inline">{value}</span>
	),
}));

describe('TextSyntaxHighlighter Component', () => {
	it('renders plain text without any code segments', () => {
		const input = 'Hello, World! This is a simple text.';
		render(<TextSyntaxHighlighter input={input} />);

		// Ensure no code components are rendered
		expect(
			screen.queryByTestId('syntax-highlight-display')
		).not.toBeInTheDocument();
		expect(
			screen.queryByTestId('syntax-highlight-display-inline')
		).not.toBeInTheDocument();

		// Check for the presence of the text
		expect(
			screen.getByText('Hello, World! This is a simple text.')
		).toBeInTheDocument();
	});

	it('renders text with block code segments correctly', () => {
		const input =
			'Here is a code block:\n```\nconsole.log("Hello World");\n```';
		render(<TextSyntaxHighlighter input={input} />);

		// Check for the text before the code block
		expect(screen.getByText('Here is a code block:')).toBeInTheDocument();

		// Check for the block code
		const blockCode = screen.getByTestId('syntax-highlight-display');
		expect(blockCode).toBeInTheDocument();
		expect(blockCode).toHaveTextContent('console.log("Hello World");');

		// Ensure no inline code is rendered
		expect(
			screen.queryByTestId('syntax-highlight-display-inline')
		).not.toBeInTheDocument();
	});

	it('handles multiple inline code segments within the text', () => {
		const input = '`code1` and `code2` are both inline codes.';
		render(<TextSyntaxHighlighter input={input} />);

		// Use a function matcher to check for the surrounding text
		const textMatcher = (content: string) =>
			content.includes('and') &&
			content.includes('are both inline codes.');
		const container = screen.getByText(textMatcher);

		expect(container).toBeInTheDocument();

		// Check for the inline code segments
		const inlineCodes = screen.getAllByTestId(
			'syntax-highlight-display-inline'
		);
		expect(inlineCodes).toHaveLength(2);
		expect(inlineCodes[0]).toHaveTextContent('code1');
		expect(inlineCodes[1]).toHaveTextContent('code2');
	});

	it('handles multiple block code segments within the text', () => {
		const input =
			'First block:\n```\nconsole.log("First");\n```\nSecond block:\n```\nconsole.log("Second");\n```';
		render(<TextSyntaxHighlighter input={input} />);

		// Use a function matcher to check for the surrounding text
		const textMatcher = (content: string) =>
			content.includes('First block:') &&
			content.includes('Second block:');
		const container = screen.getByText(textMatcher);

		expect(container).toBeInTheDocument();

		// Check for the block code segments
		const blockCodes = screen.getAllByTestId('syntax-highlight-display');
		expect(blockCodes).toHaveLength(2);
		expect(blockCodes[0]).toHaveTextContent('console.log("First");');
		expect(blockCodes[1]).toHaveTextContent('console.log("Second");');
	});

	it('replaces newline characters with br elements in text segments', () => {
		const input = 'Line1\nLine2\nLine3';
		render(<TextSyntaxHighlighter input={input} />);

		const textMatcher = (content: string) =>
			content.includes('Line1') &&
			content.includes('Line2') &&
			content.includes('Line3');
		const container = screen.getByText(textMatcher);

		expect(container).toBeInTheDocument();

		// Check that <br/> elements are rendered between lines
		const brElements = container.querySelectorAll('br');
		expect(brElements).toHaveLength(2); // Two <br/> elements between three lines
	});

	it('renders empty content when input is empty', () => {
		render(<TextSyntaxHighlighter input="" />);

		// Ensure no content is rendered
		expect(
			screen.queryByTestId('syntax-highlight-display')
		).not.toBeInTheDocument();
		expect(
			screen.queryByTestId('syntax-highlight-display-inline')
		).not.toBeInTheDocument();
	});

	it('handles input with only block code', () => {
		const input = '```\nconst a = 5;\n```';
		render(<TextSyntaxHighlighter input={input} />);

		// Check for the block code
		const blockCode = screen.getByTestId('syntax-highlight-display');
		expect(blockCode).toBeInTheDocument();
		expect(blockCode).toHaveTextContent('const a = 5;');

		// Ensure no inline code or text is rendered
		expect(
			screen.queryByTestId('syntax-highlight-display-inline')
		).not.toBeInTheDocument();
	});

	it('handles input with only inline code', () => {
		const input = 'This is `inline code` only.';
		render(<TextSyntaxHighlighter input={input} />);

		// Check for the inline code
		const inlineCode = screen.getByTestId(
			'syntax-highlight-display-inline'
		);
		expect(inlineCode).toBeInTheDocument();
		expect(inlineCode).toHaveTextContent('inline code');

		// Use a function matcher to check for the surrounding text
		const textMatcher = (content: string) =>
			content.includes('This is') && content.includes('only.');
		const container = screen.getByText(textMatcher);

		expect(container).toBeInTheDocument();

		// Ensure no block code is rendered
		expect(
			screen.queryByTestId('syntax-highlight-display')
		).not.toBeInTheDocument();
	});

	it('handles multiple code segments and newlines', () => {
		const input = `
Start of text.
Inline code: \`let x = 10;\`.
Block code:
\`\`\`
function test() {
  return x;
}
\`\`\`
End of text.
    `.trim();

		render(<TextSyntaxHighlighter input={input} />);

		// Use a function matcher to check for the surrounding text
		const textMatcher = (content: string) =>
			content.includes('Start of text.') &&
			content.includes('Inline code:') &&
			content.includes('Block code:') &&
			content.includes('End of text.');
		const container = screen.getByText(textMatcher);

		expect(container).toBeInTheDocument();

		// Check for the inline code
		const inlineCode = screen.getByTestId(
			'syntax-highlight-display-inline'
		);
		expect(inlineCode).toBeInTheDocument();
		expect(inlineCode).toHaveTextContent('let x = 10;');

		// Check for the block code
		const blockCode = screen.getByTestId('syntax-highlight-display');
		expect(blockCode).toBeInTheDocument();
		expect(blockCode).toHaveTextContent('function test() { return x; }');

		// Check for <br/> elements
		const brElements = container.querySelectorAll('br');
		expect(brElements.length).toBeGreaterThanOrEqual(3); // Depending on how newlines are handled
	});
});
