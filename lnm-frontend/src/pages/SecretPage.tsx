// src/components/SecretPage.tsx

import React from "react";
import "../css/FrameInterpreter.scss";
import CreatedWaitScreen from "../frameInterpreter/CreatedWaitScreen.tsx";
import { LnmHero } from "../frameInterpreter/types.ts";

const SecretPage: React.FC = () => {
	return <CreatedWaitScreen protagonist={LnmHero.VICKY}/>;
};

export default SecretPage;
