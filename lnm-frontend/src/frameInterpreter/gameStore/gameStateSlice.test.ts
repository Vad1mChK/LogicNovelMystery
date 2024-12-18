import gameStateReducer, {
	increaseHealth,
	decreaseHealth,
	addKnowledge,
	clearKnowledge,
	setKnowledge,
	setCurrentChapter,
	setCurrentFrame,
	incrementErrorSum,
	clearErrorSum,
	incrementErrorCount,
	clearErrorCount,
} from './gameStateSlice';

// Initial state for testing
const initialState = {
	health: 100,
	knowledge: [],
	currentChapterId: 'start',
	currentFrameId: 'frame1',
	errorSum: 0,
	errorCount: 0,
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

	// Test addKnowledge
	it('should add a new knowledge item to the state', () => {
		const state = gameStateReducer(initialState, addKnowledge('fact1'));
		expect(state.knowledge).toContain('fact1');
	});

	// Test clearKnowledge
	it('should clear all knowledge items', () => {
		const state = gameStateReducer(
			{ ...initialState, knowledge: ['fact1', 'fact2'] },
			clearKnowledge()
		);
		expect(state.knowledge).toEqual([]);
	});

	// Test setKnowledge
	it('should set knowledge to a new array', () => {
		const state = gameStateReducer(
			initialState,
			setKnowledge(['fact1', 'fact2'])
		);
		expect(state.knowledge).toEqual(['fact1', 'fact2']);
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

	// Test incrementErrorSum
	it('should increment error sum by a given value', () => {
		const state = gameStateReducer(
			{ ...initialState, errorSum: 10 },
			incrementErrorSum(5)
		);
		expect(state.errorSum).toBe(15);
	});

	// Test clearErrorSum
	it('should reset error sum to 0', () => {
		const state = gameStateReducer(
			{ ...initialState, errorSum: 10 },
			clearErrorSum()
		);
		expect(state.errorSum).toBe(0);
	});

	// Test incrementErrorCount
	it('should increment error count by a given value', () => {
		const state = gameStateReducer(
			{ ...initialState, errorCount: 2 },
			incrementErrorCount(3)
		);
		expect(state.errorCount).toBe(5);
	});

	// Test clearErrorCount
	it('should reset error count to 0', () => {
		const state = gameStateReducer(
			{ ...initialState, errorCount: 5 },
			clearErrorCount()
		);
		expect(state.errorCount).toBe(0);
	});
});
