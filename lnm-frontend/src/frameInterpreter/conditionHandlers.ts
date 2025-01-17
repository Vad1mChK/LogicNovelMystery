import { LnmFrameCondition } from './types';

type HealthGetter = () => number;

function _getHealth(): number {
	// TODO retrieve health from app state
	return 100;
}

export function createConditionEvaluator(getHealth: HealthGetter = _getHealth) {
	const handlers = new Map(
		Object.entries({
			healthLess: (value: number) => getHealth() < value,
			healthEquals: (value: number) => getHealth() === value,
			healthMore: (value: number) => getHealth() > value,
		})
	);

	function evaluateCompoundCondition(condition: LnmFrameCondition): boolean {
		if (condition.and && !condition.and.every(evaluateCondition))
			return false;
		if (condition.or && !condition.or.some(evaluateCondition)) return false;
		return !(condition.not && evaluateCondition(condition.not));
	}

	function evaluateCondition(condition: LnmFrameCondition): boolean {
		for (const [key, value] of Object.entries(condition)) {
			if (value === undefined) {
				continue;
			}

			if (handlers.has(key) && !handlers.get(key)!(value)) {
				console.log(`condition ${key}: ${value} is false`);
				return false;
			}
		}
		return evaluateCompoundCondition(condition);
	}

	return evaluateCondition;
}

const evaluateConditionWithDefaults = createConditionEvaluator();
export default evaluateConditionWithDefaults;
