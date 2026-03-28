import { QueryClient } from "@tanstack/preact-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			retryOnMount: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			staleTime: 1000 * 60 * 5,
		},
	},
});
