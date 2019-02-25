function Node(end)
{
  this.end = end === undefined ? false : end;
  this.children = [];
}

function StackItem(trieNode, dataNode, index)
{
  this.trieNode = trieNode;
  this.dataNode = dataNode;
  this.index = index === undefined ? 0 : index;
}

function Trie(characters, data)
{
  this.root = new Node();

  if (characters !== undefined)
  {
    this._setCharacters(characters);

    if (data !== undefined)
      for (var i in data)
        this.add(data[i]);
  }
}

Trie.prototype._setCharacters = function(characters)
{
  this.characters = characters;
  this.charactersKeys = [];

  for (var i in this.characters)
    this.charactersKeys[this.characters[i]] = i;
}

Trie.prototype.getKey = function(word, i) {
  return this.charactersKeys[word[i]];
}

Trie.prototype.add = function(word)
{
  var node = this.root;

  for (var i in word)
  {
    if (node.children[this.getKey(word, i)] === undefined)
      node.children[this.getKey(word, i)] = new Node(i == word.length - 1);

    node = node.children[this.getKey(word, i)];
  }

  node.end = true;
}

Trie.prototype.contains = function(word)
{
  var node = this.root;

  for (var i in word)
  {
    if (node.children[this.getKey(word, i)] === undefined)
      return false;

    node = node.children[this.getKey(word, i)];
  }

  return node.end;
};

Trie.prototype.feed = function(key, insert)
{
  var node = this.root;

  if (key !== undefined) {
    for (var i in key)
    {
      if (node.children[this.getKey(key, i)] === undefined)
        return;

      node = node.children[this.getKey(key, i)];
    }
  }

  this._feed(node, key, insert);
}

Trie.prototype._feed = function(node, word, insert)
{
  if (node.end === true) insert(word);

  for (var i in node.children)
    this._feed(node.children[i], word + this.characters[i], insert);
}

Trie.prototype.fromJSON = function(json)
{
  this.characters = json.characters;
  this.charactersKeys = json.keys;

  this._fromJSON(this.root, json.trie);

  return this;
}

Trie.prototype._fromJSON = function(trieNode, dataNode)
{
  trieNode.end = dataNode.end;

  for (var i in dataNode.keys)
  {
    var key = dataNode.keys[i];

    trieNode.children[key] = new Node();
    this._fromJSON(trieNode.children[key], dataNode.children[key])
  }
}

module.exports = Trie;