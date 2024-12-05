import React from 'react';
import '../css/FrameInterpreter.scss';
import TaskWindow from '../frameInterpreter/TaskWindow.tsx';
import { LnmTaskType } from '../frameInterpreter/types.ts';

const SecretPage: React.FC = () => {
	return (
		<div>
			<TaskWindow
				taskType={LnmTaskType.SELECT_ONE}
				questionText={'1\n2\n3'}
				options={['One', 'Two', 'Three']}
				correctAnswerIndices={0}
			/>
		</div>
	);
};

export default SecretPage;
