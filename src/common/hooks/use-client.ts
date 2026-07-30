import { useEffect, useState } from "preact/hooks";

export const useClient = () => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => setIsClient(true), []);
	return isClient;
};
