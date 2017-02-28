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
        dijkstraAnimation(rootNode, network.body.data.nodes.get());
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
            editEdgeCustom(data, callback);
        },
        editEdge: {
            editWithoutDrag: function (data, callback) {
                editEdgeCustom(data, callback);
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
    var distances = [];
    for (var i = 0; i < nodes.length; i++) {
        console.log(nodes[i]);
        if (nodes[i] === nodeRoot) {
            distances[nodes[i]] = 0;
        }
        else if (nodeRoot.adjacencyList.lastIndexOf(nodes[i]) >= 0) {
            var edgeBetweenNodes = network.body.data.edges.filter(function(x) {
                return (x.from === nodeRoot.id && x.to === nodes[i].id);
            });
            distances[nodes[i]] = parseInt(edgeBetweenNodes.label);
            console.log(distances[nodes[i]]);
        }
        else {
            distances[nodes[i]] = Number.POSITIVE_INFINITY;
        }
    }
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
                var edgeBetweenNodes = network.body.data.edges.filter(function(x) {
                    return (x.from === rootNode.id && x.to === nodes[i].id);
                });
                $("#distance-" + nodes[i].label).append("<td style='text-align: center'> " + edgeBetweenNodes.label + " </td>");
            }
            else {
                $("#distance-" + nodes[i].label).append("<td style='text-align: center'> &infin; </td>");
            }
        }
    }
}
