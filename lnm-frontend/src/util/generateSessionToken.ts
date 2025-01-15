// Generate a random session token
export const generateSessionToken = () => {
	const array = new Uint8Array(24); // 24 байта -> ~32 символа в Base64
	window.crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, ''); // Убираем '=' в конце
};
