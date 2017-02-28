var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
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
            network = rebuildNetwork(nodes);
            $("#algo-panel").prepend(alertUserThatNoRoot());
        }
        setupTable(network.body.data.nodes.get());
        setupDistances(network.body.data.nodes.get());
        dijkstraAnimation(rootNode, network.body.data.nodes.get());
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
            editNode(nodeData, callback);
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
            addWeightToEdge(data, callback);
        },
        editEdge: {
            editWithoutDrag: function (data, callback) {
                addWeightToEdge(data, callback);
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

function dijkstraAnimation(root, nodes) {
    var S = [root];
    var distances = [];
    for (var i = 0; i < nodes.length; i++) {
        console.log(nodes[i]);
        if (nodes[i] === root) {
            distances[root] = 0;
        }
        else if (root.adjacencyList.lastIndexOf(nodes[i]) >= 0) {
            var edgeBetweenNodes = network.body.data.edges.filter(function(x) {
                return (x.from === root.id && x.to === nodes[i].id);
            });
            distances[nodes[i]] = parseInt(edgeBetweenNodes.label);
        }
        else {
            distances[nodes[i]] = Number.POSITIVE_INFINITY;
        }
    }
    console.log(distances[root]);
}

function highlightCodeLine(number) {
    $('#line-' + number).css('color', 'red');
}

function unHighlightCodeLine(number) {
    $('#line-' + number).css('color', '#3f51b5');
}

function unHighlightAllCodeLines() {
    for (var i = 0; i < 10; i++) {
        unHighlightCodeLine(i);
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

function markAllNodesAsUnvisited(path) {
    for (var i = 0; i < path.length; i++) {
        path[i].visited = false;
    }
    return path;
}

function createAlert(alertText) {
    var alert = "<div id='customAlert' class='alert alert-dismissible alert-danger'> <button type='button' class='close' data-dismiss='alert'> x </button> <strong>Oh snap!</strong> " + alertText + ' </div>';
    $('#algo-panel').prepend(alert);
}

function alertUserThatNoRoot() {
    var alert = "<div class='alert alert-dismissible alert-info'> \
    <button type='button' class='close' data-dismiss='alert'>x</button> \
    <strong>Heads up!</strong> You have not selected any \
    root node, so the first node will be automatically set as root. \
    </div>";
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

function addWeightToEdge(data, callback) {
    $('#edge-label-text').removeClass('is-empty');
    $('#edge-label').val(data.label);
    document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
    document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this, callback);
    document.getElementById('close-x').onclick = cancelEdgeEdit.bind(this, callback);
    $('#edge-popUp').css('display', 'block');
}

function clearEdgePopUp() {
    $('#edge-saveButton').click(null);
    $('#edge-cancelButton').click(null);
    $('#close-x').click(null);
    $('#edge-popUp').css('display', 'none');
}

function cancelEdgeEdit(callback) {
    clearEdgePopUp();
    callback(null);
}

function saveEdgeData(data, callback) {
    if (typeof data.to === 'object') {
        data.to = data.to.id;
    }
    if (typeof data.from === 'object') {
        data.from = data.from.id;
    }
    data.label = $('#edge-label').val();
    var fromNode = network.body.data.nodes.get().filter(function (x) {
            return x.id === data.from;
        }
    );
    var toNode = network.body.data.nodes.get().filter(function (x) {
            return x.id === data.to;
        }
    );
    fromNode[0].adjacencyList.push(toNode[0]);
    clearEdgePopUp();
    callback(data);
}

function editNode(data, callback) {
    var nodeInData = network.body.data.nodes.get().filter(function (x) {
        return x.id === data.id;
    });
    data.adjacencyList = nodeInData[0].adjacencyList;
    if (data.root) {
        $('#node-root-checkbox').prop('checked', true);
    }
    else {
        $('#node-root-checkbox').prop('checked', false);
    }
    $('#node-label-text').removeClass('is-empty');
    $('#node-label').val(data.label);
    document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
    document.getElementById('node-cancelButton').onclick = cancelNodeEdit.bind(this, callback);
    document.getElementById('close-x1').onclick = cancelNodeEdit.bind(this, callback);
    $('#node-popUp').css('display', 'block');
}

function clearNodePopUp() {
    $('#node-saveButton').click(null);
    $('#node-cancelButton').click(null);
    $('#close-x1').click(null);
    $('#node-popUp').css('display', 'none');
}

function cancelNodeEdit(callback) {
    clearNodePopUp();
    callback(null);
}

function saveNodeData(data, callback) {
    data.label = parseInt($('#node-label').val());
    data.root = $('#node-root-checkbox').prop('checked');
    clearNodePopUp();
    callback(data);
}

function findRootNode(path) {
    for (var i = 0; i < path.length; i++) {
        if (path[i].root) {
            return path[i];
        }
    }
}
