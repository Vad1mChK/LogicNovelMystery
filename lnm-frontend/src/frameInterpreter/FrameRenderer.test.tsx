// src/components/__tests__/FrameRenderer.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FrameRenderer from './FrameRenderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { RootState } from '../state/store';
import {
	LnmCharacter,
	LnmFrameCharacterData,
	LnmHero,
	LnmLocation,
	LnmPlayerState,
	LnmPlot,
	LnmResult,
	LnmTask,
	LnmTaskType,
} from './types';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';

// Mock child components
jest.mock('./DialogueBox', () => ({
	__esModule: true,
	default: ({
		speakerName,
		text,
	}: {
		speakerName?: string;
		text: string;
	}) => (
		<div data-testid="DialogueBox">
			<p>Speaker: {speakerName}</p>
			<p>Text: {text}</p>
		</div>
	),
}));

jest.mock('./CharacterSprite', () => ({
	__esModule: true,
	default: ({
		character,
		isSpeaker,
	}: {
		character: LnmCharacter;
		isSpeaker: boolean;
		characterData: LnmFrameCharacterData;
	}) => (
		<div data-testid="CharacterSprite">
			<p>Character: {character.name}</p>
			<p>Is Speaker: {isSpeaker ? 'Yes' : 'No'}</p>
		</div>
	),
}));

jest.mock('./LocationBackground', () => ({
	__esModule: true,
	default: ({ location }: { location: LnmLocation }) => (
		<div data-testid="LocationBackground">
			<p>Location: {location.name}</p>
		</div>
	),
}));

jest.mock('./HealthBar.tsx', () => ({
	__esModule: true,
	default: ({
		hidden,
		currentHealth,
		maxHealth,
	}: {
		hidden: boolean;
		currentHealth: number;
		maxHealth: number;
	}) =>
		!hidden ? (
			<div data-testid="HealthBar">
				<p>
					Health: {currentHealth} / {maxHealth}
				</p>
			</div>
		) : null,
}));

jest.mock('./TaskWindow', () => ({
	__esModule: true,
	default: ({
		task,
		onSubmit,
	}: {
		task: LnmTask;
		onSubmit: (result: boolean) => void;
	}) => (
		<div data-testid="TaskWindow">
			<p>Task: {task.type}</p>
			<button onClick={() => onSubmit(true)}>Submit Task</button>
		</div>
	),
}));

jest.mock('./VisualNovelEngine', () => ({
	__esModule: true,
	default: ({
		plot,
		startChapter,
	}: {
		plot: LnmPlot;
		startChapter?: string;
	}) => (
		<div data-testid="VisualNovelEngine">
			<p>Plot: {plot.metadata.name}</p>
			<p>Start Chapter: {startChapter}</p>
		</div>
	),
}));

jest.mock('i18next', () => ({
	t: jest.fn((key: string) => key),
}));

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
}));

// Define a mock navigate function
const mockNavigate = jest.fn();

