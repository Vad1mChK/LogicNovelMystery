// PlotLoader.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import React, { useEffect } from 'react';
import {
	LNM_FRAME_CHARACTER_DATA_DEFAULTS,
	LNM_MUSIC_DEFAULTS,
	LnmChapter,
	LnmCharacter,
	LnmEffectArgsMap,
	LnmEnding,
	LnmFrame,
	LnmFrameCharacterData,
	LnmFrameChoice,
	LnmFrameCondition,
	LnmFrameEffect,
	LnmFrameEffectType,
	LnmKnowledge,
	LnmLocation,
	LnmMetadata,
	LnmMusic,
	LnmPlot,
	LnmTask,
} from './types';
import { assignIfValidType, objectToMap, toEnumValue } from '../util/typeUtils';
import { useNavigate } from 'react-router-dom';

interface PlotLoaderProps {
	plotUrl: string;
	onLoad: (plot: LnmPlot) => void;
}

const PlotLoader: React.FC<PlotLoaderProps> = ({ plotUrl, onLoad }) => {
	const navigate = useNavigate();

	// Uncomment to test abort
	// plotUrl = 'https://httpbin.org/delay/10';
	useEffect(() => {
		const controller = new AbortController();
		console.log('Controller created');
		const { signal } = controller;

		axios
			.get(plotUrl, { signal }) // Use signal in Axios config
			.then((response) => {
				console.log('Plot JSON fetched');
				const plot = convertAndCreatePlot(response.data, signal);
				console.log('Plot converted and created');
				onLoad(plot);
			})
			.catch((error) => {
				if (axios.isCancel(error)) {
					console.log('Fetch aborted: ', error);
				} else if (
					error.name === 'AbortError' ||
					error.message === 'Aborted'
				) {
					console.log('Processing aborted: ', error);
				} else {
					console.error('Failed to load plot:', error);
				}
			});

		// Cleanup: Abort the request
		return () => {
			controller.abort();
		};
	}, [plotUrl, onLoad]);

	return (
		<div>
			<p>Loading plot...</p>
			<button onClick={() => navigate('/main')}>Cancel</button>
		</div>
	);
};

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
	const framesEndings = // objectToMap<LnmEnding>(plotObject.frames.endings);
		new Map(
			Object.entries(plotObject.frames.endings).map(
				([endingId, endingData]) => [
					endingId,
					convertAndCreateEnding(endingData, signal),
				]
			)
		);
	const tasks = objectToMap<LnmTask>(plotObject.tasks);
	const knowledge = objectToMap<LnmKnowledge>(plotObject.knowledge);

	return {
		metadata,
		characters,
		locations,
		music,
		chapters,
		startChapter: plotObject.startChapter,
		frames: {
			main: framesMain,
			endings: framesEndings,
		},
		tasks,
		knowledge,
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

	const result: LnmFrameEffect<typeof effectType> = {
		type: effectType,
		if: _if,
		args,
	};

	return result;
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

function convertAndCreateEnding(
	endingObject: any,
	signal?: AbortSignal
): LnmEnding {
	if (signal?.aborted) throw new Error('Aborted');

	const { id, title, condition, startFrame, frames } = endingObject;
	return {
		id,
		title,
		condition: condition
			? convertAndCreateCondition(condition, signal)
			: undefined,
		startFrame,
		frames: new Map(
			Object.entries(frames).map(([frameId, frameData]) => [
				frameId,
				convertAndCreateFrame(frameData, signal),
			])
		),
	} as LnmEnding;
}

export default PlotLoader;
export {
	convertAndCreateCondition as _convertAndCreateCondition,
	convertAndCreateEffect as _convertAndCreateEffect,
	convertAndCreateFrame as _convertAndCreateFrame,
	convertAndCreatePlot as _convertAndCreatePlot,
	convertAndCreateEnding as _convertAndCreateEnding,
};
