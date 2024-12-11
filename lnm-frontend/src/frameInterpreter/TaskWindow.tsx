import React from 'react';
import 'prismjs/themes/prism-twilight.css';
import { LnmTask, LnmTaskType } from './types.ts';
import SyntaxHighlightInput from '../markupElements/SyntaxHighlightInput.tsx';
import TextSyntaxHighlighter from '../markupElements/TextSyntaxHighlighter.tsx';
import HintDisplay from "../markupElements/HintDisplay.tsx";
import { Checkbox, colors, FormControlLabel, FormGroup, Radio, RadioGroup } from "@mui/material";
import '../css/TaskWindow.scss';

interface TaskWindowProps {
	task: LnmTask,
}

const _WHITE = '#F4F4F4';

const TaskWindow: React.FC<TaskWindowProps> = ({
	task
}) => {
	return (
		<form
			style={{
				width: '50vw',
				height: '50vh',
			}}
			className="task-window"
		>
			<TextSyntaxHighlighter input={task.questionText} copyable />
			{task.hint && <HintDisplay hintText={task.hint} />}
			<hr />
			{task.type === LnmTaskType.SELECT_MANY && (
				<FormGroup>
					{task.options?.map((option, index) => (
						<FormControlLabel
							key={index}
							control={
								<Checkbox name="select-many" value={index} sx={{color: _WHITE}} color='default'/>
							}
							label={<TextSyntaxHighlighter input={option} copyable={false}/>}
						/>
					)) ?? <div>Error loading answer options</div>}
				</FormGroup>
			)}
			{/**/}
			{task.type === LnmTaskType.SELECT_ONE && (
				<RadioGroup name="select-one">
					{task.options?.map((option, index) => (
						<FormControlLabel
							key={index}
							control={
								<Radio
									name="select-one"
									value={index}
									defaultChecked={index === 0}
									required={index === 0}
									sx={{
										color: _WHITE,
									}}
									color='default'
								/>
							}
							label={<TextSyntaxHighlighter input={option} copyable={false}/>}
						/>
					)) ?? <div>Error loading answer options</div>}
				</RadioGroup>
			)}
			{(task.type == LnmTaskType.WRITE_KNOWLEDGE ||
				task.type == LnmTaskType.COMPLETE_QUERY) && (
				<SyntaxHighlightInput
					placeholder='Enter your solution here...'
					value={task.default}
				/>
			)}
			<input type="submit" value={'Отправить'} />
		</form>
	);
};

export default TaskWindow;
