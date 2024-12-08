import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import './css/index.css';
import '../i18n.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		{/* <App /> */}
		<BrowserRouter basename="/LogicNovelMystery">
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
