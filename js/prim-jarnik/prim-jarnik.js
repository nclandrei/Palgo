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

    nodes[rIndex].color = "red";
    network = rebuildNetwork(network, container, options, nodes);
    highlightCodeLine(0);

    setTimeout(function() {
        var ntvSet = getNtvNodes(nodes);
        var tvSet = [rIndex];
        nodes[rIndex].color = "#3f51b5";
        unHighlightCodeLine(0);
        highlightCodeLine(1);
        network = rebuildNetwork(network, container, options, nodes);
    }, 1000);

    var nodesArrayLength = nodes.length;

    var prev = null;
    var innerPrev = null;

    for (var i = 0; i < nodesArrayLength - 1; i++) {
        (function (ind) {
            setTimeout(function() {
                unHighlightAllCodeLines();
                highlightCodeLine(2);

            }, 2000 + 6000 * ind);
        })(i);
    }

    setTimeout(function() {
        unHighlightAllCodeLines();
        resetWholeNetwork(network, container, options);
    }, 2000 + (6000 * nodesArrayLength - 1));
}

function findMinWeightEdge (tvSet, ntvSet, nodes) {
    var minEdgeNodes = {};
    var minWeight = Number.MAX_VALUE;
    for (var i = 0; i < tvSet.length; i++) {
        for (var j = 0; j < ntvSet.length; j++) {
            if (nodes[i].adjacencyList.lastIndexOf(nodes[j]) >= 0) {
                var weight = getEdgeWeight(nodes[i], nodes[j]);
                if (weight < minWeight) {
                    minEdgeNodes.p = nodes[i];
                    minEdgeNodes.q = nodes[j];
                    minWeight = weight;
                }
            }
        }
    }
    return minEdgeNodes;
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

function getNtvNodes(nodes) {
    var set = [];
    for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].tv) {
            set.push(i);
        }
    }
    return set;
}
