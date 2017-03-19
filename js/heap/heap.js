// TODO: add play/pause/next/previous functionality to all algorithms
// TODO: complete the insertion/deletion methods for heap

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
        primJarnikAnimation(network.body.data.nodes.get());
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
            nodeData.tv = false;
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

function primJarnikAnimation(nodes) {
    var rIndex = Math.floor(Math.random() * nodes.length);
    nodes[rIndex].tv = true;
    appendElementToTv(nodes[rIndex].label);

    var nodesArrayLength = nodes.length;

    var ntvSet = getNtvNodes(nodes);
    var tvSet = [nodes[rIndex]];

    for (var z = 0; z < nodesArrayLength; z++) {
        if (!nodes[z].tv) {
            appendElementToNtv(nodes[z].label);
        }
    }

    nodes[rIndex].color = "red";
    network = rebuildNetwork(network, container, options, nodes);
    highlightCodeLine(0);

    setTimeout(function() {
        nodes[rIndex].color = "#3f51b5";
        unHighlightCodeLine(0);
        highlightCodeLine(1);
        network = rebuildNetwork(network, container, options, nodes);
    }, 1000);

    for (var i = 0; i < nodesArrayLength - 1; i++) {
        (function (ind) {
            setTimeout(function() {
                unHighlightAllCodeLines();
                highlightCodeLine(2);
                highlightCodeLine(3);
                var minNodes = findMinWeightEdge(tvSet, ntvSet);
                var p = minNodes.p;
                var q = minNodes.q;

                setTimeout(function() {
                    highlightCodeLine(4);
                    p.color = "red";
                    network = rebuildNetwork(network, container, options, nodes);
                }, 1000);

                setTimeout(function() {
                    unHighlightCodeLine(4);
                    highlightCodeLine(5);
                    q.color = "red";
                    network = rebuildNetwork(network, container, options, nodes);
                }, 2000);

                setTimeout(function() {
                    unHighlightCodeLine(5);
                    highlightCodeLine(6);
                }, 3000);

                setTimeout(function() {
                    unHighlightCodeLine(6);
                    unHighlightCodeLine(3);
                    highlightCodeLine(7);
                    p.color = "#3f51b5";
                    q.color = "#3f51b5";
                    network = rebuildNetwork(network, container, options, nodes);
                }, 4000);

                setTimeout(function() {
                    unHighlightCodeLine(7);
                    highlightCodeLine(8);
                    tvSet.push(q);
                    appendElementToTv(q.label);
                    removeElementFromNtv(q.label);
                    ntvSet.splice(ntvSet.indexOf(q), 1);
                }, 5000);
            }, 2000 + 6000 * ind);
        })(i);
    }

    setTimeout(function() {
        unHighlightAllCodeLines();
        resetWholeNetwork(network, container, options);
    }, 2000 + (6000 * nodesArrayLength - 1));
}

function findMinWeightEdge (tvSet, ntvSet) {
    var minEdgeNodes = {};
    var minWeight = Number.MAX_VALUE;
    for (var i = 0; i < tvSet.length; i++) {
        for (var j = 0; j < ntvSet.length; j++) {
            var weight;
            if (containsObject(ntvSet[j], tvSet[i].adjacencyList)) {
                weight = getEdgeWeight(tvSet[i], ntvSet[j]);
                if (weight < minWeight) {
                    minEdgeNodes.p = tvSet[i];
                    minEdgeNodes.q = ntvSet[j];
                    minWeight = weight;
                }
            }
            else if (containsObject(tvSet[i], ntvSet[j].adjacencyList)) {
                weight = getEdgeWeight(ntvSet[j], tvSet[i]);
                if (weight < minWeight) {
                    minEdgeNodes.p = tvSet[i];
                    minEdgeNodes.q = ntvSet[j];
                    minWeight = weight;
                }
            }
        }
    }
    return minEdgeNodes;
}

function getNtvNodes(nodes) {
    var set = [];
    for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].tv) {
            set.push(nodes[i]);
        }
    }
    return set;
}

function getEdgeWeight(nodeOne, nodeTwo) {
    var edgeBetweenNodes = network.body.data.edges.get().filter(function(x) {
        return (x.from === nodeOne.id && x.to === nodeTwo.id);
    });
    return parseInt(edgeBetweenNodes[0].label);
}

function appendElementToTv(label) {
    $("#tv-line").append("<td style='text-align: center' id='tv-" + label + "'>" + label + "</td>");
}

function appendElementToNtv(label) {
    $("#ntv-line").append("<td style='text-align: center' id='ntv-" + label + "'>" + label + "</td>");
}

function removeElementFromNtv(label) {
    $("#ntv-" + label).remove();
}
