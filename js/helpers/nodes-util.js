function markAllNodesAsUnvisited(path) {
    for (var i = 0; i < path.length; i++) {
        path[i].visited = false;
    }
    return path;
}

function findRootNode(path) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].root) {
            return path[i];
        }
    }
}

function Node() {
    this.id = 0;
    this.value = '';
    this.children = [];
    this.weight = 0;
    this.parent = null;
    this.label = "";
    this.shape = "ellipse";
    this.hidden = true;
    this.color = "#009688";
    this.font = {color : "#ffffff"};
    this.edges = [];

    this.getEdges = function () {
        return this.edges;
    }

    this.addEdge = function (edge) {
        this.edges.push(edge);
    }

    this.setShape = function (shape) {
        this.shape = shape;
    }

    this.setId = function (id) {
        this.id = id;
    }

    this.getId = function () {
        return this.id;
    }

    this.setParentNode = function (node) {
        this.parent = node;
    }

    this.getParentNode = function () {
        return this.parent;
    }

    this.addChild = function (node) {
        node.setParentNode(this);
        this.children[this.children.length] = node;
    }

    this.getWeight = function () {
        return this.weight;
    }

    this.setWeight = function (weight) {
        this.weight = weight;
    }

    this.getValue = function () {
        return this.value;
    }

    this.setValue = function (value) {
        this.value = value;
    }

    this.getLabel = function () {
        return this.label;
    }

    this.setLabel = function (label) {
        this.label = label;
    }
}
