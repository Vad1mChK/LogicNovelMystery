/* eslint-disable no-magic-numbers */

import plotData from '../assets/plot/test_plot_for_plot_loader_en-US.json';
import {
	_convertAndCreateCondition,
	_convertAndCreateEffect,
	_convertAndCreateEnding,
	_convertAndCreateFrame,
	_convertAndCreatePlot,
} from './PlotLoader';
import { expect } from '@playwright/test';
import {
	LnmEffectArgsMap,
	LnmFrameEffectType,
	LnmKnowledgeType,
	LnmTaskType,
} from './types';

describe('Test plot loading', () => {
	test('condition object should be converted to condition correctly', () => {
		const conditionObject = {
			and: [
				{ not: { hasKnowledge: 'iAmSteve' } },
				{ or: [{ healthEquals: 60 }, { healthLess: 60 }] },
			],
		};
		const condition = _convertAndCreateCondition(conditionObject);
		expect(condition.and).toBeInstanceOf(Array);
		expect(condition.and).not.toBeNull();
		expect(condition.and?.length).toBe(2);
		expect(condition.and?.[0]?.not?.hasKnowledge).toBe('iAmSteve');
		expect(condition.and?.[1]?.or).toBeInstanceOf(Array);
		expect(condition.partnerDeadOnChapter).toBeUndefined();
	});
	test('condition object should not have any fields set if types are wrong', () => {
		const conditionObject = {
			hasKnowledge: true,
			healthMore: 'five',
			or: null,
		};
		const condition = _convertAndCreateCondition(conditionObject);
		expect(condition.hasKnowledge).toBeUndefined();
		expect(condition.healthMore).toBeUndefined();
		expect(condition.or).toBeUndefined();
	});
	test('effect should be created correctly without conditions', () => {
		const effectObject = {
			type: 'JUMP',
			args: {
				frameId: 'someFrame',
			},
		};
		const effect = _convertAndCreateEffect(effectObject);
		expect(effect).not.toBeNull();
		expect(effect?.type).toBe(LnmFrameEffectType.JUMP);
		expect(
			(effect?.args as LnmEffectArgsMap[LnmFrameEffectType.JUMP]).frameId
		).toBe('someFrame');
	});
	test('effect should be created correctly with condition', () => {
		const effectObject = {
			type: 'JUMP',
			if: {
				healthEquals: 0,
				not: {
					hasKnowledge: 'iAmSteve',
				},
			},
			args: {
				frameId: 'someFrame',
			},
		};
		const effect = _convertAndCreateEffect(effectObject);
		expect(effect).not.toBeNull();
		expect(effect?.type).toBe(LnmFrameEffectType.JUMP);
		expect(
			(effect?.args as LnmEffectArgsMap[LnmFrameEffectType.JUMP]).frameId
		).toBe('someFrame');
		expect(effect?.if?.healthEquals).toBe(0);
		expect(effect?.if?.not?.hasKnowledge).toBe('iAmSteve');
	});
	test('effect should not be created if effect type is invalid', () => {
		const effectObject = {
			type: 'JUMP_JUMP_SLIDE_SLIDE',
			args: {
				frameId: 'someFrame',
			},
		};
		const effect = _convertAndCreateEffect(effectObject);
		expect(effect).toBeNull();
	});
	test('frame should be created correctly, empty dialogue should be inferred', () => {
		const frameObject = {
			id: 'someFrame',
			characters: [
				{
					id: 'steve',
				},
				{
					id: 'professor',
				},
			],
			speaker: 'steve',
			nextFrame: 'anotherFrame',
		};
		const frame = _convertAndCreateFrame(frameObject);
		expect(frame.id).toBe('someFrame');
		expect(frame.characters).toBeInstanceOf(Array);
		expect(frame.characters?.length).toBe(2);
		expect(frame.speaker).toBe('steve');
		expect(frame.dialogue).toBe('');
		expect(frame.nextFrame).toBe('anotherFrame');
	});
	test('frame should be created correctly with 1 character, speaker should be inferred', () => {
		const frameObject = {
			id: 'someFrame',
			characters: [
				{
					id: 'steve',
				},
			],
			choices: [
				{
					text: 'Investigate',
					nextFrame: 'investigate',
				},
				{
					text: 'Back away',
					nextFrame: 'backingAway',
				},
			],
		};
		const frame = _convertAndCreateFrame(frameObject);
		expect(frame.characters?.length).toBe(1);
		expect(frame.speaker).toBe('steve');
		expect(frame.choices?.length).toBe(2);
		expect(frame.choices?.[0]?.text).toBe('Investigate');
	});
	test('frame should be created correctly without characters', () => {
		const frameObject = {
			id: 'someFrame',
			nextFrame: 'anotherFrame',
		};
		const frame = _convertAndCreateFrame(frameObject);
		expect(frame.characters).toBeUndefined();
		expect(frame.speaker).toBeUndefined();
	});
	test('frame should be created correctly with nested effects and conditions', () => {
		const frameObject = {
			id: 'inception3_start',
			location: 'mansionEntrance',
			characters: [
				{
					id: 'steve',
					pose: 'holdNotebook',
					hidden: true,
				},
			],
			dialogue: "Let's find out!",
			nextFrame: 'inception3_01',
			effects: [
				{
					type: 'JUMP',
					if: {
						healthLess: 50,
					},
					args: { frameId: 'someFrame' },
				},
				{
					type: 'PLAY_MUSIC',
					args: {
						musicId: 'investigation',
					},
				},
			],
		};
		const frame = _convertAndCreateFrame(frameObject);
		expect(frame.effects?.length).toBe(2);
		expect(frame.effects?.[0]?.if).toBeDefined();
		expect(frame.effects?.[0]?.if?.healthLess).toBe(50);
	});
	test('plot should be created correctly', () => {
		const plot = _convertAndCreatePlot(plotData);
		expect(plot.metadata.name).toBe('Mystery of the Forgotten Village');
		expect(plot.characters.size).toBe(2);
		expect(plot.chapters).toBeInstanceOf(Map);
		expect(plot.tasks.size).not.toBe(0);
		expect(plot.tasks.get('task1')?.type).toBe(LnmTaskType.SELECT_ONE);
		expect(plot.knowledge.get('village_mystery')?.type).not.toBe(
			LnmKnowledgeType.RULE
		);
		expect(plot.knowledge.get('village_mystery')?.content).toBe(
			'holds(village, secrets).'
		);
	});
	test('ending should be created correctly', () => {
		const endingObject = {
			id: 'sampleEnding',
			title: 'Sample Ending',
			condition: {
				healthMore: 50,
			},
			startFrame: 'sampleEnding_start',
			frames: {
				sampleEnding_start: {
					id: 'sampleEnding_start',
					dialogue: "You're too slow",
					nextFrame: 'sampleEnding_1',
				},
				sampleEnding_1: {
					id: 'sampleEnding_1',
					dialogue: 'Want to try again?',
					nextFrame: null,
				},
			},
		};
		const ending = _convertAndCreateEnding(endingObject);
		expect(ending.id).toBe('sampleEnding');
		expect(ending.title).toBe('Sample Ending');
		expect(ending.condition).toBeDefined();
		expect(ending.startFrame).toBe('sampleEnding_start');
		expect(ending.frames.keys()).toContain(ending.startFrame);
		expect(ending.frames.size).toBe(2);
	});
});
