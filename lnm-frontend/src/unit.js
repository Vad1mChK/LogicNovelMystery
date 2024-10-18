function showError(message, elementId) {
	const errorDiv = document.getElementById(elementId);
	errorDiv.textContent = message;
}

document.addEventListener('DOMContentLoaded', function () {
	document
		.getElementById('form')
		.addEventListener('submit', function (event) {
			event.preventDefault();
			const nameInput = document.getElementById('login');
			const nameValue = nameInput.value.trim();

			// This is just a random comment
			if (nameValue === '') {
				showError('You need to input your name');
				return;
			}

			const nameRegex = /^[a-zA-Zа-яА-ЯёЁ]+$/;
			if (!nameRegex.test(nameValue)) {
				showError('Only letters');
				return;
			}

			const passwordInput = document.getElementById('password');
			const passwordValue = passwordInput.value.trim();

			const minLength = 8;
			const hasUpperCase = /[A-Z]/.test(passwordValue);
			const hasLowerCase = /[a-z]/.test(passwordValue);
			const hasNumber = /\d/.test(passwordValue);
			const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

			if (passwordValue.length < minLength) {
				showError(
					`Password must be at least ${minLength} characters long`,
					'errorPassword'
				);
				return;
			} else if (!hasUpperCase) {
				showError(
					'Password must contain at least one uppercase letter',
					'errorPassword'
				);
				return;
			} else if (!hasLowerCase) {
				showError(
					'Password must contain at least one lowercase letter',
					'errorPassword'
				);
				return;
			} else if (!hasNumber) {
				showError(
					'Password must contain at least one number',
					'errorPassword'
				);
				return;
			} else if (!hasSpecialChar) {
				showError(
					'Password must contain at least one special character (!@#$%^&*)',
					'errorPassword'
				);
				return;
			}

			showError('', 'errorName');
			showError('', 'errorPassword');
		});
});

function SignUpForm() {
	window.location.assign(
		'http://localhost:50796/LogicNovelMystery-main/LogicNovelMystery-main/lnm-frontend/src/signUpForm.html'
	);
}

function SignInForm() {
	window.location.assign(
		'http://localhost:50796/LogicNovelMystery-main/LogicNovelMystery-main/lnm-frontend/index.html'
	);
}

module.exports = { showError, SignUpForm, SignInForm };
