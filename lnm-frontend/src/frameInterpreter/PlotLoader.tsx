// PlotLoader.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

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

interface PlotLoaderProps {
	plotUrl: string;
	onLoad: (plot: LnmPlot) => void;
}

const PlotLoader: React.FC<PlotLoaderProps> = ({ plotUrl, onLoad }) => {
	useEffect(() => {
		fetch(plotUrl)
			.then((response) => {
				if (!response.ok)
					throw new Error('Network response was not ok');
				return response.json();
			})
			.then((plotObject) => {
				const plot = convertAndCreatePlot(plotObject);
				onLoad(plot);
			})
			.catch((error) => console.error('Failed to load plot:', error));
	}, [plotUrl, onLoad]);

	return <div>Loading plot...</div>;
};

function convertAndCreatePlot(plotObject: any): LnmPlot {
	const metadata: LnmMetadata = plotObject.metadata as LnmMetadata;
	const characters = new Map<string, LnmCharacter>(
		Object.entries(plotObject.characters).map(
			([characterId, characterData]) => [
				characterId,
				{
					// @ts-expect-error character data is object
					...characterData,
					// @ts-expect-error sprites is object
					sprites: objectToMap<string>(characterData.sprites), // Convert poses to Map<string, string>
				} as LnmCharacter,
			]
		)
	);
	const locations = objectToMap<LnmLocation>(plotObject.locations);
	const music = new Map<string, LnmMusic>(
		Object.entries(plotObject.music).map(([musicId, musicData]) => [
			musicId,
			{
				...LNM_MUSIC_DEFAULTS,
				// @ts-expect-error music data is any
				...musicData,
			},
		])
	);
	const chapters = objectToMap<LnmChapter>(plotObject.chapters);
	const framesMain = new Map(
		Object.entries(plotObject.frames.main).map(
			([chapterId, chapterData]) => [
				chapterId,
				new Map<string, LnmFrame>(
					Object.entries(chapterData as Record<string, any>).map(
						([frameId, frameData]) => [
							frameId,
							convertAndCreateFrame(frameData),
						]
					)
				),
			]
		)
	);
	const framesEndings = // objectToMap<LnmEnding>(plotObject.frames.endings);
		new Map(
			Object.entries(plotObject.frames.endings).map(
				([endingId, endingData]) => [
					endingId,
					convertAndCreateEnding(endingData),
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

function convertAndCreateFrame(frameObject: any): LnmFrame {
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
		? frameObject.effects.map((elem: any) => convertAndCreateEffect(elem))
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

function convertAndCreateEffect(effectObject: any): LnmFrameEffect | null {
	// Convert the `type` field to an enum value and check if it's valid
	const effectType = toEnumValue(LnmFrameEffectType, effectObject.type);
	if (!effectType) {
		console.warn(`Invalid effect type: ${effectObject.type}`);
		return null;
	}

	// Use the `effectType` to infer the correct type for `args`
	const args = effectObject.args as LnmEffectArgsMap[typeof effectType];

	const _if = effectObject.if
		? convertAndCreateCondition(effectObject.if)
		: undefined;

	const result: LnmFrameEffect<typeof effectType> = {
		type: effectType,
		if: _if,
		args,
	};

	return result;
}

function convertAndCreateCondition(conditionObject: any): LnmFrameCondition {
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
		or: Array.isArray(or) ? or.map(convertAndCreateCondition) : undefined,
		and: Array.isArray(and)
			? and.map(convertAndCreateCondition)
			: undefined,
		not:
			not && typeof not === 'object'
				? convertAndCreateCondition(not)
				: undefined,
	} as LnmFrameCondition;
}

function convertAndCreateEnding(endingObject: any): LnmEnding {
	const { id, title, condition, startFrame, frames } = endingObject;
	return {
		id,
		title,
		condition: condition ? convertAndCreateCondition(condition) : undefined,
		startFrame,
		frames: new Map(
			Object.entries(frames).map(([frameId, frameData]) => [
				frameId,
				convertAndCreateFrame(frameData),
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
