/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	LNM_FRAME_CHARACTER_DATA_DEFAULTS,
	LNM_MUSIC_DEFAULTS,
	LnmChapter,
	LnmCharacter,
	LnmEffectArgsMap,
	LnmFrame,
	LnmFrameCharacterData,
	LnmFrameChoice,
	LnmFrameCondition,
	LnmFrameEffect,
	LnmFrameEffectType,
	LnmLocation,
	LnmMetadata,
	LnmMusic,
	LnmPlot,
	LnmTask,
	LnmTaskType,
} from './types';
import { assignIfValidType, objectToMap, toEnumValue } from '../util/typeUtils';

function convertAndCreatePlot(plotObject: any, signal?: AbortSignal): LnmPlot {
	if (signal?.aborted) throw new Error('Aborted');

	const metadata: LnmMetadata = plotObject.metadata as LnmMetadata;
	const characters = new Map<string, LnmCharacter>(
		Object.entries(plotObject.characters).map(
			([characterId, characterData]) => {
				if (signal?.aborted) throw new Error('Aborted');
				return [
					characterId,
					{
						// @ts-expect-error character data is object
						...characterData,
						// @ts-expect-error sprites is object
						sprites: objectToMap<string>(characterData.sprites), // Convert poses to Map<string, string>
					} as LnmCharacter,
				];
			}
		)
	);
	const locations = objectToMap<LnmLocation>(plotObject.locations);
	const music = new Map<string, LnmMusic>(
		Object.entries(plotObject.music).map(([musicId, musicData]) => {
			if (signal?.aborted) throw new Error('Aborted');
			return [
				musicId,
				{
					...LNM_MUSIC_DEFAULTS,
					// @ts-expect-error music data is any
					...musicData,
				},
			];
		})
	);
	const chapters = objectToMap<LnmChapter>(plotObject.chapters);
	const framesMain = new Map(
		Object.entries(plotObject.frames.main).map(
			([chapterId, chapterData]) => {
				if (signal?.aborted) throw new Error('Aborted');
				return [
					chapterId,
					new Map<string, LnmFrame>(
						Object.entries(chapterData as Record<string, any>).map(
							([frameId, frameData]) => [
								frameId,
								convertAndCreateFrame(frameData, signal),
							]
						)
					),
				];
			}
		)
	);
	const tasks = new Map(
		Object.entries(plotObject.tasks).map(([taskId, taskData]) => [
			taskId,
			convertAndCreateTask(taskData, signal),
		])
	);

	return {
		metadata,
		characters,
		locations,
		music,
		chapters,
		startChapter: plotObject.startChapter,
		defaultEnding: plotObject.defaultEnding,
		frames: {
			main: framesMain,
		},
		tasks,
	};
}

function convertAndCreateFrame(
	frameObject: any,
	signal?: AbortSignal
): LnmFrame {
	if (signal?.aborted) throw new Error('Aborted');

	const characters: LnmFrameCharacterData[] | undefined =
		frameObject.characters
			? frameObject.characters.map(
					(elem: Partial<LnmFrameCharacterData>) => ({
						...LNM_FRAME_CHARACTER_DATA_DEFAULTS,
						...elem,
					})
				)
			: undefined;
	const speaker: string | undefined =
		frameObject.speaker ??
		(characters?.length == 1 ? characters[0].id : undefined);
	const choices: LnmFrameChoice[] | undefined = frameObject.choices
		? frameObject.choices.map(
				(elem: LnmFrameChoice) => elem as LnmFrameChoice
			)
		: undefined;
	const effects: LnmFrameEffect[] | undefined = frameObject.effects
		? frameObject.effects.map((elem: any) =>
				convertAndCreateEffect(elem, signal)
			)
		: undefined;
	return {
		id: frameObject.id,
		location: frameObject.location,
		characters,
		dialogue: frameObject.dialogue ?? '',
		speaker,
		choices,
		nextFrame: frameObject.nextFrame,
		effects,
	};
}

