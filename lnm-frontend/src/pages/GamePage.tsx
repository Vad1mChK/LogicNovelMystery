import React, { useState } from 'react';
import VisualNovelEngine from '../frameInterpreter/VisualNovelEngine.tsx';
import { LnmPlot } from '../frameInterpreter/types.ts';
import PlotLoader from '../frameInterpreter/PlotLoader.tsx';
import '../css/FrameInterpreter.scss';
import { Provider } from 'react-redux';
import store from '../store.ts';

const GamePage: React.FC = () => {
	const [plot, setPlot] = useState<LnmPlot | null>(null);

	// const plotUrl =
	// 	import.meta.env.MODE === 'development'
	// 		? '/assets/plot/single_game_ru_RU_.json' // Path for `npm run dev`
	// 		: './assets/plot/single_game_ru_RU_.json'; // Path for `npm run build`
	// // TODO Replace it with a better solution

	console.log(import.meta.env.BASE_URL);
	const plotUrl = `${import.meta.env.BASE_URL}assets/plot/single_game_ru_RU_.json`;

	const startChapterId = 'inception1';
	return (
		<Provider store={store}>
			<div className="frame-renderer">
				{plot ? (
					<VisualNovelEngine
						plot={plot}
						startChapterId={startChapterId}
					/>
				) : (
					<PlotLoader plotUrl={plotUrl} onLoad={setPlot} />
				)}
			</div>
		</Provider>
	);
};

export default GamePage;