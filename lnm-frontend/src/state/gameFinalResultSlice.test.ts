import reducer, {
  setResult,
  setPartnerName,
  setScore,
  setHighScore,
  resetFinalResultState,
  GameFinalResultState,
} from './gameFinalResultSlice';
import { LnmResult } from '../frameInterpreter/types';

describe('gameFinalResultSlice', () => {
  const initialState: GameFinalResultState = {
    result: null,
    partnerName: null,
    score: 0,
    highScore: null,
  };

  it('should return the initial state when passed an empty action', () => {
    const nextState = reducer(undefined, { type: '' });
    expect(nextState).toEqual(initialState);
  });

  it('should handle setResult', () => {
    const nextState = reducer(
      initialState,
      setResult(LnmResult.SINGLE_GOOD)
    );
    expect(nextState.result).toBe(LnmResult.SINGLE_GOOD);
    expect(nextState).toEqual({
      ...initialState,
      result: LnmResult.SINGLE_GOOD,
    });
  });

  it('should handle setPartnerId', () => {
    const partnerName = 'partner123';
    const nextState = reducer(initialState, setPartnerName(partnerName));
    expect(nextState.partnerName).toBe(partnerName);
    expect(nextState).toEqual({
      ...initialState,
      partnerName,
    });
  });

  it('should handle setScore', () => {
    const score = 25000;
    const nextState = reducer(initialState, setScore(score));
    expect(nextState.score).toBe(score);
    expect(nextState).toEqual({
      ...initialState,
      score,
    });
  });

  it('should handle setHighScore', () => {
    const highScore = 50000;
    const nextState = reducer(initialState, setHighScore(highScore));
    expect(nextState.highScore).toBe(highScore);
    expect(nextState).toEqual({
      ...initialState,
      highScore,
    });
  });

  it('should handle resetFinalResultState', () => {
    const modifiedState: GameFinalResultState = {
      result: LnmResult.DOUBLE_GOOD,
      partnerName: 'partner123',
      score: 15000,
      highScore: 20000,
    };

    const nextState = reducer(modifiedState, resetFinalResultState());
    expect(nextState).toEqual(initialState);
  });

  it('should handle setHighScore with null', () => {
    const modifiedState: GameFinalResultState = {
      ...initialState,
      highScore: 20000,
    };

    const nextState = reducer(modifiedState, setHighScore(null));
    expect(nextState.highScore).toBeNull();
    expect(nextState).toEqual({
      ...initialState,
      highScore: null,
    });
  });
});
