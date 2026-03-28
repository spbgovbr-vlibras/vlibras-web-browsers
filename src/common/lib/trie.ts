export type TrieNode = {
	children: Record<string, TrieNode>;
	end: boolean;
};

export type TrieRoot = {
	root: TrieNode;
};

export class Trie {
	private root: TrieNode;

	constructor(jsonData: string | TrieRoot) {
		try {
			if (typeof jsonData === "string") this.root = JSON.parse(jsonData).root;
			else this.root = jsonData.root;
		} catch (error) {
			this.root = { children: {}, end: false };
			console.error("Falha ao processar a Prefix Tree:", error);
		}
	}

	/**
	 * Encontra todas as palavras que começam com o prefixo fornecido.
	 * @param prefix O termo de busca (ex: "CAS")
	 * @param onMatch Callback chamado para cada palavra encontrada (ex: "CASA", "CASADO")
	 */
	public loadSigns(prefix: string, onMatch: (word: string) => void): void {
		const keyWord = prefix.toUpperCase();
		let currentNode: TrieNode | undefined = this.root;

		for (const char of keyWord) {
			currentNode = currentNode.children?.[char];
			if (!currentNode) return;
		}

		const recursiveSearch = (node: TrieNode, currentWord: string) => {
			if (node.end) onMatch(currentWord);

			for (const char in node.children) {
				recursiveSearch(node.children[char], currentWord + char);
			}
		};

		recursiveSearch(currentNode, keyWord);
	}
}
