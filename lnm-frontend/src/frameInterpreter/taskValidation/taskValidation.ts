import axios from 'axios';
import { LnmTask, LnmTaskType } from '../types';

const API_TIMEOUT = 5000;

export const validateTask = async (
	task: LnmTask,
	userInput: number | number[] | string
): Promise<boolean> => {
	switch (task.type) {
		case LnmTaskType.SELECT_ONE:
			return validateSelectOne(task, userInput as number);
		case LnmTaskType.SELECT_MANY:
			return validateSelectMany(task, userInput as number[]);
		case LnmTaskType.WRITE_KNOWLEDGE:
			return await validateWriteKnowledge(task, userInput as string);
		case LnmTaskType.COMPLETE_QUERY:
			return await validateCompleteQuery(task, userInput as string);
		default:
			return false;
	}
};

// Static validation for SELECT_ONE
const validateSelectOne = (task: LnmTask, userInput: number): boolean => {
	if (task.type !== LnmTaskType.SELECT_ONE) {
		return false;
	}
	return task.correctAnswerIndex === userInput;
};

// Static validation for SELECT_MANY
const validateSelectMany = (task: LnmTask, userInput: number[]): boolean => {
	if (task.type !== LnmTaskType.SELECT_MANY) {
		return false;
	}
	return (
		JSON.stringify(task.correctAnswerIndices.sort()) ===
		JSON.stringify(userInput.sort())
	);
};

// Dynamic validation for WRITE_KNOWLEDGE
const validateWriteKnowledge = async (
	task: LnmTask,
	userInput: string
): Promise<boolean> => {
	if (task.type !== LnmTaskType.WRITE_KNOWLEDGE) {
		return false;
	}
	try {
		const response = await axios.post(
			'http://localhost:8080/task/write-knowledge',
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
			} // Set timeout inline
		);
		return response.data.correct;
	} catch (error) {
		console.error('Error validating WRITE_KNOWLEDGE task:', error);
		return false; // Assume failure on timeout or server error
	}
};

// Dynamic validation for COMPLETE_QUERY
const validateCompleteQuery = async (
	task: LnmTask,
	userInput: string
): Promise<boolean> => {
	if (task.type !== LnmTaskType.COMPLETE_QUERY) {
		return false;
	}
	try {
		console.log(task.knowledge);
		console.log(userInput);
		const response = await axios.post(
			'http://localhost:8080/task/complete-query', // Replace with your actual endpoint
			{
				taskId: task.id,
				taskType: task.type,
				knowledge: task.knowledge,
				sessionToken: localStorage.getItem('sessionToken') || '',
				query: userInput,
				expectedResults: task.expectedResults.map(
					(entry) => entry.variables
				),
			},
			{
				timeout: API_TIMEOUT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('AuthToken'),
				},
			} // Set timeout inline
		);
		return response.data.correct;
	} catch (error) {
		console.error('Error validating COMPLETE_QUERY task:', error);
		return false; // Assume failure on timeout or server error
	}
};
