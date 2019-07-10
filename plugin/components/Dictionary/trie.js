var Trie = function(jsonData) {
	try {
		if (typeof jsonData === 'string') {
			this.root = JSON.parse(jsonData).root;
		} else {
			this.root = jsonData.root;
		}

	} catch (error) {
		this.root = { children: {}, end: true };
		console.error('Failed to parse Prefix Tree from JSON\n' + error);
	}
}

Trie.prototype.loadSigns = function(keyWord, insertElement) {

	var search = function(node, word) {
		if (node.end) {
			insertElement(word);
		}

		var childrenKeys = Object.keys(node.children);

		for (var i = 0, len = childrenKeys.length; i < len; ++i) {
			search(node.children[childrenKeys[i]], word + childrenKeys[i]);
		}
	};

	var currentNode = this.root;
	keyWord = keyWord.toUpperCase();

	if (keyWord !== undefined) {
		for (var i = 0, len = keyWord.length; i < len; ++i) {
			try {
				currentNode = currentNode.children[keyWord[i]];
			} catch (error) {
				return;
			}
		}

		if(currentNode === undefined) {
			return;
		}
	}

	search(currentNode, keyWord);
};

module.exports = Trie;