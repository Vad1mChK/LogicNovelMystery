// PlotLoader.tsx
import React, { useEffect } from 'react';
import { LnmPlot } from './types'; // Import your types

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
			.then((data) => {
				const plot = data as LnmPlot;
				onLoad(plot);
			})
			.catch((error) => console.error('Failed to load plot:', error));
	}, [plotUrl, onLoad]);

	return <div>Loading plot...</div>;
};

export default PlotLoader;
