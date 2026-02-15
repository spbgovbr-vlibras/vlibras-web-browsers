import { Fragment } from "preact/jsx-runtime";

import global from "../styles/global.css?inline";

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<Fragment>
			<style>{global}</style>
			{children}
		</Fragment>
	);
};
