import { Spinner } from "@/widget/components/ui/spinner";

export const DictionaryLoading = () => {
	return (
		<div className="grid h-full place-content-center">
			<Spinner />
		</div>
	);
};
