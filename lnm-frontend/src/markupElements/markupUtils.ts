export const copyTextToClipboard = (textToCopy: string) => {
	navigator.clipboard
		.writeText(textToCopy)
		.then(() => {
			console.log(`Copied text to clipboard: ${textToCopy}`);
		})
		.catch((e) => {
			console.log(`Failed to copy text to clipboard due to error: ${e}`);
		});
};
