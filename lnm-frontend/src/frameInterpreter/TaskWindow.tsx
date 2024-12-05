import React from "react";
import "prismjs/themes/prism-twilight.css";
import { LnmTaskType } from "./types.ts";

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
		<form>
			<p>{questionText.replace(/\n/, '<br/>')}</p>
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
								checked={index === 0}
								required={index === 0}
							/>
							<label htmlFor={`select-many-${index}`}>
								{option}
							</label>
						</li>
					)) ?? <li>Error loading answer options</li>}
				</ul>
			)}
			<input type='submit' />
		</form>
	);
};

export default TaskWindow;
