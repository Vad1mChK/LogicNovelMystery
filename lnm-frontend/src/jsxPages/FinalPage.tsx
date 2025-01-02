import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FinalPage.scss';

const FinalPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="background">
            <div className="overlay">
                <div className="content-container">
                    <h1>Игра завершена</h1>
                    <p>Ваш счёт: </p>
                    <button
                        className="return-button"
                        onClick={() => navigate('/main')}
                    >
                        Вернуться на главную
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinalPage;
