import React, { useEffect, useState } from 'react';
import 'prismjs/themes/prism-twilight.css';
import { LnmTask, LnmTaskType } from './types';
import SyntaxHighlightInput from '../markupElements/SyntaxHighlightInput.tsx';
import TextSyntaxHighlighter from '../markupElements/TextSyntaxHighlighter.tsx';
import HintDisplay from '../markupElements/HintDisplay.tsx';
import {
	Checkbox,
	FormControlLabel,
	FormGroup,
	Radio,
	RadioGroup,
} from '@mui/material';
import '../css/TaskWindow.scss';
import { validateTask } from './taskValidation/taskValidation';
import { t } from 'i18next';

interface TaskWindowProps {
	task: LnmTask;
	onSubmit?: (result: boolean) => void;
}

const _WHITE = '#F4F4F4';

const TaskWindow: React.FC<TaskWindowProps> = ({
	task,
	onSubmit = () => {},
}) => {
	const [userInputSelectOne, setUserInputSelectOne] = useState<number | null>(
		null
	);
	const [userInputSelectMany, setUserInputSelectMany] = useState<number[]>(
		[]
	);
	const [userInputText, setUserInputText] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setUserInputSelectOne(null);
		setUserInputSelectMany([]);
		setUserInputText(null);
		setError(null); // Clear error on task change
	}, [task]);

	const handleSubmit = async (ev: React.FormEvent) => {
		ev.preventDefault();
		let finalInput: number | number[] | string;

		switch (task.type) {
			case LnmTaskType.SELECT_ONE: {
				finalInput = userInputSelectOne ?? -1;
				break;
			}
			case LnmTaskType.SELECT_MANY: {
				finalInput = userInputSelectMany;
				break;
			}
			case LnmTaskType.WRITE_KNOWLEDGE:
			case LnmTaskType.COMPLETE_QUERY: {
				finalInput = userInputText ?? '';
				break;
			}
			default: {
				throw new Error('Unsupported task type.');
			}
		}

		try {
			const result = await validateTask(task, finalInput);
			onSubmit(result);
		} catch (e) {
			console.error(e);
			setError(e?.toString ?? 'Unknown error');
		}
	};

	return (
		<form className="task-window" onSubmit={handleSubmit}>
			<div>
				<TextSyntaxHighlighter input={task.questionText} copyable />
				{task.hint && <HintDisplay hintText={task.hint} />}
				<hr />
			</div>
			{task.type === LnmTaskType.SELECT_MANY && (
				<FormGroup>
					{task.options?.map((option, index) => (
						<FormControlLabel
							key={index}
							control={
								<Checkbox
									name="select-many"
									value={index}
									sx={{ color: _WHITE, fontSize: '24px' }}
									color="default"
									onChange={(e) => {
										setUserInputSelectMany(
											(prev: number[] | null) => {
												const val = Number(
													e.target.value
												);
												if (!prev) return [val];
												if (e.target.checked) {
													return [...prev, val];
												} else {
													return prev.filter(
														(item) => item !== val
													);
												}
											}
										);
									}}
								/>
							}
							label={
								<TextSyntaxHighlighter
									input={option}
									copyable={false}
								/>
							}
						/>
					)) ?? <div>Error loading answer options</div>}
				</FormGroup>
			)}
			{task.type === LnmTaskType.SELECT_ONE && (
				<RadioGroup
					name="select-one"
					onChange={(ev) =>
						setUserInputSelectOne(Number(ev.target.value))
					}
				>
					{task.options?.map((option, index) => (
						<FormControlLabel
							key={index}
							control={
								<Radio
									name="select-one"
									value={index}
									defaultChecked={index == 0}
									sx={{
										color: _WHITE,
										fontSize: '24px',
									}}
									color="default"
								/>
							}
							label={
								<TextSyntaxHighlighter
									input={option}
									copyable={false}
								/>
							}
						/>
					)) ?? <div>Error loading answer options</div>}
				</RadioGroup>
			)}
			{(task.type == LnmTaskType.WRITE_KNOWLEDGE ||
				task.type == LnmTaskType.COMPLETE_QUERY) && (
				<SyntaxHighlightInput
					placeholder={t('game.taskWindow.textInput.placeholder')}
					value={task.defaultValue}
					onUpdate={(newValue) => setUserInputText(newValue)}
				/>
			)}
			<div className="task-window-button-row">
				{/*{task.type == LnmTaskType.WRITE_KNOWLEDGE && (*/}
				{/*	<input type="button" value={t('game.taskWindow.testButton')} />*/}
				{/*)}*/}
				<input
					type="submit"
					value={t('game.taskWindow.submitButton')}
				/>
			</div>
			{error && <p className="task-window-error">{error}</p>}
		</form>
	);
};

export default TaskWindow;
