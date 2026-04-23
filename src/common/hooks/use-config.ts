import { useEffect, useState } from "preact/hooks";

export const useConfig = () => {
	const [config, setConfig] = useState({ path: "", version: "" });

	useEffect(() => {
		setConfig({
			path: window?.VLibrasWidget?.path ?? "./",
			version: __APP_VERSION__,
		});
	}, []);

	return config;
};
