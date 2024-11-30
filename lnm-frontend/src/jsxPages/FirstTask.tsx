import React, { useState } from 'react';

const FactChecker: React.FC = () => {
	const [answers, setAnswers] = useState({
		fact1: false,
		fact2: false,
		fact3: false,
		fact4: false,
	});
	const [result, setResult] = useState<string>('');
	const handleCheckboxChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, checked } = event.target;
		setAnswers((prevAnswers) => ({
			...prevAnswers,
			[name]: checked,
		}));
	};

	const checkAnswers = () => {
		const correctAnswers = {
			fact1: true,
			fact3: true,
		};

		let correctCount = 0;
		for (const [key, value] of Object.entries(correctAnswers)) {
			if (answers[key as keyof typeof answers] === value) {
				correctCount++;
			}
		}

		if (correctCount === Object.keys(correctAnswers).length) {
			setResult('Все ответы верны!');
		} else {
			setResult('Некоторые ответы неверны. Попробуйте снова.');
		}
	};

	return (
		<div className="container">
			<div className="center-container">
				<h1>Identify the facts from the list</h1>
				<form id="facts-form">
					<div className="statement">
						<input
							type="checkbox"
							id="fact1"
							name="fact1"
							checked={answers.fact1}
							onChange={handleCheckboxChange}
						/>
						<label htmlFor="fact1">virus(Mitnik, code)</label>
					</div>
					<div className="statement">
						<input
							type="checkbox"
							id="fact2"
							name="fact2"
							checked={answers.fact2}
							onChange={handleCheckboxChange}
						/>
						<label htmlFor="fact2">
							capture(X, Y) :- virus(X, Y)
						</label>
					</div>
					<div className="statement">
						<input
							type="checkbox"
							id="fact3"
							name="fact3"
							checked={answers.fact3}
							onChange={handleCheckboxChange}
						/>
						<label htmlFor="fact3">virus(code, world)</label>
					</div>
					<div className="statement">
						<input
							type="checkbox"
							id="fact4"
							name="fact4"
							checked={answers.fact4}
							onChange={handleCheckboxChange}
						/>
						<label htmlFor="fact4">
							capture(X, Y) :- virus(X, Z), virus(Z, Y)
						</label>
					</div>
					<div className="btn-container">
						<button
							type="button"
							className="btn"
							onClick={checkAnswers}
						>
							Check
						</button>
					</div>
				</form>
				<p
					id="result"
					style={{ marginTop: '20px', fontWeight: 'bold' }}
				>
					{result}
				</p>
			</div>
		</div>
	);
};

export default FactChecker;
