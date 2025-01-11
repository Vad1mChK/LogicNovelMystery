import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SyntaxHighlightInput from './SyntaxHighlightInput';
import { copyTextToClipboard } from './markupUtils';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';

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

describe('SyntaxHighlightInput Component', () => {
	const placeholderText = 'Type something here...';
	const initialValue = 'initial code snippet';
	const updatedValue = 'updated code snippet';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Wrapper component to manage state
	const TestComponent = ({
		initialVal = initialValue,
		onUpdate = jest.fn(),
	}) => {
		const [value, setValue] = useState(initialVal);
		return (
			<SyntaxHighlightInput
				placeholder={placeholderText}
				value={value}
				onUpdate={(newValue) => {
					setValue(newValue);
					onUpdate(newValue);
				}}
			/>
		);
	};

	it('renders the component with the correct initial content', () => {
		render(
			<SyntaxHighlightInput
				placeholder={placeholderText}
				value={initialValue}
			/>
		);
		const textarea = screen.getByPlaceholderText(placeholderText);
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveValue(initialValue);
	});

	it('calls the onUpdate callback when text changes', () => {
		const mockOnUpdate = jest.fn();
		render(
			<SyntaxHighlightInput
				placeholder={placeholderText}
				value={initialValue}
				onUpdate={mockOnUpdate}
			/>
		);

		const textarea = screen.getByPlaceholderText(placeholderText);
		fireEvent.change(textarea, { target: { value: updatedValue } });

		expect(mockOnUpdate).toHaveBeenCalledWith(updatedValue);
		expect(textarea).toHaveValue(updatedValue);
	});

	it('handles Tab key insertion correctly', async () => {
		const mockOnUpdate = jest.fn();
		render(<TestComponent onUpdate={mockOnUpdate} />);
		const textarea = screen.getByPlaceholderText(placeholderText);
		const user = userEvent.setup();

		await user.type(textarea, '{Tab}');

		expect(mockOnUpdate).toHaveBeenCalledWith(`${initialValue}\t`);
		expect(textarea).toHaveValue(`${initialValue}\t`);
	});

	it('displays a warning when Tab key is pressed and disappears after timeout', async () => {
		// Use fake timers
		jest.useFakeTimers();
		render(<SyntaxHighlightInput value={initialValue} />);
		const textarea = screen.getByRole('textbox');

		// Simulate pressing the Tab key
		fireEvent.keyDown(textarea, { key: 'Tab', preventDefault: jest.fn() });

		// Assert that the warning message appears
		expect(
			screen.getByText('game.taskWindow.textInput.tabWarning')
		).toBeInTheDocument();

		// Simulate the timeout
		jest.runAllTimers();

		// Use waitFor to ensure the element disappears after the timeout
		await waitFor(() =>
			expect(
				screen.queryByText('game.taskWindow.textInput.tabWarning')
			).not.toBeInTheDocument()
		);
	});

	it('copies the code to the clipboard when the copy button is clicked', () => {
		render(<SyntaxHighlightInput value={initialValue} />);
		const copyButton = screen.getByRole('button', {
			name: 'game.taskWindow.syntaxHighlight.copy',
		});

		fireEvent.click(copyButton);

		expect(copyTextToClipboard).toHaveBeenCalledWith(initialValue);
	});

	it('clears the content when the clear button is clicked', () => {
		const mockOnUpdate = jest.fn();
		render(
			<SyntaxHighlightInput
				value={initialValue}
				onUpdate={mockOnUpdate}
			/>
		);
		const clearButton = screen.getByRole('button', {
			name: 'game.taskWindow.syntaxHighlight.clear',
		});

		fireEvent.click(clearButton);

		expect(mockOnUpdate).toHaveBeenCalledWith('');
		const textarea = screen.getByRole('textbox');
		expect(textarea).toHaveValue('');
	});

	it('restores the initial content when the restore button is clicked', () => {
		const mockOnUpdate = jest.fn();
		render(
			<SyntaxHighlightInput
				value={initialValue}
				onUpdate={mockOnUpdate}
			/>
		);
		const textarea = screen.getByRole('textbox');
		const restoreButton = screen.getByRole('button', {
			name: 'game.taskWindow.syntaxHighlight.restore',
		});

		// Change content
		fireEvent.change(textarea, { target: { value: updatedValue } });
		expect(textarea).toHaveValue(updatedValue);

		// Click restore
		fireEvent.click(restoreButton);
		expect(mockOnUpdate).toHaveBeenCalledWith(initialValue);
		expect(textarea).toHaveValue(initialValue);
	});

	it('synchronizes scrolling between the textarea and pre element', () => {
		render(<SyntaxHighlightInput value={initialValue} />);

		// Use data-testid to select the elements
		const textarea = screen.getByTestId('syntax-highlight-textarea');
		const preElement = screen.getByTestId('syntax-highlight-display');

		// Simulate scrolling on the textarea
		fireEvent.scroll(textarea, {
			target: { scrollTop: 50, scrollLeft: 20 },
		});

		// Assert that the <pre> element's scroll position is updated
		expect(preElement.scrollTop).toBe(50);
		expect(preElement.scrollLeft).toBe(20);
	});
});
