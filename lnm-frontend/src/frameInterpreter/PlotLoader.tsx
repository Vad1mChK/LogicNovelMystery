// PlotLoader.tsx
import axios from 'axios';
import React, { useEffect } from 'react';
import { LnmPlot } from './types';
import { useNavigate } from 'react-router-dom';
import { convertAndCreatePlot } from './plotLoaderUtils';

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

export default PlotLoader;
