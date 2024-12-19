// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './css/index.css';
import '../i18n.js';
import { AudioProvider } from './pages/AudioContext';
import { Provider } from 'react-redux';
import store from './state/store';

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
	<AudioProvider>
		<Provider store={store}>
			<BrowserRouter basename="/LogicNovelMystery">
				<App />
			</BrowserRouter>
		</Provider>
	</AudioProvider>
);
