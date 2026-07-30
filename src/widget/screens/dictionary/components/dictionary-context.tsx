import type { ComponentChildren } from "preact";
import { zusContext } from "@/common/lib/zus-context";
import { useDictionary } from "../hooks/use-dictionary";

type DictionaryContextType = ReturnType<typeof useDictionary>;

const { Provider, useCtx: useDictionaryCtx } = zusContext<DictionaryContextType>();

const DictionaryProvider = ({ children }: { children: ComponentChildren }) => {
	const value = useDictionary();
	return <Provider data={value}>{children}</Provider>;
};

export { DictionaryProvider, useDictionaryCtx };