function convertAndCreateEffect(
	effectObject: any,
	signal?: AbortSignal
): LnmFrameEffect | null {
	if (signal?.aborted) throw new Error('Aborted');

	// Convert the `type` field to an enum value and check if it's valid
	const effectType = toEnumValue(LnmFrameEffectType, effectObject.type);
	if (!effectType) {
		console.warn(`Invalid effect type: ${effectObject.type}`);
		return null;
	}

	// Use the `effectType` to infer the correct type for `args`
	const args = effectObject.args as LnmEffectArgsMap[typeof effectType];

	const _if = effectObject.if
		? convertAndCreateCondition(effectObject.if, signal)
		: undefined;

	return {
		type: effectType,
		if: _if,
		args,
	};
}

function convertAndCreateCondition(
	conditionObject: any,
	signal?: AbortSignal
): LnmFrameCondition {
	if (signal?.aborted) throw new Error('AbortError');

	const {
		hasKnowledge,
		partnerDeadOnChapter,
		partnerCurrentlyOnChapter,
		partnerPassedChapter,
		healthLess,
		healthEquals,
		healthMore,
		or,
		and,
		not,
	} = conditionObject;
	return {
		hasKnowledge: assignIfValidType<string>(hasKnowledge, 'string'),
		partnerDeadOnChapter: assignIfValidType<string>(
			partnerDeadOnChapter,
			'string'
		),
		partnerCurrentlyOnChapter: assignIfValidType<string>(
			partnerCurrentlyOnChapter,
			'string'
		),
		partnerPassedChapter: assignIfValidType<string>(
			partnerPassedChapter,
			'string'
		),
		healthLess: assignIfValidType<number>(healthLess, 'number'),
		healthEquals: assignIfValidType<number>(healthEquals, 'number'),
		healthMore: assignIfValidType<number>(healthMore, 'number'),
		or: Array.isArray(or)
			? or.map((condObj) => convertAndCreateCondition(condObj, signal))
			: undefined,
		and: Array.isArray(and)
			? and.map((condObj) => convertAndCreateCondition(condObj, signal))
			: undefined,
		not:
			not && typeof not === 'object'
				? convertAndCreateCondition(not, signal)
				: undefined,
	} as LnmFrameCondition;
}

function convertAndCreateTask(taskObject: any, signal?: AbortSignal): LnmTask {
	if (signal?.aborted) throw new Error('Aborted');

	const {
		id,
		type,
		questionText,
		hint,
		nextFrameOnSuccess,
		nextFrameOnFailure,
		failureScorePenalty,
	} = taskObject;

	switch (type) {
		case LnmTaskType.SELECT_ONE: {
			const { options, correctAnswerIndex } = taskObject;
			return {
				id,
				type,
				questionText,
				hint,
				nextFrameOnSuccess,
				nextFrameOnFailure,
				failureScorePenalty,
				options,
				correctAnswerIndex,
			};
		}
		case LnmTaskType.SELECT_MANY: {
			const { options, correctAnswerIndices } = taskObject;
			return {
				id,
				type,
				questionText,
				hint,
				nextFrameOnSuccess,
				nextFrameOnFailure,
				failureScorePenalty,
				options,
				correctAnswerIndices,
			};
		}
		case LnmTaskType.WRITE_KNOWLEDGE: {
			const { knowledge, defaultValue } = taskObject;
			const testCasesObject = taskObject.testCases;
			const testCases = testCasesObject.map((testCase: any) => ({
				input: testCase.input,
				expectedResults: testCase.expectedResults.map(
					(result: any) => result.variables
				),
			}));
			return {
				id,
				type,
				questionText,
				hint,
				nextFrameOnSuccess,
				nextFrameOnFailure,
				failureScorePenalty,
				knowledge,
				defaultValue,
				testCases,
			};
		}
		case LnmTaskType.COMPLETE_QUERY: {
			const { knowledge, defaultValue } = taskObject;
			const expectedResultsObject = taskObject.expectedResults;
			const expectedResults = expectedResultsObject.map(
				(result: any) => result.variables
			);

			return {
				id,
				type,
				questionText,
				hint,
				nextFrameOnSuccess,
				nextFrameOnFailure,
				failureScorePenalty,
				knowledge,
				expectedResults,
				defaultValue,
			};
		}
		default: {
			throw new Error('Unknown task type');
		}
	}
}

export {
	convertAndCreateCondition,
	convertAndCreateEffect,
	convertAndCreateFrame,
	convertAndCreatePlot,
	convertAndCreateTask,
};
