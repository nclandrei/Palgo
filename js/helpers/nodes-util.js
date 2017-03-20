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

function HeapNode() {
    this.id = 0;
    this.root = false;
    this.children = [];
    this.parent = null;
    this.label = "";
    this.hidden = false;
    this.color = "#009688";
    this.font = {color : "#ffffff"};
    this.edges = [];

    this.getEdges = function () {
        return this.edges;
    };

    this.addEdge = function (edge) {
        this.edges.push(edge);
    };

    this.setId = function (id) {
        this.id = id;
    };

    this.getId = function () {
        return this.id;
    };

    this.setParentNode = function (node) {
        this.parent = node;
    };

    this.getParentNode = function () {
        return this.parent;
    };

    this.addChild = function (node) {
        this.children.push(node);
    };

    this.getLabel = function () {
        return this.label;
    };

    this.setLabel = function (label) {
        this.label = label;
    };
}
