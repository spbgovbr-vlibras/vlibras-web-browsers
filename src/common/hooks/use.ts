import { type Inputs, useEffect, useState } from "preact/hooks";

export const use = <TResult>(fn: () => Promise<TResult>, deps: Inputs[] = []) => {
	const [data, setData] = useState<TResult | null>(null);
	const [error, setError] = useState<unknown>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		setError(null);
		setData(null);

		fn()
			.then((result) => {
				if (isMounted) {
					setData(result);
					setLoading(false);
				}
			})
			.catch((err) => {
				if (isMounted) {
					setError(err);
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [fn, ...deps]);

	return { data, error, isLoading: loading };
};
