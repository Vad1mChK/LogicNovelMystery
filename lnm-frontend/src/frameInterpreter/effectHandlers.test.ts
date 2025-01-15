import {
	LnmFrameEffectType,
	LnmPlayerState,
	LnmSelectOneTask,
	LnmTaskType,
} from './types';
import { effectHandlers } from './effectHandlers';
import mockPlotObject from '../assets/plot/test_plot_for_plot_loader_en-US.json';
import { _convertAndCreatePlot } from './PlotLoader';

// Mock the reportCampaign function
jest.mock('./communication/reportCampaign', () => ({
	reportCampaign: jest.fn(),
}));

import { reportCampaign } from './communication/reportCampaign';

describe('effectHandlers', () => {
	const mockPlot = _convertAndCreatePlot(mockPlotObject);

	const mockContext = {
		setCurrentFrameId: jest.fn(),
		setCurrentChapterId: jest.fn(),
		setCurrentEndingId: jest.fn(),
		setIsEnding: jest.fn(),
		setCurrentCharacters: jest.fn(),
		decreaseHealth: jest.fn(),
		increaseHealth: jest.fn(),
		setPlayerState: jest.fn(),
		getIntermediateResult: jest.fn(),
		setIntermediateResult: jest.fn(),
		openTaskWindow: jest.fn(),
		playMusic: jest.fn(),
		stopMusic: jest.fn(),
		reportCampaign: reportCampaign as jest.Mock, // Ensure correct typing
		plot: mockPlot,
	};

	it('should handle END_CAMPAIGN effect correctly', async () => {
		const endCampaignEffect = {
			type: LnmFrameEffectType.END_CAMPAIGN,
			args: { winner: true },
		};

		// Mock reportCampaign to return a resolved promise
		mockContext.reportCampaign.mockResolvedValue({
			endingId: '123',
		});

		const _mockPlot = {
			...mockPlot,
			chapters: new Map([
				...mockPlot.chapters.entries(),
				[
					'ending_123',
					{
						id: 'ending_123',
						title: 'Victory Ending',
						startFrame: 'frame123',
						nextChapter: '',
						isEnding: true,
					},
				],
				[
					'ending_limbo',
					{
						id: 'ending_limbo',
						title: 'Limbo Ending',
						startFrame: 'frame124',
						nextChapter: '',
						isEnding: true,
					},
				],
			]),
			defaultEnding: 'ending_limbo',
		};

		const context = {
			...mockContext,
			plot: _mockPlot,
		};

		// Await the handler's promise
		await effectHandlers[LnmFrameEffectType.END_CAMPAIGN]!(
			endCampaignEffect,
			context
		);

		// Assertions
		expect(mockContext.setIntermediateResult).toHaveBeenCalledWith(true);
		expect(mockContext.reportCampaign).toHaveBeenCalledWith(true);
		expect(mockContext.setIsEnding).toHaveBeenCalledWith(true);
		expect(mockContext.setCurrentChapterId).toHaveBeenCalledWith(
			'ending_123'
		);
		expect(mockContext.setCurrentFrameId).toHaveBeenCalledWith('frame123');
	});

	it('should handle END_CAMPAIGN effect correctly when reportCampaign fails', async () => {
		const endCampaignEffect = {
			type: LnmFrameEffectType.END_CAMPAIGN,
			args: { winner: true },
		};

		// Mock reportCampaign to reject
		mockContext.reportCampaign.mockRejectedValue(
			new Error('Network Error')
		);

		const _mockPlot = {
			...mockPlot,
			chapters: new Map([
				...mockPlot.chapters.entries(),
				[
					'ending_limbo',
					{
						id: 'ending_limbo',
						title: 'Limbo Ending',
						startFrame: 'frame124',
						nextChapter: '',
						isEnding: true,
					},
				],
			]),
			defaultEnding: 'ending_limbo',
		};

		const context = {
			...mockContext,
			plot: _mockPlot,
		};

		// Await the handler's promise
		await effectHandlers[LnmFrameEffectType.END_CAMPAIGN]!(
			endCampaignEffect,
			context
		);

		// Assertions for failure path
		expect(mockContext.setIntermediateResult).toHaveBeenCalledWith(false);
		expect(mockContext.reportCampaign).toHaveBeenCalledWith(true);
		expect(mockContext.setIsEnding).toHaveBeenCalledWith(true);
		expect(mockContext.setCurrentChapterId).toHaveBeenCalledWith(
			'ending_limbo'
		);
		expect(mockContext.setCurrentFrameId).toHaveBeenCalledWith('frame124');
	});

	it('should handle JUMP effect correctly by setting the current frame ID', () => {
		const jumpEffect = {
			type: LnmFrameEffectType.JUMP,
			args: { frameId: 'frame123' },
		};

		const mockSetCurrentFrameId = jest.fn();
		const context = {
			...mockContext,
			setCurrentFrameId: mockSetCurrentFrameId,
		};

		effectHandlers[LnmFrameEffectType.JUMP]!(jumpEffect, context);

		expect(mockSetCurrentFrameId).toHaveBeenCalledWith('frame123');
	});

	it('should handle START_TASK effect by opening the task window with correct task', () => {
		const startTaskEffect = {
			type: LnmFrameEffectType.START_TASK,
			args: { taskId: 'task123' },
		};

		const mockTask: LnmSelectOneTask = {
			id: 'task123',
			type: LnmTaskType.SELECT_ONE,
			questionText: '',
			options: ['1', '2', '3'],
			correctAnswerIndex: 0,
			nextFrameOnSuccess: '',
			nextFrameOnFailure: '',
		};

		const mockPlot = {
			...mockContext.plot,
			tasks: new Map([['task123', mockTask]]),
		};

		const mockOpenTaskWindow = jest.fn();

		const context = {
			...mockContext,
			plot: mockPlot,
			openTaskWindow: mockOpenTaskWindow,
		};

		effectHandlers[LnmFrameEffectType.START_TASK]!(
			startTaskEffect,
			context
		);

		expect(mockOpenTaskWindow).toHaveBeenCalledWith(mockTask);
	});

	it('should handle START_TASK effect when task is not found', () => {
		const startTaskEffect = {
			type: LnmFrameEffectType.START_TASK,
			args: { taskId: 'nonexistentTask' },
		};

		const _mockPlot = {
			...mockPlot,
			tasks: new Map(),
		};

		const mockOpenTaskWindow = jest.fn();
		const mockConsoleWarn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => {});

		const context = {
			...mockContext,
			plot: _mockPlot,
			openTaskWindow: mockOpenTaskWindow,
		};

		effectHandlers[LnmFrameEffectType.START_TASK]!(
			startTaskEffect,
			context
		);

		expect(mockOpenTaskWindow).not.toHaveBeenCalled();
		expect(mockConsoleWarn).toHaveBeenCalledWith(
			'Task with ID nonexistentTask not found.'
		);

		mockConsoleWarn.mockRestore();
	});

	it('should handle STOP effect by setting the correct player state based on intermediate result', () => {
		const stopEffect = {
			type: LnmFrameEffectType.STOP,
			args: {},
		};

		const mockSetPlayerState = jest.fn();
		const mockGetIntermediateResult = jest.fn();

		const context = {
			...mockContext,
			setPlayerState: mockSetPlayerState,
			getIntermediateResult: mockGetIntermediateResult,
		};

		// Test when intermediate result is true
		mockGetIntermediateResult.mockReturnValue(true);
		effectHandlers[LnmFrameEffectType.STOP]!(stopEffect, context);
		expect(mockSetPlayerState).toHaveBeenCalledWith(
			LnmPlayerState.WAITING_WON
		);

		// Reset mock
		mockSetPlayerState.mockClear();

		// Test when intermediate result is false
		mockGetIntermediateResult.mockReturnValue(false);
		effectHandlers[LnmFrameEffectType.STOP]!(stopEffect, context);
		expect(mockSetPlayerState).toHaveBeenCalledWith(
			LnmPlayerState.WAITING_LOST
		);
	});

	it('should handle INCREASE_HEALTH and DECREASE_HEALTH effects correctly', () => {
		const mockIncreaseHealth = jest.fn();
		const mockDecreaseHealth = jest.fn();

		const context = {
			...mockContext,
			increaseHealth: mockIncreaseHealth,
			decreaseHealth: mockDecreaseHealth,
		};

		effectHandlers[LnmFrameEffectType.INCREASE_HEALTH]!(
			{
				type: LnmFrameEffectType.INCREASE_HEALTH,
				args: { amount: 'full' },
			},
			context
		);

		expect(mockIncreaseHealth).toHaveBeenCalledWith('full');

		effectHandlers[LnmFrameEffectType.DECREASE_HEALTH]!(
			{
				type: LnmFrameEffectType.DECREASE_HEALTH,
				args: { amount: 100 },
			},
			context
		);

		expect(mockDecreaseHealth).toHaveBeenCalledWith(100);
	});

	it('should handle JUMP_CHAPTER effect by setting both chapter and frame IDs', () => {
		const jumpChapterEffect = {
			type: LnmFrameEffectType.JUMP_CHAPTER,
			args: { chapterId: 'chapter2' },
		};

		const mockSetCurrentChapterId = jest.fn();
		const mockSetCurrentFrameId = jest.fn();

		const context = {
			...mockContext,
			setCurrentChapterId: mockSetCurrentChapterId,
			setCurrentFrameId: mockSetCurrentFrameId,
			plot: mockPlot,
		};

		effectHandlers[LnmFrameEffectType.JUMP_CHAPTER]!(
			jumpChapterEffect,
			context
		);

		expect(mockSetCurrentChapterId).toHaveBeenCalledWith('chapter2');
		expect(mockSetCurrentFrameId).toHaveBeenCalledWith('frame5');
	});

	it('should handle FADE_IN_CHARACTER effect by updating character visibility', () => {
		const fadeInCharacterEffect = {
			type: LnmFrameEffectType.FADE_IN_CHARACTER,
			args: { characterId: 'char1' },
		};

		const mockSetCurrentCharacters = jest.fn();
		const context = {
			...mockContext,
			setCurrentCharacters: mockSetCurrentCharacters,
		};

		effectHandlers[LnmFrameEffectType.FADE_IN_CHARACTER]!(
			fadeInCharacterEffect,
			context
		);

		// Check if setCurrentCharacters was called
		expect(mockSetCurrentCharacters).toHaveBeenCalled();

		// Get the function passed to setCurrentCharacters
		const updateFunction = mockSetCurrentCharacters.mock.calls[0][0];

		// Test the update function with an empty array
		let result = updateFunction([]);
		expect(result).toEqual([{ id: 'char1', hidden: false }]);

		// Test the update function with existing characters
		result = updateFunction([
			{ id: 'char1', hidden: true },
			{ id: 'char2', hidden: false },
		]);
		expect(result).toEqual([
			{ id: 'char1', hidden: false },
			{ id: 'char2', hidden: false },
		]);
	});

	it('should handle CHANGE_POSE effect by updating character pose', () => {
		const changePoseEffect = {
			type: LnmFrameEffectType.CHANGE_POSE,
			args: { characterId: 'char1', newPose: 'happy' },
		};

		const mockSetCurrentCharacters = jest.fn();
		const context = {
			...mockContext,
			setCurrentCharacters: mockSetCurrentCharacters,
		};

		effectHandlers[LnmFrameEffectType.CHANGE_POSE]!(
			changePoseEffect,
			context
		);

		// Check if setCurrentCharacters was called with the correct function
		expect(mockSetCurrentCharacters).toHaveBeenCalled();

		// Get the updater function passed to setCurrentCharacters
		const updaterFunction = mockSetCurrentCharacters.mock.calls[0][0];

		// Test the updater function
		const previousCharacters = [
			{ id: 'char1', pose: 'neutral' },
			{ id: 'char2', pose: 'angry' },
		];
		const updatedCharacters = updaterFunction(previousCharacters);

		expect(updatedCharacters).toEqual([
			{ id: 'char1', pose: 'happy' },
			{ id: 'char2', pose: 'angry' },
		]);
	});

	it('should handle FADE_OUT_CHARACTER effect by hiding the specified character', () => {
		const fadeOutCharacterEffect = {
			type: LnmFrameEffectType.FADE_OUT_CHARACTER,
			args: { characterId: 'char1' },
		};

		const mockSetCurrentCharacters = jest.fn();
		const context = {
			...mockContext,
			setCurrentCharacters: mockSetCurrentCharacters,
		};

		effectHandlers[LnmFrameEffectType.FADE_OUT_CHARACTER]!(
			fadeOutCharacterEffect,
			context
		);

		// Check if setCurrentCharacters was called with the correct function
		expect(mockSetCurrentCharacters).toHaveBeenCalled();

		// Get the function passed to setCurrentCharacters
		const updateFunction = mockSetCurrentCharacters.mock.calls[0][0];

		// Test the update function with a sample previous state
		const prevCharacters = [
			{ id: 'char1', hidden: false },
			{ id: 'char2', hidden: false },
		];
		const updatedCharacters = updateFunction(prevCharacters);

		// Check if the correct character was hidden
		expect(updatedCharacters).toEqual([
			{ id: 'char1', hidden: true },
			{ id: 'char2', hidden: false },
		]);
	});
});
