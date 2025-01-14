import axios from 'axios';
import {
	LnmCompleteQueryTask,
	LnmSelectManyTask,
	LnmSelectOneTask,
	LnmTask,
	LnmTaskType,
	LnmWriteKnowledgeTask,
} from '../types';
import { VITE_SERVER_URL } from '../../metaEnv';

export const API_TIMEOUT = 5000;

export const validateTask = async (
	task: LnmTask,
	userInput: number | number[] | string
): Promise<boolean> => {
	try {
		switch (task.type) {
			case LnmTaskType.SELECT_ONE:
				return await validateSelectOne(task, userInput as number);
			case LnmTaskType.SELECT_MANY:
				return await validateSelectMany(task, userInput as number[]);
			case LnmTaskType.WRITE_KNOWLEDGE:
				return await validateWriteKnowledge(task, userInput as string);
			case LnmTaskType.COMPLETE_QUERY:
			default:
				return await validateCompleteQuery(task, userInput as string);
		}
	} catch (e) {
		console.error(`Error validating ${task.type} task:`, e);
		return false;
	}
};

const validateSelectOne = async (
	task: LnmSelectOneTask,
	userInput: number
): Promise<boolean> => {
	const response = await axios.post(
		`${VITE_SERVER_URL}/task/select-one`,
		{
			taskId: task.id,
			taskType: task.type,
			actualChoice: userInput,
			expectedChoice: task.correctAnswerIndex,
			sessionToken: localStorage.getItem('sessionToken') || '',
		},
		{
			timeout: API_TIMEOUT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('AuthToken'),
			},
		}
	);
	return response.data.correct;
	// Static validation without exchange with backend
	// return task.correctAnswerIndex === userInput;
};

const validateSelectMany = async (
	task: LnmSelectManyTask,
	userInput: number[]
): Promise<boolean> => {
	const response = await axios.post(
		`${VITE_SERVER_URL}/task/select-many`,
		{
			taskId: task.id,
			taskType: task.type,
			actualChoices: userInput,
			expectedChoices: task.correctAnswerIndices,
			sessionToken: localStorage.getItem('sessionToken') || '',
		},
		{
			timeout: API_TIMEOUT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('AuthToken'),
			},
		}
	);
	return response.data.correct;

	// Static validation without exchange with backend
	// return (
	// 	JSON.stringify(task.correctAnswerIndices.sort()) ===
	// 	JSON.stringify(userInput.sort())
	// );
};

// Dynamic validation for WRITE_KNOWLEDGE
const validateWriteKnowledge = async (
	task: LnmWriteKnowledgeTask,
	userInput: string
): Promise<boolean> => {
	const response = await axios.post(
		`${VITE_SERVER_URL}/task/write-knowledge`,
		{
			taskId: task.id,
			taskType: task.type,
			knowledge: [...task.knowledge, userInput],
			sessionToken: localStorage.getItem('sessionToken') || '',
			testCases: task.testCases,
		},
		{
			timeout: API_TIMEOUT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('AuthToken'),
			},
		}
	);
	return response.data.correct;
};

// Dynamic validation for COMPLETE_QUERY
const validateCompleteQuery = async (
	task: LnmCompleteQueryTask,
	userInput: string
): Promise<boolean> => {
	console.log(task.knowledge);
	console.log(userInput);
	const response = await axios.post(
		`${VITE_SERVER_URL}/task/complete-query`, // Replace with your actual endpoint
		{
			taskId: task.id,
			taskType: task.type,
			knowledge: task.knowledge,
			sessionToken: localStorage.getItem('sessionToken') || '',
			query: userInput,
			expectedResults: task.expectedResults,
		},
		{
			timeout: API_TIMEOUT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('AuthToken'),
			},
		}
	);
	return response.data.correct;
};
