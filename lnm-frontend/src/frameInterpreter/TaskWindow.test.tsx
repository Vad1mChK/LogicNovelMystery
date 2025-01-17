// src/components/__tests__/TaskWindow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import TaskWindow from './TaskWindow';
import {
	LnmCompleteQueryTask,
	LnmSelectOneTask,
	LnmTask,
	LnmTaskType,
	LnmWriteKnowledgeTask,
} from './types';
import { validateTask } from './communication/taskValidation';
import userEvent from '@testing-library/user-event';

jest.mock('i18next', () => ({
	t: (text: string) => text,
}));
// Mock external dependencies
jest.mock('./communication/taskValidation', () => ({
	validateTask: jest.fn(),
}));

// Mock child components if they have complex implementations
jest.mock('../markupElements/SyntaxHighlightInput', () => () => (
	<div data-testid="SyntaxHighlightInput" />
));
jest.mock(
	'../markupElements/TextSyntaxHighlighter',
	() =>
		({ input }: { input: string }) => <span>{input}</span>
);
jest.mock(
	'../markupElements/HintDisplay',
	() =>
		({ hintText }: { hintText: string }) => <div>{hintText}</div>
);

// Define the mocked validateTask function
const mockedValidateTask = validateTask as jest.Mock;

// Define a helper function to render the component with necessary props
const renderTaskWindow = (
	task: LnmTask,
	onSubmit?: (result: boolean) => void
) => {
	render(<TaskWindow task={task} onSubmit={onSubmit} />);
};

describe('TaskWindow', () => {
	const mockOnSubmit = jest.fn();

	const baseTask: LnmSelectOneTask = {
		id: 'eep',
		questionText: 'What is the capital of France?',
		nextFrameOnSuccess: '',
		nextFrameOnFailure: '',
		type: LnmTaskType.SELECT_ONE,
		options: ['Paris', 'London', 'Berlin'],
		correctAnswerIndex: 0,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the submit button for SELECT_ONE task', () => {
		renderTaskWindow(baseTask, mockOnSubmit);
		expect(screen.getByTestId('submit-button')).toBeInTheDocument();
		// Additional assertions based on the component's initial render
	});

	it('displays options as radio buttons for SELECT_ONE task', () => {
		renderTaskWindow(baseTask, mockOnSubmit);

		baseTask.options?.forEach((option) => {
			expect(screen.getByLabelText(option)).toBeInTheDocument();
			expect(
				screen.getByRole('radio', { name: option })
			).toBeInTheDocument();
		});
	});

	it('allows selecting one option and submitting the form', async () => {
		renderTaskWindow(baseTask, mockOnSubmit);

		const radioOption = screen.getByLabelText('Paris');
		await userEvent.click(radioOption);
		expect(radioOption).toBeChecked();

		mockedValidateTask.mockResolvedValueOnce(true);

		const submitButton = screen.getByRole('button', {
			name: /submitButton/i,
		});
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockedValidateTask).toHaveBeenCalledWith(baseTask, 0); // 'Paris' is index 0
			expect(mockOnSubmit).toHaveBeenCalledWith(true);
		});
	});

	it('handles validation failure gracefully', async () => {
		renderTaskWindow(baseTask, mockOnSubmit);

		const radioOption = screen.getByLabelText('Berlin');
		await userEvent.click(radioOption);
		expect(radioOption).toBeChecked();

		mockedValidateTask.mockResolvedValueOnce(false);

		const submitButton = screen.getByRole('button', {
			name: /submitButton/i,
		});
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockedValidateTask).toHaveBeenCalledWith(baseTask, 2); // 'Berlin' is index 0
			expect(mockOnSubmit).toHaveBeenCalledWith(false);
		});
	});

	it('renders checkboxes for SELECT_MANY task and handles multiple selections', async () => {
		const selectManyTask: LnmTask = {
			...baseTask,
			type: LnmTaskType.SELECT_MANY,
			questionText: 'Select all prime numbers.',
			options: ['2', '3', '4', '5'],
			correctAnswerIndices: [0, 1, 3],
		};

		renderTaskWindow(selectManyTask, mockOnSubmit);

		const checkbox2 = screen.getByLabelText('2');
		const checkbox3 = screen.getByLabelText('3');
		const checkbox4 = screen.getByLabelText('4');
		const checkbox5 = screen.getByLabelText('5');

		// Select multiple checkboxes
		await userEvent.click(checkbox2);
		await userEvent.click(checkbox3);
		await userEvent.click(checkbox5);

		expect(checkbox2).toBeChecked();
		expect(checkbox3).toBeChecked();
		expect(checkbox4).not.toBeChecked();
		expect(checkbox5).toBeChecked();

		mockedValidateTask.mockResolvedValueOnce(true);

		const submitButton = screen.getByRole('button', {
			name: /submitButton/i,
		});
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockedValidateTask).toHaveBeenCalledWith(
				selectManyTask,
				[0, 1, 3]
			); // Selected indices: 0,1,3
			expect(mockOnSubmit).toHaveBeenCalledWith(true);
		});
	});

	it('displays a text input and not radio/checkboxes for WRITE_KNOWLEDGE tasks', async () => {
		const writeTask: LnmWriteKnowledgeTask = {
			...baseTask,
			type: LnmTaskType.WRITE_KNOWLEDGE,
			testCases: [],
			knowledge: [],
			hint: '',
		};

		renderTaskWindow(writeTask, mockOnSubmit);

		const textInput = screen.getByTestId('SyntaxHighlightInput');
		expect(textInput).toBeInTheDocument();

		const radios = screen.queryAllByRole('radio');
		expect(radios).toHaveLength(0);

		const checkboxes = screen.queryAllByRole('checkbox');
		expect(checkboxes).toHaveLength(0);
	});

	it('displays a text input and not radio/checkboxes for COMPLETE_QUERY tasks', async () => {
		const writeTask: LnmCompleteQueryTask = {
			...baseTask,
			type: LnmTaskType.COMPLETE_QUERY,
			expectedResults: [],
			knowledge: [],
			hint: '',
		};

		renderTaskWindow(writeTask, mockOnSubmit);

		const textInput = screen.getByTestId('SyntaxHighlightInput');
		expect(textInput).toBeInTheDocument();

		const radios = screen.queryAllByRole('radio');
		expect(radios).toHaveLength(0);

		const checkboxes = screen.queryAllByRole('checkbox');
		expect(checkboxes).toHaveLength(0);
	});
});