// Setup the mocked useNavigate
beforeEach(() => {
	(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});

// Initialize mock store
const mockStore = configureMockStore<RootState>();

// Define a mock plot
const mockPlot: LnmPlot = {
	metadata: {
		name: 'Mock Plot',
		gamemode: 'single',
		version: '1.0',
		protagonist: 'edgeworth',
		author: 'Shu Takumi',
		locale: 'en',
	},
	characters: new Map([
		[
			'edgeworth',
			{
				id: 'edgeworth',
				name: 'Phoenix Wright',
				defaultPose: null,
				sprites: new Map(),
			},
		],
		[
			'miles',
			{
				id: 'miles',
				name: 'Miles Edgeworth',
				defaultPose: null,
				sprites: new Map(),
			},
		],
	]),
	locations: new Map([
		['courtroom', { id: 'courtroom', name: 'Courtroom', background: '' }],
		['office', { id: 'office', name: 'Office', background: '' }],
	]),
	music: new Map(),
	chapters: new Map([
		[
			'intro',
			{
				id: 'intro',
				title: 'Intro',
				nextChapter: 'c1',
				startFrame: 'i_1',
			},
		],
		[
			'c1',
			{
				id: 'c1',
				title: 'C1',
				nextChapter: 'c2',
				startFrame: 'c1_1',
				isEnding: true,
			},
		],
	]),
	startChapter: 'intro',
	defaultEnding: 'c1',
	frames: { main: new Map() },
	tasks: new Map(),
};

// Define a helper function to render the component with necessary props
const renderFrameRenderer = (
	_storeState: Partial<RootState>,
	props: Partial<React.ComponentProps<typeof FrameRenderer>> = {}
) => {
	const defaultStoreState: RootState = {
		languageState: { currentLanguage: 'en' },
		gameState: {
			health: 100, // Default health value
			currentChapterId: 'intro', // Default chapter ID
			currentFrameId: 'i_1',
			protagonist: LnmHero.STEVE,
			playerState: LnmPlayerState.CREATED,
			intermediateResult: null,
		},
		musicState: {
			currentTrack: null,
			isPlaying: false,
			volume: 0.5,
			panning: 0,
		},
		gameFinalResultState: {
			result: LnmResult.SINGLE_GOOD,
			partnerName: null,
			score: 0,
			highScore: null,
		},
	};

	const store = mockStore(defaultStoreState);

	const defaultProps: React.ComponentProps<typeof FrameRenderer> = {
		isEnding: false,
		frame: {
			id: 'i_1',
			dialogue: 'Welcome to the courtroom!',
			nextFrame: undefined,
		},
		plot: mockPlot,
		currentCharacters: [{ id: 'edgeworth' }, { id: 'miles' }],
		currentSpeaker: 'edgeworth',
		currentLocation: {
			id: 'courtroom',
			name: 'Courtroom',
			background: 'courtroom.webp',
		},
		currentTask: null,
		onNextFrame: jest.fn(),
		onGiveUp: jest.fn(),
		onTaskSubmit: jest.fn(),
		...props,
	};

	return render(
		<Provider store={store}>
			<FrameRenderer {...defaultProps} />
		</Provider>
	);
};

describe('FrameRenderer', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders LocationBackground correctly', async () => {
		renderFrameRenderer(
			{},
			{
				currentLocation: {
					id: 'courtroom',
					name: 'Courtroom',
					background: 'courtroom',
				},
			}
		);

		expect(screen.getByTestId('LocationBackground')).toBeInTheDocument();
		expect(await screen.findByText(/Courtroom/g)).toBeInTheDocument();
	});

	it('renders CharacterSprites correctly', () => {
		renderFrameRenderer(
			{},
			{
				currentCharacters: [
					{ id: 'edgeworth', position: 'left' },
					{ id: 'miles', position: 'right' },
				],
				currentSpeaker: 'edgeworth',
			}
		);

		const characterSprites = screen.getAllByTestId('CharacterSprite');
		expect(characterSprites).toHaveLength(2);

		expect(
			screen.getByText('Character: Phoenix Wright')
		).toBeInTheDocument();
		expect(screen.getByText('Is Speaker: Yes')).toBeInTheDocument();

		expect(
			screen.getByText('Character: Miles Edgeworth')
		).toBeInTheDocument();
		expect(screen.getByText('Is Speaker: No')).toBeInTheDocument();
	});

	it('renders DialogueBox correctly with speaker and text', () => {
		renderFrameRenderer(
			{},
			{
				currentSpeaker: 'edgeworth',
				frame: {
					...mockPlot.frames.main,
					id: 'i_1',
					dialogue: 'Welcome!',
				},
			}
		);

		expect(screen.getByTestId('DialogueBox')).toBeInTheDocument();
		expect(screen.getByText('Speaker: Phoenix Wright')).toBeInTheDocument();
		expect(screen.getByText('Text: Welcome!')).toBeInTheDocument();
	});

	it('renders choices correctly and handles choice selection', async () => {
		const onNextFrameMock = jest.fn();

		renderFrameRenderer(
			{},
			{
				onNextFrame: onNextFrameMock,
				frame: {
					id: 'i_1',
					dialogue: 'Choose your next step.',
					choices: [
						{ text: 'Proceed to trial', nextFrame: 'chapter1' },
						{ text: 'Give up', nextFrame: 'ending' },
					],
				},
			}
		);

		const proceedButton = await screen.findByText(/Proceed to trial/g);
		const giveUpButton = await screen.findByText(/Give up/g);

		expect(proceedButton).toBeInTheDocument();
		expect(giveUpButton).toBeInTheDocument();

		await userEvent.click(proceedButton);
		await waitFor(() => {
			expect(onNextFrameMock).toHaveBeenCalledWith('chapter1');
		});

		await userEvent.click(giveUpButton);
		await waitFor(() => {
			expect(onNextFrameMock).toHaveBeenCalledWith('ending');
		});
	});

	it('renders nextFrame button when there are no choices', async () => {
		const onNextFrameMock = jest.fn();

		renderFrameRenderer(
			{},
			{
				frame: {
					id: 'i_1',
					dialogue: 'Next chapter starts here.',
					choices: undefined,
					nextFrame: 'i_2',
				},
				onNextFrame: onNextFrameMock,
			}
		);

		const nextFrameButton = screen.getByText('->');
		expect(nextFrameButton).toBeInTheDocument();

		await userEvent.click(nextFrameButton);
		await waitFor(() => {
			expect(onNextFrameMock).toHaveBeenCalledWith('i_2');
		});
	});

	it('renders TaskWindow when currentTask is present and handles task submission', async () => {
		const onTaskSubmitMock = jest.fn();

		const mockTask: LnmTask = {
			id: 'e',
			type: LnmTaskType.SELECT_ONE,
			questionText: 'E E Ei',
			options: ['1', '2', '3'],
			correctAnswerIndex: 1,
			nextFrameOnSuccess: 'i_3',
			nextFrameOnFailure: 'i_4',
			// ... other necessary properties
		};

		renderFrameRenderer(
			{},
			{ currentTask: mockTask, onTaskSubmit: onTaskSubmitMock }
		);

		expect(screen.getByTestId('TaskWindow')).toBeInTheDocument();
		expect(screen.getByText(`Task: ${mockTask.type}`)).toBeInTheDocument();

		const submitTaskButton = screen.getByText('Submit Task');
		userEvent.click(submitTaskButton);

		await waitFor(() => {
			expect(onTaskSubmitMock).toHaveBeenCalledWith(true);
		});
	});

	it('renders HealthBar correctly when not hidden', async () => {
		const storeState: Partial<RootState> = {
			gameState: {
				health: 80,
				protagonist: LnmHero.STEVE,
				currentChapterId: 'intro',
				currentFrameId: 'i_1',
				playerState: LnmPlayerState.PLAYING,
				intermediateResult: null,
			},
		};

		renderFrameRenderer(storeState, { isEnding: false });

		expect(screen.getByTestId('HealthBar')).toBeInTheDocument();
		expect(
			await screen.findByText(/Health:\s*\d+\s*\/\s*\d+/g)
		).toBeInTheDocument();
	});

	it('does not render HealthBar when hidden (isEnding is true)', () => {
		renderFrameRenderer({}, { isEnding: true });

		expect(screen.queryByTestId('HealthBar')).not.toBeInTheDocument();
	});

	it('renders top-button-bar with give up and home buttons correctly', async () => {
		const onGiveUpMock = jest.fn();

		renderFrameRenderer({}, { isEnding: false, onGiveUp: onGiveUpMock });

		const giveUpButton = screen.getByText('game.giveUpButton');
		const homeButton = screen.getByText('game.homeButton');

		expect(giveUpButton).toBeInTheDocument();
		expect(homeButton).toBeInTheDocument();

		await userEvent.click(giveUpButton);
		await waitFor(() => {
			expect(onGiveUpMock).toHaveBeenCalled();
		});

		await userEvent.click(homeButton);
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/main');
		});
	});

	it('handles absence of currentCharacters gracefully', () => {
		renderFrameRenderer({}, { currentCharacters: null });

		expect(screen.queryByTestId('CharacterSprite')).not.toBeInTheDocument();
		expect(screen.getByTestId('DialogueBox')).toBeInTheDocument();
	});

	it('handles absence of currentLocation gracefully', () => {
		renderFrameRenderer({}, { currentLocation: null });

		expect(
			screen.queryByTestId('LocationBackground')
		).not.toBeInTheDocument();
	});

	it('handles isEnding state correctly by hiding TaskWindow and HealthBar', () => {
		const storeState: Partial<RootState> = {
			gameState: {
				health: 50,
				currentChapterId: 'C1',
				currentFrameId: 'C1_1',
				protagonist: LnmHero.STEVE,
				playerState: LnmPlayerState.PLAYING,
				intermediateResult: null,
			},
		};

		renderFrameRenderer(storeState, { isEnding: true, currentTask: null });

		expect(screen.queryByTestId('TaskWindow')).not.toBeInTheDocument();
		expect(screen.queryByTestId('HealthBar')).not.toBeInTheDocument();
	});
});
