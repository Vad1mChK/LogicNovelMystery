import React, { useState } from 'react';
import { GameStateProvider } from '../frameInterpreter/GameStateContext.tsx';
import VisualNovelEngine from '../frameInterpreter/VisualNovelEngine.tsx';
import { LnmPlot } from '../frameInterpreter/types.ts';
import PlotLoader from '../frameInterpreter/PlotLoader.tsx';

const GamePage: React.FC = () => {
	const [plot, setPlot] = useState<LnmPlot | null>(null);

	const plotUrl = '../assets/plot/single_game_ru_RU.json';
	const startChapterId = 'inception1';
	return (
		<GameStateProvider>
			<div className="app">
				{plot ? (
					<VisualNovelEngine
						plot={plot}
						startChapterId={startChapterId}
					/>
				) : (
					<PlotLoader plotUrl={plotUrl} onLoad={setPlot} />
				)}
			</div>
		</GameStateProvider>
	);
};

export default GamePage;
