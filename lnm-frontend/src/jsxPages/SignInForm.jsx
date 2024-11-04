import React from 'react';
import './SignInForm.css';

const SignInForm = () => {
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Form submitted');
	};

	return (
		<>
			<header>
				<div className="header__inner">
					<img
						src="../assets/img/logo.png"
						width="90"
						height="70"
						alt="Лого"
					/>
					<p className="logo">Logic Novel Mystery</p>
				</div>
			</header>

			<div className="image-container">
				<img
					className="background-image"
					src="../assets/StartPhoto.png"
					alt="Background Image"
				/>
			</div>

			<div className="login-wrap">
				<div className="login-html">
					<label className="tab">Sign In</label>
					<div className="hr"></div>
					<div className="login-form">
						<div className="sign-in-htm">
							<form onSubmit={handleSubmit}>
								<div className="group">
									<label htmlFor="user" className="label">
										Login
									</label>
									<input
										id="user"
										type="text"
										className="input"
										placeholder="Enter your login"
										required
									/>
								</div>

								<div className="group">
									<label htmlFor="pass" className="label">
										Password
									</label>
									<input
										id="pass"
										type="password"
										className="input"
										data-type="password"
										placeholder="Enter your password"
										required
									/>
								</div>

								<div className="group">
									<input
										type="submit"
										className="button"
										value="Sign In"
									/>
								</div>
							</form>

							<div className="hr"></div>
							<div className="foot-lnk">
								<p>
									No account? Click{' '}
									<a
										href="src/signUpForm.html"
										onClick={() => {}}
									>
										sign up
									</a>
									.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignInForm;
