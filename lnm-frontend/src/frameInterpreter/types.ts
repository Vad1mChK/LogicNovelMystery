export interface LnmPlot {
	metadata: LnmMetadata;
	characters: Map<string, LnmCharacter>;
	locations: Map<string, LnmLocation>;
	music: Map<string, LnmMusic>;
	startChapter: string;
	chapters: Map<string, LnmChapter>;
	defaultEnding?: string;
	frames: {
		main: Map<string, Map<string, LnmFrame>>;
	};
	tasks: Map<string, LnmTask>;
}

export interface LnmMetadata {
	name: string;
	gamemode: 'single' | 'pair';
	protagonist: string;
	author: string;
	version: string;
	locale: string;
}

export interface LnmCharacter {
	id: string;
	name: string;
	defaultPose: string | null;
	sprites: Map<string, string>;
}

export interface LnmLocation {
	id: string;
	name: string;
	background: string;
}

export interface LnmMusic {
	id: string;
	name: string;
	performer: string;
	file: string;
	loop?: boolean;
}

export const LNM_MUSIC_DEFAULTS: Pick<LnmMusic, 'loop'> = {
	loop: false,
};

export interface LnmChapter {
	id: string;
	title: string;
	startFrame: string;
	nextChapter: string;
	waitForPartner?: boolean; // Default: false
	isEnding?: boolean;
}

export const LNM_CHAPTER_DEFAULTS: Pick<
	LnmChapter,
	'waitForPartner' | 'isEnding'
> = {
	waitForPartner: false,
	isEnding: false,
};

export interface LnmFrame {
	id: string;
	location?: string;
	characters?: LnmFrameCharacterData[]; // If not specified, use currently stored characters
	dialogue: string;
	speaker?: string; // If omitted: 1. if only one character on scene, pick this one character; 2. else, choose the previous speaker
	choices?: LnmFrameChoice[]; // Can be omitted if there is nextFrame or this is played during an ending
	nextFrame?: string; // Can be omitted if there is nextFrame or this is played during an ending
	effects?: LnmFrameEffect[];
}

export interface LnmFrameCharacterData {
	id: string;
	position?: 'left' | 'center' | 'right';
	pose?: string | null;
	hidden?: boolean;
}

export const LNM_FRAME_CHARACTER_DATA_DEFAULTS: Pick<
	LnmFrameCharacterData,
	'position' | 'pose' | 'hidden'
> = {
	position: 'center',
	pose: null, // Then initialize with the character's default pose, if any
	hidden: false,
};

export interface LnmFrameChoice {
	text: string;
	nextFrame: string;
}

export interface LnmFrameCondition {
	hasKnowledge?: string;
	partnerDeadOnChapter?: string;
	partnerCurrentlyOnChapter?: string;
	partnerPassedChapter?: string;
	healthLess?: number;
	healthEquals?: number;
	healthMore?: number;
	or?: LnmFrameCondition[];
	and?: LnmFrameCondition[];
	not?: LnmFrameCondition;
}

// Types of effects
export enum LnmFrameEffectType {
	JUMP = 'JUMP',
	JUMP_CHAPTER = 'JUMP_CHAPTER',
	FADE_IN_CHARACTER = 'FADE_IN_CHARACTER',
	FADE_OUT_CHARACTER = 'FADE_OUT_CHARACTER',
	CHANGE_POSE = 'CHANGE_POSE',
	PLAY_MUSIC = 'PLAY_MUSIC',
	STOP_MUSIC = 'STOP_MUSIC',
	INCREASE_HEALTH = 'INCREASE_HEALTH',
	DECREASE_HEALTH = 'DECREASE_HEALTH',
	START_TASK = 'START_TASK',
	END_CAMPAIGN = 'END_CAMPAIGN',
	STOP = 'STOP',
}

