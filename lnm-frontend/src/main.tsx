import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LnmPlot } from './frameInterpreter/types.ts';
import VisualNovelEngine from './frameInterpreter/VisualNovelEngine.tsx';
import PlotLoader from './frameInterpreter/PlotLoader.tsx';

const App: React.FC = () => {
	// const navigate = useNavigate();
	// useEffect(() => {
	// 	const form = document.getElementById('form') as HTMLFormElement | null;
	// 	const checkbox = document.getElementById(
	// 		'pass-logging'
	// 	) as HTMLInputElement | null;
	//
	// 	const handleSubmit = (event: Event) => {
	// 		event.preventDefault();
	// 		if (checkbox && checkbox.checked) {
	// 			navigate('/menu'); // Переход на страницу /menu
	// 		}
	// 	};
	//
	// 	if (form) {
	// 		form.addEventListener('submit', handleSubmit);
	// 	}
	//
	// 	return () => {
	// 		if (form) {
	// 			form.removeEventListener('submit', handleSubmit);
	// 		}
	// 	};
	// }, [navigate]);
	//
	// return null;
	const [plot, setPlot] = useState<LnmPlot | null>(null);

	const plotUrl = 'src/assets/plot/single_game_ru_RU.json';
	const startChapterId = 'inception1';

	return (
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
	);
};

// Используем BrowserRouter, чтобы задать контекст для useNavigate
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
