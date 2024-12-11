import React from 'react';
import '../css/FrameInterpreter.scss';
import TaskWindow from '../frameInterpreter/TaskWindow.tsx';
import { LnmTaskType } from '../frameInterpreter/types.ts';

const SecretPage: React.FC = () => {
	return (
		<div>
			<TaskWindow
				task={{
					id: 'someTask',
					type: LnmTaskType.SELECT_ONE,
					questionText:
						'Can you feel the `sunshine`\nbrightening up your day?```friends(X, Y) :-\n\tfriend(X, Y); friend(Y, X).```',
					hint: 'The student should be going to `investigate(thatScream)` now.',
					options: ['One', 'Two', 'Three', 'Four'],
					correctAnswerIndices: 0,
					nextFrameOnSuccess: '1',
					nextFrameOnFailure: '2',
				}}
			/>
		</div>
	);
};

export default SecretPage;
