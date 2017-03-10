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
    var nodesArrayLength = nodes.length;
    var prev = null;
    var innerPrev = null;

    highlightCodeLine(0);

    for (var i = 0; i < nodesArrayLength; i++) {
        (function (ind) {
            setTimeout(function() {
                unHighlightAllCodeLines();
                highlightCodeLine(1);
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

function appendElementToS(label) {
    $("#s-line").append("<td style='text-align: center'>" + label + "</td>");
}

function appendRowToTable(label) {
    var tr;
    tr = '<tr id=distance-' + label + '><td style="text-align: center">d(' + label + ')</td></tr>';
    $('#distances-table').append(tr);
}

function setupDistance(index, distance) {
    if (distance === Number.POSITIVE_INFINITY) {
        $("#distance-" + index).append("<td style='text-align: center'> &infin; </td>");
    }
    else {
        $("#distance-" + index).append("<td style='text-align: center'>" +  distance + "</td>");
    }
}

function changeDistance(index, distance) {
    $("#distance-" + index).find("td:last").html(distance);
}

function highlightTableRow(index) {
    $("#distance-" + index).addClass("success");
}

function unHighlightTableRow(index) {
    $("#distance-" + index).removeClass("success");
}

function highlightTableCell(index) {
    $("#distance-" + index).find("td:last").addClass("success");
}

function unHighlightTableCell(index) {
    $("#distance-" + index).find("td:last").removeClass("success");
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

// TODO: add the following lines as source code to the html file
// set an arbitrary vertex r to be a tree-vertex (tv);
// set all other vertices to be non-tree-vertices (ntv);
// while (size of ntv > 0){
//     find edge e = {p,q} of graph such that
//     p is a tv;
//     q is an ntv;
//     wt(e) is minimised;
//     adjoin edge e to the (spanning) tree;
//     make q a tv;
// }
