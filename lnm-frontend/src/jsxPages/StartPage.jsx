import React from 'react';
import './StartPage.css';

const StartPage = () => {
	const handleStartClick = () => {
		window.location.href = 'SignInForm.jsx';
	};

	return (
		<div className="buttonStart">
			<img src="../assets/StartPhoto.png" alt="Start Background" />
			<button className="glow-on-hover" onClick={handleStartClick}>
				Start Now
			</button>
		</div>
	);
};

export default StartPage;
