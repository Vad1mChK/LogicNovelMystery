import React from 'react';
import 'prismjs/themes/prism-twilight.css';
import { LnmTask, LnmTaskType } from './types.ts';
import SyntaxHighlightInput from '../markupElements/SyntaxHighlightInput.tsx';
import TextSyntaxHighlighter from '../markupElements/TextSyntaxHighlighter.tsx';
import HintDisplay from "../markupElements/HintDisplay.tsx";

interface TaskWindowProps {
	task: LnmTask,
}

const TaskWindow: React.FC<TaskWindowProps> = ({
	task
}) => {
	return (
		<form
			style={{
				width: '50vw',
				height: '50vh',
			}}
		>
			<TextSyntaxHighlighter input={task.questionText} />
			{task.hint && <HintDisplay hintText={task.hint} />}
			{task.type == LnmTaskType.SELECT_MANY && (
				<ul>
					{task.options?.map((option, index) => (
						<li key={index}>
							<input
								type="checkbox"
								name="select-many"
								id={`select-many-${index}`}
								value={index}
							/>
							<label htmlFor={`select-many-${index}`}>
								{option}
							</label>
						</li>
					)) ?? <li>Error loading answer options</li>}
				</ul>
			)}
			{task.type == LnmTaskType.SELECT_ONE && (
				<ul>
					{task.options?.map((option, index) => (
						<li key={index}>
							<input
								type="radio"
								name="select-many"
								id={`select-many-${index}`}
								defaultChecked={index === 0}
								required={index === 0}
							/>
							<label htmlFor={`select-many-${index}`}>
								{option}
							</label>
						</li>
					)) ?? <li>Error loading answer options</li>}
				</ul>
			)}
			{(task.type == LnmTaskType.WRITE_KNOWLEDGE ||
				task.type == LnmTaskType.COMPLETE_QUERY) && (
				<SyntaxHighlightInput placeholder={task.default} />
			)}
			<input type="submit" value={'Отправить'} />
		</form>
	);
};

export default TaskWindow;
