/* eslint-disable no-magic-numbers */

import evaluateConditionWithDefaults, {
	createConditionEvaluator,
} from './conditionHandlers';
import { LnmFrameCondition } from './types';

let evaluateCondition = evaluateConditionWithDefaults;

describe('conditionHandlers', () => {
	beforeAll(() => {
		evaluateCondition = createConditionEvaluator(() => 50);
	});

	test('trivial conditions should evaluate correctly', () => {
		const trueCondition: LnmFrameCondition = {
			healthMore: 49,
		};
		expect(evaluateCondition(trueCondition)).toBe(true);

		const falseCondition: LnmFrameCondition = {
			healthMore: 55,
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
			healthMore: 51,
			healthLess: 49,
		};
		expect(evaluateCondition(falseCondition)).toBe(false);
	});

	test('compound OR, AND, NOT conditions should evaluate correctly', () => {
		const trueCondition: LnmFrameCondition = {
			healthEquals: 50,
		};
		const falseCondition: LnmFrameCondition = {
			healthMore: 50, // = false
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
