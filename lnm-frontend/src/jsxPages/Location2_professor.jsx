import React, { useState } from 'react';
import './Location2_professor.css';

const Location2_professor = () => {
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
					Здравствуйте! Меня зовут профессор Роберт Лэнгдон! А как
					ваше имя?
				</p>
			);
			overlayTextContent = 'Лэнгдон';
			break;
		case 3:
			textContent = (
				<p>
					Ах, вы тот самый профессор, который является лучшим
					специалистом по информационной безопасности.
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		case 4:
			textContent = (
				<p>
					Я сначала решил, что опять морадеры пришли, думал опять
					будут пытаться взломать дверь. Ведь никто не может ввести
					правильный код.
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		case 5:
			textContent = (
				<p>
					А я робот третьего поколения модель R3, я должен не пускать
					сюда никого живого, ведь никто не знает о смертельных
					ловушках. Зачем вы пришли сюда, профессор Лэнгдон?
				</p>
			);
			overlayTextContent = 'Робот';
			break;
		default:
			textContent = <p>Что же здесь зашифровано?</p>;
			overlayTextContent = 'Лэнгдон';
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

export default Location2_professor;
