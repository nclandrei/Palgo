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
        primJarnikRefinement(network.body.data.nodes.get());
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

function primJarnikRefinement(nodes) {
    var nodeRoot = findRootNode(nodes);
    var S = [nodeRoot];
    var distances = [];
    var nodesArrayLength = nodes.length;
    var prev = null;
    var innerPrev = null;

    highlightCodeLine(0);

    for (var i = 0; i < nodesArrayLength; i++) {
        (function (ind) {
            setTimeout(function() {
                unHighlightAllCodeLines();
                highlightCodeLine(1);
                if (nodes[ind] == nodeRoot) {
                    distances[nodes[ind].label] = 0;
                }
                else if (containsObject(nodes[ind], nodeRoot.adjacencyList)) {
                    distances[nodes[ind].label] = getEdgeWeight(nodeRoot, nodes[ind]);
                }
                else {
                    distances[nodes[ind].label] = Number.POSITIVE_INFINITY;
                }
                appendRowToTable(nodes[ind].label);
                setupDistance(nodes[ind].label, distances[nodes[ind].label]);
                if (ind > 0) {
                    nodes[ind-1].color = "#009688";
                    unHighlightTableRow(nodes[ind-1].label);
                }
                nodes[ind].color = "red";
                highlightTableRow(nodes[ind].label);
                network = rebuildNetwork(network, container, options, nodes);
            }, 2000 + 3000 * ind);
        })(i);
    }

    setTimeout(function() {
        unHighlightAllCodeLines();
        resetWholeNetwork(network, container, options);
    }, 2000 + 3000 * nodesArrayLength + 13000 * nodesArrayLength - 1);
}

function findMinimumDistanceNode (nodes, S, distances) {
    var min = Number.MAX_VALUE;
    var minNode = null;
    var len = nodes.length;
    for (var i = 0; i < len; i++) {
        if (!containsObject(nodes[i], S)) {
            if (distances[nodes[i].label] < min) {
                min = distances[nodes[i].label];
                minNode = nodes[i];
            }
        }
    }
    return minNode;
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

function appendElementToTv(label) {
    $("#tv-line").append("<td style='text-align: center'>" + label + "</td>");
}

function appendElementToNtv(label) {
    $("#ntv-line").append("<td style='text-align: center'>" + label + "</td>");
}

function removeElementFromTv(label) {

}

function removeElementFromNtv(label) {

}
