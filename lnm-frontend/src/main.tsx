import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './css/index.css';
import '../i18n.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// Strict:
	<React.StrictMode>
		<BrowserRouter basename="/LogicNovelMystery">
			<App />
		</BrowserRouter>
	</React.StrictMode>
	// Non-strict: Uncomment if you don't need the thing
	// <BrowserRouter basename="/LogicNovelMystery">
	// 	<App />
	// </BrowserRouter>
);
