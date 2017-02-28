var Vis = require('vis');
var fs = require('fs');

var network;
var inc = 0;

$(document).ready(function () {
    $('#submit-btn').click(function () {
        if (network.body.data.nodes.get().length == 0) {
            createAlert("You have not added any nodes to the graph.");
            return;
        }
        if (network.body.data.edges.get().length == 0) {
            createAlert("You have not added any edges to the graph.");
            return;
        }
        var rootNode = findRootNode(network.body.data.nodes.get());
        if (!rootNode) {
            var nodes = network.body.data.nodes.get();
            rootNode = nodes[0];
            rootNode.root = true;
            network = rebuildNetwork(network, container, options, nodes);
            $("#algo-panel").prepend(alertUserThatNoRoot());
        }
        setupTable(network.body.data.nodes.get());
        setupDistances(network.body.data.nodes.get());
        dijkstraAnimation(network.body.data.nodes.get());
    });
    $('#random-btn').click(function () {
        var numberOfNodes = Math.floor((Math.random() * 30) + 10);
        if (network !== null) {
            network.destroy();
            network = null;
        }
        var data = getFreeScaleNetworkWithWeights(numberOfNodes);
        network = new Vis.Network(container, data, options);
    });
});

// create a network
var container = $('#tree-simple')[0];

var options = {
    autoResize: true,
    manipulation: {
        initiallyActive: true,
        addNode: function (nodeData, callback) {
            if (network.body.nodes === {}) {
                inc = 1;
            }
            else {
                inc++;
            }
            nodeData.root = false;
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
            editNodeCustom(network, nodeData, callback);
        },
        addEdge: function (data, callback) {
            if ($('#directed-chechbox').prop('checked')){
                data.arrows = {};
                data.arrows.to = true;
            }
            if (data.from === data.to) {
                var r = confirm('Do you want to connect the node to itself?');
                if (r === true) {
                    callback(null);
                    return;
                }
            }
            editEdgeCustom(network, data, callback);
        },
        editEdge: {
            editWithoutDrag: function (data, callback) {
                editEdgeCustom(network, data, callback);
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

function dijkstraAnimation(nodes) {
    var nodeRoot = findRootNode(nodes);
    var S = [];
    var distances = [];
    var nodesArrayLength = nodes.length;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] == nodeRoot) {
            distances[nodes[i]] = 0;
        }
        else if (containsObject(nodes[i], nodeRoot.adjacencyList)) {
            distances[nodes[i]] = getEdgeWeight(nodeRoot, nodes[i]);
        }
        else {
            distances[nodes[i]] = Number.POSITIVE_INFINITY;
        }
    }
    while (S.length != nodes.length) {
        var minNode = findMinimumDistanceNode(nodes, S, distances);
        S.push(minNode);
        console.log("S contains:");
        console.log(S);
        for (var j = 0; j < nodesArrayLength; j++) {
            if (!containsObject(nodes[j], S)) {
                distances[nodes[j]] = Math.min(distances[nodes[j]], (distances[minNode] + getEdgeWeight(minNode, nodes[j])));
                console.log("made it until here");
            }
        }
    }
    for (var z = 0; z < nodesArrayLength; z++) {
        console.log(distances[nodes[z]]);
    }
}

function findMinimumDistanceNode (nodes, S, distances) {
    var min = Number.MAX_VALUE;
    var minNode = null;
    var len = nodes.length;
    for (var i = 0; i < len; i++) {
        if (!containsObject(nodes[i], S)) {
            if (distances[nodes[i]] < min) {
                min = distances[nodes[i]];
                minNode = nodes[i];
            }
        }
    }
    return minNode;
}

function setupTable(nodes) {
   for (var i = 0; i < nodes.length; i++) {
       var tr;
       tr = '<tr id=distance-' + nodes[i].label + '><td style="text-align: center">d(' + nodes[i].label + ')</td></tr>';
       $('#distances-table').append(tr);
   }
}

function setupDistances(nodes) {
    var rootNode = findRootNode(nodes);
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].root) {
            $("#distance-" + nodes[i].label).append("<td style='text-align: center'> 0 </td>");
        }
        else {
            if (rootNode.adjacencyList.lastIndexOf(nodes[i]) >= 0) {
                var edgeWeight = getEdgeWeight(rootNode, nodes[i]);
                $("#distance-" + nodes[i].label).append("<td style='text-align: center'> " + edgeWeight + " </td>");
            }
            else {
                $("#distance-" + nodes[i].label).append("<td style='text-align: center'> &infin; </td>");
            }
        }
    }
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id == obj.id) {
            return true;
        }
    }
    return false;
}

function getEdgeWeight(nodeOne, nodeTwo) {
    var edgeBetweenNodes = network.body.data.edges.get().filter(function(x) {
        return (x.from === nodeOne.id && x.to === nodeTwo.id);
    });
    return parseInt(edgeBetweenNodes[0].label);
}
