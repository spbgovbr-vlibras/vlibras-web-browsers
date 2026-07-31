import { Spinner } from "@/widget/components/ui/spinner";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "@/widget/screens/components";

export const AboutScreenFallback = () => {
	return (
		<Screen>
			<ScreenHeader close>
				<ScreenTitle>Sobre</ScreenTitle>
			</ScreenHeader>
			<ScreenContent className="items-center justify-center">
				<Spinner />
			</ScreenContent>
		</Screen>
	);
};
