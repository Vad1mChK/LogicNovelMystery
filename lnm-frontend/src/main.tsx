// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './css/index.css';
import '../i18n.js';
import { Provider } from 'react-redux';
import store from './state/store';
import MusicController from './music/MusicController';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// Strict:
	// <React.StrictMode>
	// <AudioProvider>
	// 	<BrowserRouter basename="/LogicNovelMystery">
	// 		<App />
	// 	</BrowserRouter>
	// </AudioProvider>
	// </React.StrictMode>
	// Non-strict: Uncomment if you don't need the thing
	// <AudioProvider>
	<Provider store={store}>
		<MusicController />
		<BrowserRouter basename="/LogicNovelMystery">
			<App />
		</BrowserRouter>
	</Provider>
	// </AudioProvider>
);
