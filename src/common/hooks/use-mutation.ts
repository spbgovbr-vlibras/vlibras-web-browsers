import { useState } from "preact/hooks";

export type UseMutationOptions<TData, TVariables> = {
	mutationFn: (variables: TVariables) => Promise<TData>;
	onMutate?: (variables: NoInfer<TVariables>) => void;
	onSettled?: (data: NoInfer<TData> | undefined, error: Error | null, variables: NoInfer<TVariables>) => void;
};

export type UseMutationResult<TData, TVariables> = {
	mutateAsync: (variables: TVariables) => Promise<TData>;
	isPending: boolean;
	error: Error | null;
};

export const useMutation = <TData, TVariables = void>({
	mutationFn,
	onMutate,
	onSettled,
}: UseMutationOptions<TData, TVariables>): UseMutationResult<TData, TVariables> => {
	const [isPending, setPending] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const mutateAsync = async (variables: TVariables) => {
		setPending(true);
		setError(null);
		onMutate?.(variables);

		let data: TData | undefined;
		let caughtError: Error | null = null;

		try {
			data = await mutationFn(variables);
			return data;
		} catch (err) {
			caughtError = err instanceof Error ? err : new Error(String(err));
			setError(caughtError);
			throw caughtError;
		} finally {
			setPending(false);
			onSettled?.(data, caughtError, variables);
		}
	};

	return { mutateAsync, isPending, error };
};
