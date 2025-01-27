import React from 'react';
import '../css/WaitingForPartner.scss';

interface WaitingForPartnerProps {
	partnerName: string;
	onExit: () => void;
}

const WaitingForPartner: React.FC<WaitingForPartnerProps> = ({
	partnerName,
	onExit,
}) => {
	return (
		<div className="waiting-for-partner">
			<div className="waiting-for-partner__content">
				<h1 className="waiting-for-partner__title">Мы ждём партнёра</h1>
				<p className="waiting-for-partner__message">
					Ваш партнёр {partnerName} ещё не дошёл до конца.
				</p>
				<button
					className="waiting-for-partner__exit-button"
					onClick={onExit}
				>
					Выйти из игры
				</button>
			</div>
		</div>
	);
};

export default WaitingForPartner;
