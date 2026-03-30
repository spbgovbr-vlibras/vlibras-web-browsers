import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";
import { DictionaryProvider } from "./components/dictionary-context";
import { DictionaryList } from "./components/dictionary-list";

export const DictionaryScreen = () => {
	return (
		<DictionaryProvider>
			<Screen>
				<ScreenHeader close>
					<ScreenTitle>Dicionário</ScreenTitle>
				</ScreenHeader>

				<ScreenContent className="overflow-hidden p-0">
					<DictionaryList />
				</ScreenContent>
			</Screen>
		</DictionaryProvider>
	);
};
