import { Spinner } from "@/widget/components/ui/spinner";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "@/widget/screens/components";

export const DictionaryScreenFallback = () => {
	return (
		<Screen>
			<ScreenHeader close>
				<ScreenTitle>Dicionário</ScreenTitle>
			</ScreenHeader>
			<ScreenContent className="items-center justify-center">
				<Spinner />
			</ScreenContent>
		</Screen>
	);
};
