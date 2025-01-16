// src/components/SecretPage.tsx

import React from 'react';
import '../css/FrameInterpreter.scss';
import ResultsWaitScreen from '../frameInterpreter/ResultsWaitScreen';

const SecretPage: React.FC = () => {
	return <ResultsWaitScreen winner={false} multiplayer={true} />;
};

export default SecretPage;
