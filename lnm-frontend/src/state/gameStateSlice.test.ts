import gameStateReducer, {
	decreaseHealth,
	increaseHealth,
	resetState,
	setCurrentChapter,
	setCurrentFrame,
	setPlayerState,
	setProtagonist,
	setMusicPath,
} from './gameStateSlice';
import { LnmHero, LnmPlayerState } from '../frameInterpreter/types';

// Initial state for testing
const initialState = {
	health: 100,
	currentChapterId: 'start',
	currentFrameId: 'frame1',
	protagonist: LnmHero.STEVE,
	playerState: LnmPlayerState.CREATED,
	musicPath: null,
};

describe('gameStateSlice', () => {
	// Test increaseHealth
	it('should set health to full when "full" is passed to increaseHealth', () => {
		const state = gameStateReducer(
			{ ...initialState, health: 50 },
			increaseHealth('full')
		);
		expect(state.health).toBe(100);
	});

	it('should increase health by a given value without exceeding 100', () => {
		const state = gameStateReducer(
			{ ...initialState, health: 90 },
			increaseHealth(15)
		);
		expect(state.health).toBe(100);
	});

	it('should increase health correctly when within limits', () => {
		const state = gameStateReducer(
			{ ...initialState, health: 50 },
			increaseHealth(20)
		);
		expect(state.health).toBe(70);
	});

	// Test decreaseHealth
	it('should set health to 0 when "kill" is passed to decreaseHealth', () => {
		const state = gameStateReducer(initialState, decreaseHealth('kill'));
		expect(state.health).toBe(0);
	});

	it('should decrease health by a given value without going below 0', () => {
		const state = gameStateReducer(
			{ ...initialState, health: 20 },
			decreaseHealth(30)
		);
		expect(state.health).toBe(0);
	});

	it('should decrease health correctly when within limits', () => {
		const state = gameStateReducer(
			{ ...initialState, health: 50 },
			decreaseHealth(20)
		);
		expect(state.health).toBe(30);
	});

	// Test setCurrentChapter
	it('should update the current chapter ID', () => {
		const state = gameStateReducer(
			initialState,
			setCurrentChapter('chapter2')
		);
		expect(state.currentChapterId).toBe('chapter2');
	});

	// Test setCurrentFrame
	it('should update the current frame ID', () => {
		const state = gameStateReducer(initialState, setCurrentFrame('frame2'));
		expect(state.currentFrameId).toBe('frame2');
	});

	it('should update the current protagonist', () => {
		const state = gameStateReducer(
			initialState,
			setProtagonist(LnmHero.VICKY)
		);
		expect(state.protagonist).toBe(LnmHero.VICKY);
	});

	it('should update the current player state', () => {
		const state = gameStateReducer(
			initialState,
			setPlayerState(LnmPlayerState.PLAYING)
		);
		expect(state.playerState).toBe(LnmPlayerState.PLAYING);
	});

	it('should update the current music path', () => {
		const state = gameStateReducer(
			initialState,
			setMusicPath('path/to/music.mp3')
		);
		expect(state.musicPath).toBe('path/to/music.mp3');
	});

	it('should reset all state properties to their initial values', () => {
		const modifiedState = {
			health: 50,
			currentChapterId: 'chapter2',
			currentFrameId: 'frame5',
			protagonist: LnmHero.VICKY,
			playerState: LnmPlayerState.PLAYING,
			musicPath: null,
		};
		const state = gameStateReducer(modifiedState, resetState());
		expect(state).toEqual(initialState);
	});
});
