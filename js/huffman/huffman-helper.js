const huffman = {};

huffman.Node = function() {
  this.id = 0;
  this.value = "";
  this.children = [];
  this.weight = 0;
  this.parent = null;
  this.label = "";
  this.shape = "ellipse";
  this.hidden = true;
  this.color = "#009688";
  this.font = { color: "#ffffff" };
  this.edges = [];

  this.getEdges = function() {
    return this.edges;
  };

  this.addEdge = function(edge) {
    this.edges.push(edge);
  };

  this.setShape = function(shape) {
    this.shape = shape;
  };

  this.setId = function(id) {
    this.id = id;
  };

  this.getId = function() {
    return this.id;
  };

  this.setParentNode = function(node) {
    this.parent = node;
  };

  this.getParentNode = function() {
    return this.parent;
  };

  this.addChild = function(node) {
    node.setParentNode(this);
    this.children[this.children.length] = node;
  };

  this.getWeight = function() {
    return this.weight;
  };

  this.setWeight = function(weight) {
    this.weight = weight;
  };

  this.getValue = function() {
    return this.value;
  };

  this.setValue = function(value) {
    this.value = value;
  };

  this.getLabel = function() {
    return this.label;
  };

  this.setLabel = function(label) {
    this.label = label;
  };
};

huffman.getCharFrequency = function(str) {
  let freq = [];
  for (let i = 0; i < str.length; i++) {
    let char1 = str[i];
    if (freq[char1]) {
      freq[char1]++;
    } else {
      freq[char1] = 1;
    }
  }
  return freq;
};

huffman.buildHuffmanTree = function(str) {
  let frequenciesSorted = huffman.getCharFrequency(str);
  let uniqueCharString = str
    .split("")
    .filter(function(item, i, ar) {
      return ar.indexOf(item) === i;
    })
    .join("");
  let parentlessNodes = [];
  let parentlessNode;
  let visNodes = [];
  let visEdges = [];
  let i;

  for (i = 0; i < uniqueCharString.length; i++) {
    let node = new Node();
    node.setValue(uniqueCharString[i]);
    node.setWeight(frequenciesSorted[uniqueCharString[i]]);
    node.setId(i);
    node.setLabel(
      frequenciesSorted[uniqueCharString[i]] + " : " + uniqueCharString[i]
    );
    parentlessNodes.push(node);
    node.setShape("box");
    visNodes.push(node);
  }

  let index = i;
  while (parentlessNodes.length > 1) {
    parentlessNode = new Node();
    parentlessNode.setId(index);
    let smallestNodes = findSmallestTwoNodes(parentlessNodes);
    let firstSmallest = smallestNodes.firstMin;
    let secondSmallest = smallestNodes.secondMin;
    let firstEdge = {
      from: index,
      to: firstSmallest.getId(),
      hidden: true
    };
    let secondEdge = {
      from: index,
      to: secondSmallest.getId(),
      hidden: true
    };
    visEdges.push(firstEdge);
    visEdges.push(secondEdge);
    parentlessNode.addEdge(firstEdge);
    parentlessNode.addEdge(secondEdge);
    parentlessNode.addChild(firstSmallest);
    parentlessNode.addChild(secondSmallest);
    let weight = firstSmallest.getWeight() + secondSmallest.getWeight();
    parentlessNode.setLabel(weight);
    parentlessNode.setWeight(weight);
    parentlessNodes.push(parentlessNode);
    visNodes.push(parentlessNode);
    parentlessNodes.splice(parentlessNodes.indexOf(firstSmallest), 1);
    parentlessNodes.splice(parentlessNodes.indexOf(secondSmallest), 1);
    index++;
  }
  return {
    nodes: visNodes,
    edges: visEdges
  };
};

huffman.findSmallestTwoNodes = function(arr) {
  let minOne;
  let minTwo;

  minOne = arr[0];
  minTwo = arr[1];

  if (minTwo.getWeight() < minOne.getWeight()) {
    minOne = arr[1];
    minTwo = arr[0];
  }

  for (let i = 2; i < arr.length; i++) {
    if (arr[i].getWeight() < minOne.getWeight()) {
      minTwo = minOne;
      minOne = arr[i];
    } else if (arr[i].getWeight() < minTwo.getWeight()) {
      minTwo = arr[i];
    }
  }
  return {
    firstMin: minOne,
    secondMin: minTwo
  };
};

module.exports = huffman;
