text = "some text to encode with huffman";
huffman = Huffman.treeFromText(text); // generate the tree
treeEncoded = huffman.encodeTree(); // will return an javascript array with tree representation
// treeJSON = JSON.stringify(treeEncoded); // get a JSON string for easy transportation
console.log(treeEncoded);