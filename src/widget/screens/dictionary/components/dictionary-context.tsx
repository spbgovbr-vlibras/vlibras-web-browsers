import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { useDictionary } from "../hooks/use-dictionary";

type DictionaryContextType = ReturnType<typeof useDictionary>;

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export const DictionaryProvider = ({ children }: { children: preact.ComponentChildren }) => {
	const value = useDictionary();
	return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
};

export const useDictionaryContext = () => {
	const context = useContext(DictionaryContext);
	if (!context) {
		throw new Error("useDictionaryContext must be used within a DictionaryProvider");
	}
	return context;
};
