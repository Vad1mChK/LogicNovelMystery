import axios from 'axios';
import { API_TIMEOUT, validateTask } from './taskValidation';
import { LnmTask, LnmTaskType } from '../types';
import { VITE_SERVER_URL } from '../../metaEnv';

jest.mock('../../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081',
}));

describe('taskValidation', () => {
	const mockBaseTask = {
		id: '1',
		questionText: 'Some question',
		nextFrameOnSuccess: 'chapter_success',
		nextFrameOnFailure: 'chapter_failure',
	};

	const mockRequestData = {
		taskId: '1',
		sessionToken: '',
	};

	const mockRequestConfig = {
		timeout: API_TIMEOUT,
		headers: {
			'Content-Type': 'application/json',
			Authorization: null,
		},
	};

	const tasksForTypes: Map<LnmTaskType, LnmTask> = new Map([
		[
			LnmTaskType.SELECT_ONE,
			{
				...mockBaseTask,
				type: LnmTaskType.SELECT_ONE,
				options: ['a', 'b', 'c'],
				correctAnswerIndex: 2,
			},
		],
		[
			LnmTaskType.SELECT_MANY,
			{
				...mockBaseTask,
				type: LnmTaskType.SELECT_MANY,
				options: ['a', 'b', 'c'],
				correctAnswerIndices: [0, 1],
			},
		],
		[
			LnmTaskType.WRITE_KNOWLEDGE,
			{
				...mockBaseTask,
				knowledge: ['character(professor).'],
				type: LnmTaskType.WRITE_KNOWLEDGE,
				testCases: [
					{
						query: 'character(Who).',
						expectedResults: [
							{
								variables: { Who: 'professor' },
							},
							{
								variables: { Who: 'sarah' },
							},
						],
					},
				],
			},
		],
		[
			LnmTaskType.COMPLETE_QUERY,
			{
				...mockBaseTask,
				type: LnmTaskType.COMPLETE_QUERY,
				knowledge: [
					'friend(phoenix, miles).',
					'friend(phoenix, larry).',
					'friends(X, Y) :- friend(X, Y); friend(Y, X).',
				],
				query: 'friends(Who, miles).',
				expectedResults: [
					{
						variables: { Who: 'phoenix' },
					},
					{
						variables: { Who: 'larry' },
					},
				],
			},
		],
	]);

	// Mock console.error before all tests
	beforeAll(() => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	// Restore console.error after all tests
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('should validate SELECT_ONE task correctly when answer is correct', async () => {
		const mockTask = tasksForTypes.get(LnmTaskType.SELECT_ONE)!;

		const mockResponse = { data: { correct: true } };
		const mockAxiosPost = jest.spyOn(axios, 'post') as jest.MockedFunction<
			typeof axios.post
		>;
		mockAxiosPost.mockResolvedValue(mockResponse);

		const result = await validateTask(mockTask, 2);

		expect(mockAxiosPost).toHaveBeenCalledWith(
			`${VITE_SERVER_URL}/task/select-one`,
			{
				...mockRequestData,
				taskType: LnmTaskType.SELECT_ONE,
				actualChoice: 2,
				expectedChoice: 2,
			},
			mockRequestConfig
		);

		expect(result).toBe(true);
	});

	it('should validate SELECT_MANY task correctly when answer is correct', async () => {
		const mockTask: LnmTask = tasksForTypes.get(LnmTaskType.SELECT_MANY)!;

		const mockResponse = { data: { correct: true } };
		jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);

		const result = await validateTask(mockTask, [0, 1]);

		expect(axios.post).toHaveBeenCalledWith(
			`${VITE_SERVER_URL}/task/select-many`,
			{
				...mockRequestData,
				taskType: LnmTaskType.SELECT_MANY,
				actualChoices: [0, 1],
				expectedChoices: [0, 1],
			},
			mockRequestConfig
		);

		expect(result).toBe(true);
	});

	it('should validate WRITE_KNOWLEDGE task correctly when answer is correct', async () => {
		const mockTask: LnmTask = tasksForTypes.get(
			LnmTaskType.WRITE_KNOWLEDGE
		)!;
		console.log(mockTask);

		expect(mockTask.type).toBe(LnmTaskType.WRITE_KNOWLEDGE);
		expect(mockTask).toHaveProperty('testCases');

		const mockResponse = { data: { correct: true } };
		jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);

		const result = await validateTask(mockTask, 'character(sarah).');

		if ('testCases' in mockTask) {
			expect(axios.post).toHaveBeenCalledWith(
				`${VITE_SERVER_URL}/task/write-knowledge`,
				{
					...mockRequestData,
					taskType: LnmTaskType.WRITE_KNOWLEDGE,
					testCases: mockTask.testCases,
					knowledge: [...mockTask.knowledge, 'character(sarah).'],
				},
				mockRequestConfig
			);
		}

		expect(result).toBe(true);
	});

	it('should validate WRITE_KNOWLEDGE task correctly when answer is incorrect', async () => {
		const mockTask: LnmTask = tasksForTypes.get(
			LnmTaskType.WRITE_KNOWLEDGE
		)!;
		console.log(mockTask);

		expect(mockTask.type).toBe(LnmTaskType.WRITE_KNOWLEDGE);
		expect(mockTask).toHaveProperty('testCases');

		const mockResponse = { data: { correct: false } };
		jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);

		const result = await validateTask(mockTask, 'character(vicky).');

		if ('testCases' in mockTask) {
			expect(axios.post).toHaveBeenCalledWith(
				`${VITE_SERVER_URL}/task/write-knowledge`,
				{
					...mockRequestData,
					taskType: LnmTaskType.WRITE_KNOWLEDGE,
					testCases: mockTask.testCases,
					knowledge: [...mockTask.knowledge, 'character(vicky).'],
				},
				mockRequestConfig
			);
		}

		expect(result).toBe(false);
	});

	it('should validate COMPLETE_QUERY task correctly when answer is correct', async () => {
		const mockTask: LnmTask = tasksForTypes.get(
			LnmTaskType.COMPLETE_QUERY
		)!;
		console.log(mockTask);

		expect(mockTask.type).toBe(LnmTaskType.COMPLETE_QUERY);
		expect(mockTask).toHaveProperty('expectedResults');

		const mockResponse = { data: { correct: true } };
		jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);

		const result = await validateTask(mockTask, 'friends(Who, miles).');

		if ('expectedResults' in mockTask) {
			expect(axios.post).toHaveBeenCalledWith(
				`${VITE_SERVER_URL}/task/complete-query`,
				{
					...mockRequestData,
					taskType: LnmTaskType.COMPLETE_QUERY,
					expectedResults: mockTask.expectedResults,
					query: 'friends(Who, miles).',
					knowledge: mockTask.knowledge,
				},
				mockRequestConfig
			);
		}

		expect(result).toBe(true);
	});

	it('should handle network errors in axios requests and return false', async () => {
		const mockTask: LnmTask = tasksForTypes.get(LnmTaskType.SELECT_ONE)!;

		const mockError = new Error('Network Error');
		jest.spyOn(axios, 'post').mockRejectedValue(mockError);

		const result = await validateTask(mockTask, 1);

		expect(axios.post).toHaveBeenCalledWith(
			`${VITE_SERVER_URL}/task/select-one`,
			expect.any(Object),
			expect.any(Object)
		);
		expect(result).toBe(false);
		expect(console.error).toHaveBeenCalledWith(
			'Error validating SELECT_ONE task:',
			mockError
		);
	});
});
