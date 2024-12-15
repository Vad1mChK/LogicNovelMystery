import React from 'react';
import '../css/FrameInterpreter.scss';
import TaskWindow from '../frameInterpreter/TaskWindow.tsx';
import { LnmTask, LnmTaskType } from '../frameInterpreter/types';

// used by devs for development purposes only...
const SecretPage: React.FC = () => {
	const tasks: Record<LnmTaskType, LnmTask | undefined> = {
		SELECT_MANY: {
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
		},
		SELECT_ONE: {
			id: 'someTask',
			type: LnmTaskType.SELECT_ONE,
			questionText:
				'Given the facts and the rule: ```friend(edgeworth, gumshoe).\nfriend(gumshoe, kay).\nfriends(X, Y) :-\n\tfriend(X, Y);\n\tfriend(Y, X).```What results will `friends(Who, edgeworth).` find?',
			options: [
				'`Who = gumshoe` and `Who = kay`',
				'`Who = gumshoe`',
				'`Who = kay`',
				'Nothing (returns `false`)',
			],
			correctAnswerIndex: 1,
			hint: 'The student should be going to `investigate(thatScream)` now.',
			nextFrameOnSuccess: '1',
			nextFrameOnFailure: '2',
		},
		WRITE_KNOWLEDGE: {
			id: 'someTask',
			type: LnmTaskType.WRITE_KNOWLEDGE,
			knowledge: ['friend(edgeworth, gumshoe).', 'friend(gumshoe, kay).'],
			questionText:
				'Given the facts: ```friend(edgeworth, gumshoe).\nfriend(gumshoe, kay).```Write a predicate `friends(X, Y)` such that it is bidirectional, but fails if `X = Y`.',
			testCases: [
				{
					query: 'friends(kay, gumshoe).',
					expectedResults: [{ variables: {} }],
				},
				{
					query: 'friends(gumshoe, edgeworth).',
					expectedResults: [{ variables: {} }],
				},
				{
					query: 'friends(edgeworth, gumshoe).',
					expectedResults: [{ variables: {} }],
				},
				{
					query: 'friends(gumshoe, gumshoe).',
					expectedResults: [],
				},
			],
			hint: 'Use logical operators `;` and `,` and inequality check `\\=`.',
			defaultValue: 'friends(X, Y) :-\n\t% Write your solution here',
			nextFrameOnSuccess: '1',
			nextFrameOnFailure: '2',
		},
		COMPLETE_QUERY: {
			id: 'someTask',
			type: LnmTaskType.COMPLETE_QUERY,
			knowledge: [
				'friend(edgeworth, gumshoe).',
				'friend(gumshoe, kay).',
				'friend(kay, franziska).',
				'friend(franziska, adrian).',
				'friends(X, Y) :- friend(X, Y); friend(Y, X).',
			],
			questionText:
				"Given the facts and the rule: ```friend(edgeworth, gumshoe).\nfriend(gumshoe, kay).\nfriend(kay, franziska)\nfriend(franziska, adrian).\nfriends(X, Y) :- friend(X, Y); friend(Y, X).```Write a query to find all second-order friends of `gumshoe`. \nA second-order friend is not one's friend, but has mutual friends with them.\nMutual friend variable: `Mid`, second friend variable: `Who`.",
			expectedResults: [{ variables: { Who: 'edgeworth' } }],
			hint: 'Use logical operators `;` and `,` and inequality check `\\=`.',
			defaultValue:
				'second_friends(X, Y) :-\n\t% Write your solution here...',
			nextFrameOnSuccess: '1',
			nextFrameOnFailure: '2',
		},
	};

	return (
		<div>
			<TaskWindow
				task={tasks[LnmTaskType.SELECT_ONE]!}
				onSubmit={console.log}
			/>
		</div>
	);
};

export default SecretPage;
