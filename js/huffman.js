function Node() {
    this.id = 0;
    this.value = '';
    this.children = [];
    this.weight = 0;
    this.parent = null;
    this.label = "";

    this.setId = function(id) {
        this.id = id;
    }

    this.getId = function() {
        return this.id;
    }

    this.setParentNode = function(node) {
        this.parent = node;
    }

    this.getParentNode = function() {
        return this.parent;
    }

    this.addChild = function(node) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
    }

    this.getChildren = function() {
        return this.children;
    }

    this.getWeight = function() {
        return this.weight;
    }

    this.setWeight = function(weight) {
        this.weight = weight;
    }

    this.getValue = function() {
        return this.value;
    }

    this.setValue = function(value) {
        this.value = value;
    }

    this.getLabel = function() {
        return this.label;
    }

    this.setLabel = function(label) {
        this.label = label;
    }
}

function getCharFrequency (str) {
    var freq = [];
    for (var i=0; i < str.length; i++) {
        var char1=str[i];
        if (freq[char1]) {
            freq[char1]++;
        }
        else {
            freq[char1] = 1;
        }
    }
    return freq;
}

function buildHuffmanTree (str) {
    var frequenciesSorted = getCharFrequency(str);
    var uniqueCharString = str.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
    var parentlessNodes = [];
    var parentlessNode;
    var visNodes = [];
    var visEdges = [];
    var i;

    // here we initalize the nodes with frequencies corresponding to characters
    // found in the provided string
    for (i = 0; i < uniqueCharString.length; i++) {
        var node = new Node();
        node.setValue(uniqueCharString[i]);
        node.setWeight(frequenciesSorted[uniqueCharString[i]]);
        node.setId(i);
        node.setLabel(frequenciesSorted[uniqueCharString[i]] + "\n" + uniqueCharString[i]);
        parentlessNodes.push(node);
        visNodes.push(node);
    }

    var index = i;
    while (parentlessNodes.length > 1) {
        parentlessNode = new Node();
        parentlessNode.setId(index);
        var smallestNodes = findSmallestTwoNodes(parentlessNodes);
        var firstSmallest = smallestNodes.firstMin;
        var secondSmallest = smallestNodes.secondMin;
        visEdges.push({from: index, to: firstSmallest.getId()});
        visEdges.push({from: index, to: secondSmallest.getId()});
        parentlessNode.addChild(firstSmallest);
        parentlessNode.addChild(secondSmallest);
        var weight = firstSmallest.getWeight() + secondSmallest.getWeight();
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
}

function findSmallestTwoNodes (arr) {
    var minOne = new Node();
    var minTwo = new Node();
    minOne.setWeight(1000);
    minTwo.setWeight(1000);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getWeight() < minOne.getWeight()) {
            minTwo = minOne;
            minOne = arr[i];
        }
        else if (arr[i].getWeight() < minTwo.getWeight() && arr[i].getWeight() != minOne.getWeight()) {
                minTwo = arr[i];
        }
    }
    return {firstMin : minOne, secondMin : minTwo};
  }