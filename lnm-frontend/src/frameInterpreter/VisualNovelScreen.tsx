import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { BASE_URL } from '../metaEnv';
import React, { useEffect, useState } from 'react';
import VisualNovelEngine from './VisualNovelEngine';
import PlotLoader from './PlotLoader';
import { LnmHero, LnmPlot } from './types';

interface VisualNovelScreenProps {
	protagonist: LnmHero;
}

const VisualNovelScreen: React.FC<VisualNovelScreenProps> = ({
	protagonist,
}) => {
	const [plot, setPlot] = useState<LnmPlot | null>(null);
	const storedLanguage = useSelector(
		(state: RootState) => state.languageState.currentLanguage
	);

	const gamemode =
		protagonist == LnmHero.STEVE ? 'single_game' : 'double_game';

	const plotUrl = `${BASE_URL}assets/plot/${gamemode}_${protagonist.toLowerCase()}_${storedLanguage}.json`;
	console.log(plotUrl);
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

export default VisualNovelScreen;
