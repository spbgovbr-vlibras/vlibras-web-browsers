import { useEffect, useState } from "preact/hooks";

export const useConfig = () => {
 	const [version, setVersion] = useState("");
	const [path, setPath] = useState("");

	useEffect(() => {
		if (!version) setVersion(__APP_VERSION__);
		if (!path) setPath(window?.VLibrasWidget?.path ?? "./");
	}, [version, path]);

	return { version, path };
};
