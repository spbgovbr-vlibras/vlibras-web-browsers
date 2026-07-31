"use client";

import { createContext } from "preact";
import { useContext, useLayoutEffect, useRef } from "preact/hooks";
import { createStore, type StoreApi, useStore } from "zustand";

type Store<T> = { data: T };
type ProviderProps<T> = { children: React.ReactNode; data: T };
type ContextOutput<T> = {
	Context: React.Context<StoreApi<Store<T>> | null>;
	Provider: (props: ProviderProps<T>) => React.ReactNode;
	useCtx: {
		(): T;
		<U>(selector: (state: T) => U): U;
	};
};

export function zusContext<T>(): ContextOutput<T> {
	const Context = createContext<StoreApi<Store<T>> | null>(null);

	const Provider = ({ children, data }: ProviderProps<T>) => {
		const storeRef = useRef<StoreApi<Store<T>> | null>(null);
		if (!storeRef.current) storeRef.current = createStore(() => ({ data }));

		useLayoutEffect(() => storeRef.current?.setState({ data }), [data]);

		return <Context.Provider value={storeRef.current}>{children}</Context.Provider>;
	};

	function useContextStore<U>(selector: (state: Store<T>) => U): U {
		const ctx = useContext(Context);
		if (!ctx) throw new Error("useContext must be used within its Provider");
		return useStore(ctx, selector);
	}

	function useCtx(): T;
	function useCtx<U>(selector: (state: T) => U): U;
	function useCtx<U>(selector?: (state: T) => U): T | U {
		return useContextStore((state) => {
			if (!selector) return state.data;
			return selector(state.data);
		});
	}

	return { Context, Provider, useCtx };
}
