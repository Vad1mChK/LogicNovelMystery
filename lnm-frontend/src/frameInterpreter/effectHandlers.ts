import {
	LnmFrameEffect,
	LnmFrameEffectType,
	LnmEffectArgsMap,
	LnmPlot,
	LnmFrameCharacterData,
	LnmTask,
} from './types';

export type EffectHandler = (
	effect: LnmFrameEffect,
	context: {
		setCurrentFrameId: (id: string) => void;
		setCurrentChapterId: (id: string) => void;
		setCurrentEndingId: (id: string) => void;
		setIsEnding: (isEnding: boolean) => void;
		setCurrentCharacters: React.Dispatch<
			React.SetStateAction<LnmFrameCharacterData[] | null>
		>;
		addKnowledge: (knowledgeId: string) => void;
		decreaseHealth: (amount: number | 'kill') => void;
		increaseHealth: (amount: number | 'full') => void;
		openTaskWindow: (task: LnmTask) => void;
		plot: LnmPlot;
	}
) => void;

// Effect Handlers Map
export const effectHandlers: Partial<
	Record<LnmFrameEffectType, EffectHandler>
> = {
	[LnmFrameEffectType.JUMP]: (effect, { setCurrentFrameId }) => {
		const args = effect.args as LnmEffectArgsMap[LnmFrameEffectType.JUMP];
		console.log('Processing JUMP effect:', args);
		setCurrentFrameId(args.frameId);
	},

	[LnmFrameEffectType.JUMP_CHAPTER]: (
		effect,
		{ setCurrentChapterId, setCurrentFrameId, plot }
	) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.JUMP_CHAPTER];
		console.log('Processing JUMP_CHAPTER effect:', args);
		const nextChapter = plot.chapters.get(args.chapterId);
		if (nextChapter) {
			setCurrentChapterId(args.chapterId);
			setCurrentFrameId(nextChapter.startFrame);
		}
	},

	[LnmFrameEffectType.ENDING]: (
		effect,
		{ setCurrentEndingId, setCurrentFrameId, setIsEnding, plot }
	) => {
		const args = effect.args as LnmEffectArgsMap[LnmFrameEffectType.ENDING];
		const ending = plot.frames.endings.get(args.endingId);
		if (ending) {
			setCurrentEndingId(args.endingId);
			setCurrentFrameId(ending.startFrame);
			setIsEnding(true);
		}
	},

	[LnmFrameEffectType.FADE_IN_CHARACTER]: (
		effect,
		{ setCurrentCharacters }
	) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.FADE_IN_CHARACTER];
		setCurrentCharacters((prev) => {
			const updated = prev ? [...prev] : [];
			const characterIndex = updated.findIndex(
				(c) => c.id === args.characterId
			);
			if (characterIndex === -1) {
				updated.push({
					id: args.characterId,
					hidden: false, // Ensure the character is visible
				});
			} else {
				updated[characterIndex] = {
					...updated[characterIndex],
					hidden: false,
				};
			}
			return updated;
		});
	},

	[LnmFrameEffectType.CHANGE_POSE]: (effect, { setCurrentCharacters }) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.CHANGE_POSE];
		setCurrentCharacters((prev) => {
			if (!prev) return prev;
			return prev.map((c) =>
				c.id === args.characterId ? { ...c, pose: args.newPose } : c
			);
		});
	},

	[LnmFrameEffectType.FADE_OUT_CHARACTER]: (
		effect,
		{ setCurrentCharacters }
	) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.FADE_OUT_CHARACTER];
		setCurrentCharacters((prev) => {
			if (!prev) return prev;
			return prev.map((c) =>
				c.id === args.characterId ? { ...c, hidden: true } : c
			);
		});
	},

	[LnmFrameEffectType.OPEN_KNOWLEDGE]: (effect, { addKnowledge }) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.OPEN_KNOWLEDGE];
		console.log('Processing OPEN_KNOWLEDGE effect:', args);
		if (args.knowledgeId) {
			addKnowledge(args.knowledgeId);
		}
	},

	[LnmFrameEffectType.DECREASE_HEALTH]: (effect, { decreaseHealth }) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.DECREASE_HEALTH];
		console.log('Processing DECREASE_HEALTH effect:', args);
		if (args.amount) {
			decreaseHealth(args.amount);
		}
	},

	[LnmFrameEffectType.INCREASE_HEALTH]: (effect, { increaseHealth }) => {
		const args =
			effect.args as LnmEffectArgsMap[LnmFrameEffectType.INCREASE_HEALTH];
		console.log('Processing INCREASE_HEALTH effect:', args);
		if (args.amount) {
			increaseHealth(args.amount);
		}
	},

	[LnmFrameEffectType.START_TASK]: (effect, { openTaskWindow, plot }) => {
		const args = effect.args as { taskId: string };
		const task = plot.tasks.get(args.taskId); // Assume tasks are stored in the plot object
		if (task) {
			openTaskWindow(task);
		} else {
			console.warn(`Task with ID ${args.taskId} not found.`);
		}
	},
	// TODO: Add handlers for other effect types as needed
};
