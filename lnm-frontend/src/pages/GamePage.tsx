import React, { useEffect, useState } from 'react';
import VisualNovelEngine from '../frameInterpreter/VisualNovelEngine.tsx';
import { LnmPlot } from '../frameInterpreter/types';
import PlotLoader from '../frameInterpreter/PlotLoader.tsx';
import '../css/FrameInterpreter.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store.ts';

const GamePage: React.FC = () => {
	const [plot, setPlot] = useState<LnmPlot | null>(null);

	// const plotUrl =
	// 	import.meta.env.MODE === 'development'
	// 		? '/assets/plot/single_game_ru.json' // Path for `npm run dev`
	// 		: './assets/plot/single_game_ru.json'; // Path for `npm run build`
	// // TODO Replace it with a better solution
	const storedLanguage = useSelector(
		(state: RootState) => state.languageState.currentLanguage
	);

	console.log(import.meta.env.BASE_URL);
	const plotUrl = `${import.meta.env.BASE_URL}assets/plot/single_game_${storedLanguage}.json`;
	const storedCurrentChapter = useSelector(
		(state: RootState) => state.gameState.currentChapterId
	);

	const [startChapter, setStartChapter] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		if (plot) {
			setStartChapter(
				plot.chapters.has(storedCurrentChapter)
					? storedCurrentChapter
					: plot.startChapter
			);
		}
	}, [plot]);

	return (
		<div className="frame-renderer">
			{plot ? (
				<VisualNovelEngine plot={plot} startChapterId={startChapter} />
			) : (
				<PlotLoader plotUrl={plotUrl} onLoad={setPlot} />
			)}
		</div>
	);
};

export default GamePage;
