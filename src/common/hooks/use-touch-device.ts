import { useEffect, useState } from "preact/hooks";

export const useTouchDevice = () => {
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	useEffect(() => {
		const checkTouchDevice = () => {
			setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches);
		};

		checkTouchDevice();
		window.addEventListener("resize", checkTouchDevice);

		return () => window.removeEventListener("resize", checkTouchDevice);
	}, []);

	return isTouchDevice;
};
