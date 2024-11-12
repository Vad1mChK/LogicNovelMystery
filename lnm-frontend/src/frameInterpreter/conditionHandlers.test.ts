/* eslint-disable no-magic-numbers */

import evaluateConditionWithDefaults, {
	createConditionEvaluator,
} from './conditionHandlers';
import { LnmFrameCondition } from './types';

let evaluateCondition = evaluateConditionWithDefaults;

describe('test frame condition evaluation', () => {
	beforeAll(() => {
		evaluateCondition = createConditionEvaluator(
			() => 50,
			() => ['iAmSteve', 'okay', 'thisGuyIsSuchAToolbag'],
			() => false,
			() => false,
			() => false
		);
	});

	test('trivial conditions should evaluate correctly', () => {
		const trueCondition: LnmFrameCondition = {
			healthMore: 49,
		};
		expect(evaluateCondition(trueCondition)).toBe(true);

		const falseCondition: LnmFrameCondition = {
			partnerCurrentlyOnChapter: 'impossibleToBeOn',
		};
		expect(evaluateCondition(falseCondition)).toBe(false);
	});

	test('multiple-field conditions should evaluate correctly', () => {
		const trueCondition: LnmFrameCondition = {
			healthMore: 49,
			healthLess: 51,
		};
		expect(evaluateCondition(trueCondition)).toBe(true);

		const falseCondition: LnmFrameCondition = {
			healthMore: 49,
			partnerDeadOnChapter: 'impossibleToDieOn',
		};
		expect(evaluateCondition(falseCondition)).toBe(false);
	});

	test('compound OR, AND, NOT conditions should evaluate correctly', () => {
		const trueCondition: LnmFrameCondition = {
			hasKnowledge: 'iAmSteve', // = true
		};
		const falseCondition: LnmFrameCondition = {
			partnerPassedChapter: 'impossible', // = false
		};
		expect(evaluateCondition(trueCondition)).toBe(true);
		expect(evaluateCondition(falseCondition)).toBe(false);
		expect(
			evaluateCondition({
				not: trueCondition,
			})
		).toBe(false); // !true
		expect(
			evaluateCondition({
				not: falseCondition,
			})
		).toBe(true); // !false
		expect(
			evaluateCondition({
				or: [trueCondition, falseCondition],
			})
		).toBe(true); // true || false
		expect(
			evaluateCondition({
				and: [trueCondition, falseCondition],
			})
		).toBe(false); // true && false
		expect(
			evaluateCondition({
				or: [
					{ not: trueCondition },
					{ and: [trueCondition, falseCondition] },
				],
			})
		).toBe(false); // !true || (true && false)
	});
});
