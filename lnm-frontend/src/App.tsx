import './css/App.css';
import MainPage from './pages/MainPage';
import SelectedMode from './pages/SelectedMode';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/main" element={<MainPage />} />
				<Route path="/select" element={<SelectedMode />} />
			</Routes>
		</Router>
	);
};

export default App;
