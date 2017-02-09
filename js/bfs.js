var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

var network;
var inc = 0;

$(document).ready(function () {
    $('#submit-btn').click(function () {
	var data = network.body.data.nodes;
	var rootNode = data.get()[0];
	startBFS(rootNode);
	startCodeLinesAnimation();
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
	    network.body.nodes[edgeData.from].options.adjacencyList.push(
		network.body.nodes[edgeData.to]);
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

function startBFS(root) {
    var queue = [];
    var nodes = network.body.data.nodes.get();
    (function () {
	setTimeout(function () {
	    root.visited = true;
	    root.color = "red";
	    nodes[0] = root;
	    network = rebuildNetwork(nodes);
	}, (1000));
    })();
    (function () {
	setTimeout(function () {
	    queue.push(root);
	    appendToQueue(root.label)
	}, (2000));
    })();

    while (queue.length > 0) {
	var u = queue.pop();
	var adjacencyList = u.adjacencyList;
	for (var i = 0; i < adjacencyList.length; i++) {
	    if (!adjacencyList[i].visited) {
		console.log('label: ' + adjacencyList[i].label);
		adjacencyList[i].visited = true;
		adjacencyList[i].predecessor = u;
		queue.push(adjacencyList[i]);
	    }
	}
    }
}

function startCodeLinesAnimation() {
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

function appendToQueue(vertex, position) {
    var queueID = '#queue-' + position;
    $(queueID).text(vertex);
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
