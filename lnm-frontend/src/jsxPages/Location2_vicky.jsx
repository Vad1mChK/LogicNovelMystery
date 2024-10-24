import React, { useState } from 'react';
import './Location3_vicky.css';

const Location3_vicky = () => {
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
                <p>Уааа, ааааа...Зачем вы сразу драться, мисс?! Я всего лишь робот модель R3, я робот-помощник человека. А вы меня сразу бьете!</p>
            );
            overlayTextContent = 'Робот';
            imageContent = <img src="../assets/guard_angry.png" alt="Робот" />;
            break;
        case 2:
            textContent = (
                <p>С ума сойти!Офонареть можно!Этот робот такой эмоциональный! Ты прости, я не хотела. Зачем ты сам меня схватил за ногу?</p>
            );
            overlayTextContent = 'Вики';
            break;
        case 3:
            textContent = (
                <p>Я лишь хотел уберечь вас мисс. В этих местах ходить запрещено!</p>
            );
            overlayTextContent = 'Робот';
            break;
        default:
            textContent = <p>Аааааа. Отпусти меня, грязный извращенец!</p>;
            overlayTextContent = 'Вики';
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

export default Location3_vicky;

