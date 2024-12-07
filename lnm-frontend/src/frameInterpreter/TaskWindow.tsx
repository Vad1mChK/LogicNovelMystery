import React from 'react';
import 'prismjs/themes/prism-twilight.css';
import { LnmTaskType } from './types.ts';
import SyntaxHighlightInput from '../markupElements/SyntaxHighlightInput.tsx';
import SyntaxHighlightDisplayInline from "../markupElements/SyntaxHighlightDisplayInline.tsx";
import SyntaxHighlightDisplay from "../markupElements/SyntaxHighlightDisplay.tsx";

interface TaskWindowProps {
	taskType: LnmTaskType;
	questionText: string;
	placeholderCode?: string;
	options?: string[];
	correctAnswerIndices?: number | number[];
}

const TaskWindow: React.FC<TaskWindowProps> = ({
	taskType,
	questionText,
	placeholderCode,
	options,
	correctAnswerIndices,
}) => {
	return (
		<form
			style={{
				width: '50vw',
				height: '50vh',
			}}
		>
			<p>
				{questionText}
				<SyntaxHighlightDisplay
					value={'friends(X, Y) :-\n\tfriend(X, Y);\n\tfriend(Y, X).'}
				/>
				4 5 6
				<SyntaxHighlightDisplayInline value="friends(Who, vadim)." />
			</p>
			{taskType == LnmTaskType.SELECT_MANY && (
				<ul>
					{options?.map((option, index) => (
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
			{taskType == LnmTaskType.SELECT_ONE && (
				<ul>
					{options?.map((option, index) => (
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
			<SyntaxHighlightInput
				width="75%"
				height="50%"
				value="f(X, Y) :- X \= Y."
				placeholder="Your code goes here..."
			/>
			<input type="submit" />
		</form>
	);
};

export default TaskWindow;
