export const isValidTranslationText = (text: string): boolean => {
	if (!text.trim()) return false;

	const hasLetterOrNumber = /[\p{L}\p{N}]/u;
	return hasLetterOrNumber.test(text);
};
