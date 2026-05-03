import { useEffect } from "preact/hooks";
import { create } from "zustand";

interface ConfigState {
	path: string;
	version: string;
}

export const appConfig = create<ConfigState>()(() => ({ path: "", version: "" }));

export const useConfig = () => {
	useEffect(() => {
		const state = appConfig.getState();
		if (state.path && state.version) return;

		appConfig.setState({
			path: window?.VLibrasWidget?.path ?? "./",
			version: __VLIBRAS_APP_VERSION__,
		});
	}, []);

	return appConfig();
};
