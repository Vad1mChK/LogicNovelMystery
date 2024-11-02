import React, { useState } from 'react';
import './Location3_steve.css';

const Location3_steve = () => {
	const [clickCount, setClickCount] = useState(0);

	const toggleText = () => {
		setClickCount((prevClickCount) => prevClickCount + 1);
	};

	let textContent = '';
	let overlayTextContent = '';
	let imageContent = null;

	switch (clickCount) {
		case 1:
			textContent = (
				<p>
					Стой! Кто идёт?! Остановись, живое существо! В этих местах
					ты бродишь напрасно! Здесь таким существам ходить запрещено!
				</p>
			);
			overlayTextContent = 'Робот';
			imageContent = <img src="../assets/guard_angry.png" alt="Робот" />;
			break;
		case 2:
			textContent = (
				<p>
					Оружие! У него оружие! Я вызываю полицию, здесь бандиты,
					помогите!
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		case 3:
			textContent = (
				<p>
					Я и есть полиция! Агент ФБР Стив Хэриссон. Вот мой значок...
				</p>
			);
			overlayTextContent = 'Стив';
			break;
		case 4:
			textContent = (
				<p>
					Ох, здравствуйте, агент Стив Хэриссон. Вы бы оружие то
					убрали. Я ведь просто решил, что морадеры пришли, думал
					опять будут пытаться взломать дверь.
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		case 5:
			textContent = (
				<p>
					Ведь никто не может ввести правильный код. А я всего лишь
					робот третьего поколения модель R3.
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		case 6:
			textContent = (
				<p>
					Я должен не пускать сюда никого живого, ведь никто не знает
					о смертельных ловушках. Зачем вы здесь, агент Хэриссон?
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		default:
			textContent = <p>Ну чтож, будем разбираться!</p>;
			overlayTextContent = 'Стив';
			setClickCount(0);
			break;
	}

	return (
		<div className="background-container">
			<div className="content">
				<div className="overlay-text">{overlayTextContent}</div>
				<div className="text-block">{textContent}</div>
				<button className="toggle-button" onClick={toggleText}></button>
			</div>
			<div className="top-image"></div>
			<div className="image-guard">{imageContent}</div>
		</div>
	);
};

export default Location3_steve;