// Individual type of effect args
export type LnmEffectArgsMap = {
	[LnmFrameEffectType.JUMP]: {
		frameId: string;
	};
	[LnmFrameEffectType.JUMP_CHAPTER]: {
		chapterId: string;
	};
	[LnmFrameEffectType.FADE_IN_CHARACTER]: {
		characterId: string;
	};
	[LnmFrameEffectType.FADE_OUT_CHARACTER]: {
		characterId: string;
	};
	[LnmFrameEffectType.CHANGE_POSE]: {
		characterId: string;
		newPose: string;
	};
	[LnmFrameEffectType.PLAY_MUSIC]: {
		musicId: string;
		fadeInDuration?: number; // No fade-in by default
	};
	[LnmFrameEffectType.STOP_MUSIC]: {
		fadeOutDuration?: number; // No fade-out by default
	};
	[LnmFrameEffectType.INCREASE_HEALTH]: {
		amount: number | 'full'; // 'full' restores health fully
	};
	[LnmFrameEffectType.DECREASE_HEALTH]: {
		amount: number | 'kill'; // 'kill' drops health to 0
	};
	[LnmFrameEffectType.START_TASK]: {
		taskId: string;
	};
	[LnmFrameEffectType.END_CAMPAIGN]: {
		winner: boolean;
	};
	[LnmFrameEffectType.STOP]: object;
	// Add additional effect mappings as needed
};

export interface LnmFrameEffect<
	T extends LnmFrameEffectType = LnmFrameEffectType,
> {
	type: T;
	if?: LnmFrameCondition;
	args: T extends keyof LnmEffectArgsMap ? LnmEffectArgsMap[T] : never;
}

export interface LnmEnding {
	id: string;
	title: string;
	condition?: LnmFrameCondition;
	startFrame: string;
	frames: Map<string, LnmFrame>;
}

export enum LnmTaskType {
	WRITE_KNOWLEDGE = 'WRITE_KNOWLEDGE',
	COMPLETE_QUERY = 'COMPLETE_QUERY',
	SELECT_ONE = 'SELECT_ONE',
	SELECT_MANY = 'SELECT_MANY',
}

// types.ts

// Common Task Fields
interface LnmBaseTask {
	id: string;
	type: LnmTaskType;
	questionText: string;
	hint?: string;
	nextFrameOnSuccess: string;
	nextFrameOnFailure: string;
	failureScorePenalty?: number;
}

// Task-Specific Interfaces

// WRITE_KNOWLEDGE Task
export interface LnmWriteKnowledgeTask extends LnmBaseTask {
	type: LnmTaskType.WRITE_KNOWLEDGE;
	testCases: {
		query: string;
		expectedResults: { variables: Record<string, string> }[];
	}[];
	knowledge: string[];
	defaultValue?: string;
}

// COMPLETE_QUERY Task
export interface LnmCompleteQueryTask extends LnmBaseTask {
	type: LnmTaskType.COMPLETE_QUERY;
	expectedResults: { variables: Record<string, string> }[];
	knowledge: string[];
	defaultValue?: string;
}

// SELECT_ONE Task
export interface LnmSelectOneTask extends LnmBaseTask {
	type: LnmTaskType.SELECT_ONE;
	options: string[];
	correctAnswerIndex: number;
}

// SELECT_MANY Task
export interface LnmSelectManyTask extends LnmBaseTask {
	type: LnmTaskType.SELECT_MANY;
	options: string[];
	correctAnswerIndices: number[];
}

// Union Type for All Tasks
export type LnmTask =
	| LnmWriteKnowledgeTask
	| LnmCompleteQueryTask
	| LnmSelectOneTask
	| LnmSelectManyTask;

export enum LnmPlayerState {
	CREATED = 'CREATED',
	PLAYING = 'PLAYING',
	WAITING_WON = 'WAITING_WON',
	WAITING_LOST = 'WAITING_LOST',
	COMPLETED_WON = 'COMPLETED_WON',
	COMPLETED_LOST = 'COMPLETED_LOST',
	SEEN_RESULTS = 'SEEN_RESULTS',
}

export enum LnmResult {
	SINGLE_BAD = 'SINGLE_BAD',
	SINGLE_GOOD = 'SINGLE_GOOD',
	DOUBLE_BAD = 'DOUBLE_BAD',
	DOUBLE_AVERAGE = 'DOUBLE_AVERAGE',
	DOUBLE_GOOD = 'DOUBLE_GOOD',
}

export enum LnmHero {
	STEVE = 'STEVE',
	VICKY = 'VICKY',
	PROFESSOR = 'PROFESSOR',
}
