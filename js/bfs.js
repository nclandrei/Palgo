var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

var network;
var inc = 0;

$(document).ready(function () {
    $('#submit-btn').click(function () {
	var obj = getBFSPath(network.body.data.nodes.get()[0]);
	bfsRootAnimation(obj.path);
	rootCodeLineAnimation();
	bfsNodesAnimation(obj.path);	
    });
});

// create a network
var container = $('#tree-simple')[0];

var options = {
    autoResize: true,
    manipulation: {
	enabled: true,
	initiallyActive: true,
	addNode: function (nodeData, callback) {
	    if (network.body.nodes === {}) {
		inc = 1;
	    }
	    else {
		inc++;
	    }
	    nodeData.label = inc;
	    nodeData.color = '#009688';
	    nodeData.font = {
		color: '#fff'
	    };
	    nodeData.visited = false;
	    nodeData.adjacencyList = [];
	    nodeData.predecessor = null;
	    callback(nodeData);
	},
	editNode: function (nodeData, callback) {
	    nodeData.root = true;
	    nodeData.color = '#3f51b5';
	    callback(nodeData);
	},
	addEdge: function (edgeData,callback) {
	    var fromNode = network.body.data.nodes.get().filter(function (x) {
		return x.id === edgeData.from;}
	    );
	    var toNode = network.body.data.nodes.get().filter(function (x) {
		return x.id === edgeData.to;}
	    );
	    fromNode[0].adjacencyList.push(toNode[0]);
		if (edgeData.from === edgeData.to) {
		    var r = confirm('Do you want to connect the node to itself?');
		    if (r === true) {
			callback(edgeData);
		    }
		}
		else {
		    callback(edgeData);
		}
	}
    },
    interaction: {
	navigationButtons: true
    },
    physics: {
	enabled: false
    }
};

network = new Vis.Network(container, [], options);

function bfsRootAnimation(path) {
    var root = path[0];
    for (var index = 1; index < 3; index++) {
	(function (ind) {
	    setTimeout(function () {
		if (ind === 1) {
		    root.visited = true;
		    root.color = 'red';
		    network = rebuildNetwork(path);
		}
		else {
		    appendToQueue(root.label);
		}
	    }, (1000 * ind));
	})(index);
    }
}

function bfsNodesAnimation(path) {
    var len = path.length;
    var queue = [root];
    for (var index = 1; index < len; index++) {
	(function (ind) {
	    setTimeout(function () {
		path[ind].visited = true;
		path[ind].color = 'red';
		network = rebuildNetwork(path);
		appendToQueue(path[ind].label);
	    }, (2000 + (1000 * ind)));
	})(index);
    }
}

function getBFSPath(root) {
    var queue = [];
    var numberOfQueueIterations = 0;
    var path = [root];
    queue.push(root);
    while (queue.length > 0) {
	var u = queue.pop();
	var adjacencyList = u.adjacencyList;
	for (var i = 0; i < adjacencyList.length; i++) {
	    if (!adjacencyList[i].visited) {
		adjacencyList[i].visited = true;
		adjacencyList[i].predecessor = u;
		queue.push(adjacencyList[i]);
		path.push(adjacencyList[i]);
	    }
	}
	numberOfQueueIterations++;
    }
    return {path: path, iter: numberOfQueueIterations};
}

function rootCodeLineAnimation() {
    for (var index1 = 0; index1 < 3; index1++) {
	(function (ind1) {
	    setTimeout(function () {
		unHighlightCodeLine(ind1 - 1);
		highlightCodeLine(ind1);
	    }, (1000 * ind1));
	})(index1);
    }
}

function highlightCodeLine(number) {
    $('#line-' + number).css('color', 'red');
}

function unHighlightCodeLine(number) {
    $('#line-' + number).css('color', '#3f51b5');
}

function appendToQueue(text) {
    var index;
    for (index = 1; index < 6; index++) {
	if (!$('#queue-' + index).text()) {
	    break;
	}
    }
    $('#queue-' + index).text(text);
}

function removeFromQueue() {
    var index;
    for (index = 1; index < 6; index++) {
	if (!$('#queue-' + index).text()) {
	    break;
	}
    }
    $('#queue-' + index).text();
}

function createAlert(alertText) {
    var alert = "<div id='customAlert' class='alert alert-dismissible alert-danger'> <button type='button' class='close' data-dismiss='alert'> x </button> <strong>Oh snap!</strong> " + alertText + ' </div>';
    return alert;
}

function rebuildNetwork(nodes) {
    var data = {
	nodes: nodes,
	edges: network.body.data.edges
    };

    network.destroy();
    network = new Vis.Network(container, data, options);
    return network;
}
