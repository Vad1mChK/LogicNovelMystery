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
					type: LnmTaskType.SELECT_MANY,
					questionText:
						'Given the facts and the rule: ```friend(edgeworth, gumshoe).\nfriend(gumshoe, kay).\nfriends(X, Y) :-\n\tfriend(X, Y);\n\tfriend(Y, X).```What results will `friends(Who, edgeworth).` find?',
					options: [
						'`Who = edgeworth`',
						'`Who = gumshoe`',
						'`Who = kay`',
						'`None`',
					],
					correctAnswerIndices: [1, 2],
					hint: 'The student should be going to `investigate(thatScream)` now.',
					nextFrameOnSuccess: '1',
					nextFrameOnFailure: '2',
				}}
			/>
		</div>
	);
};

export default SecretPage;
