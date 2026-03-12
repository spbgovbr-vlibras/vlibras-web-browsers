import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

type Store<T> = { data: T };
type ExternalStore<T> = StoreApi<{ data?: T }>;
type ProviderProps<T> = { children: React.ReactNode; data: T };
type ContextOutput<T> = {
	Context: React.Context<StoreApi<Store<T>> | null>;
	Provider: (props: ProviderProps<T>) => React.ReactNode;
	useCtx: () => T;
};

export function zusContext<T>(externalStore?: ExternalStore<T>): ContextOutput<T> {
	const Context = createContext<StoreApi<Store<T>> | null>(null);

	const Provider = ({ children, data }: ProviderProps<T>) => {
		const storeRef = useRef<StoreApi<Store<T>> | null>(null);
		if (!storeRef.current) storeRef.current = createStore(() => ({ data }));

		useEffect(() => {
			storeRef?.current?.setState({ data });
			externalStore?.setState({ data });
		}, [data]);

		return <Context.Provider value={storeRef.current}>{children}</Context.Provider>;
	};

	const useContextStore = (selector: (state: Store<T>) => T): T => {
		const ctx = useContext(Context);
		if (!ctx) throw new Error("useContext must be used within its Provider");
		return useStore(ctx, selector);
	};

	const useCtx = () => useContextStore((state) => state.data);

	return { Context, Provider, useCtx };
}
