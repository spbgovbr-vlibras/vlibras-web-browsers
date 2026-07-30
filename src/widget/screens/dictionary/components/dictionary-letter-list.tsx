import { Fragment } from "preact/jsx-runtime";
import { DictionaryLetterHeader } from "./dictionary-letter-head";
import { DictionaryLetterWords } from "./dictionary-letter-words";

export const DictionaryLetterList = () => {
	return (
		<Fragment>
			<DictionaryLetterHeader />
			<DictionaryLetterWords />
		</Fragment>
	);
};
