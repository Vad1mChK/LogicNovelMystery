import { LnmFrameCondition } from './types';

type HealthGetter = () => number;
type KnowledgeGetter = () => string[];
type PartnerStateGetter = (chapter: string) => boolean;

function _getHealth(): number {
	// TODO retrieve health from app state
	return 100;
}

function _getKnowledge(): string[] {
	// TODO retrieve knowledge from app state
	return [];
}

function _isPartnerDeadOnChapter(chapter: string): boolean {
	// TODO: for multiplayer, refer on some kind of update exchange
	// For single player, always return false
	console.log(chapter);
	return false;
}

function _isPartnerCurrentlyOnChapter(chapter: string): boolean {
	// TODO: for multiplayer, refer on some kind of update exchange
	// For single player, always return false
	console.log(chapter);
	return false;
}

function _isPartnerPassedChapter(chapter: string): boolean {
	// TODO: for multiplayer, refer on some kind of update exchange
	// For single player, always return false
	console.log(chapter);
	return false;
}

export function createConditionEvaluator(
	getHealth: HealthGetter = _getHealth,
	getKnowledge: KnowledgeGetter = _getKnowledge,
	isPartnerDeadOnChapter: PartnerStateGetter = _isPartnerDeadOnChapter,
	isPartnerCurrentlyOnChapter: PartnerStateGetter = _isPartnerCurrentlyOnChapter,
	isPartnerPassedChapter: PartnerStateGetter = _isPartnerPassedChapter
) {
	const handlers = new Map(
		Object.entries({
			hasKnowledge: (value: string) => getKnowledge().includes(value),
			partnerDeadOnChapter: (value: string) =>
				isPartnerDeadOnChapter(value),
			partnerCurrentlyOnChapter: (value: string) =>
				isPartnerCurrentlyOnChapter(value),
			partnerPassedChapter: (value: string) =>
				isPartnerPassedChapter(value),
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

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
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
