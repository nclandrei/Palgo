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
            rootNode = network.body.data.nodes.get()[0];
            rootNode.root = true;
            $("#algo-panel").prepend(alertUserThatNoRoot());
        }
        var obj = getDFSPath(rootNode);
        obj.path = markAllNodesAsUnvisited(obj.path);
        highlightCodeLine(0);
        highlightCodeLine(1);
        appendToStack(rootNode.label);
        setTimeout(function () {
            dfsNodesAnimation(obj.path, obj.iter);
        }, 2000);
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
        addEdge: function (edgeData, callback) {
            var fromNode = network.body.data.nodes.get().filter(function (x) {
                    return x.id === edgeData.from;
                }
            );
            var toNode = network.body.data.nodes.get().filter(function (x) {
                    return x.id === edgeData.to;
                }
            );
            fromNode[0].adjacencyList.push(toNode[0]);
            if ($('#directed-checkbox').prop('checked')){
                edgeData.arrows = {};
                edgeData.arrows.to = true;
            }
            if (edgeData.from === edgeData.to) {
                var r = confirm('Do you want to connect the node to itself?');
                if (r === true) {
                    callback(edgeData);
                }
            }
            else {
                callback(edgeData);
            }
        },
        editEdge: {
            editWithoutDrag: function (data, callback) {
                editEdgeWithoutDrag(data, callback);
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

function dfsNodesAnimation(path, iter) {
    var stack = [path[0]];
    highlightCodeLine(2);
    for (var index = 0; index < iter; index++) {
        (function (ind) {
            setTimeout(function () {
                var u = stack.pop();
                unHighlightAllCodeLines();
                highlightCodeLine(2);
                highlightCodeLine(3);
                highlightCodeLine(4);
                removeFromStack();
                if (!u.visited) {
                    setTimeout(function() {
                        unHighlightCodeLine(3);
                        highlightCodeLine(5);
                        u.visited = true;
                        u.color = '#3f51b5';
                        network = rebuildNetwork(path);
                    }, 1000);
                    if (u && u.adjacencyList && u.adjacencyList.length > 0) {
                        var adjacencyList = u.adjacencyList;
                        for (var index1 = 0; index1 < adjacencyList.length; index1++) {
                            (function (ind1) {
                                setTimeout(function () {
                                    unHighlightCodeLine(5);
                                    highlightCodeLine(6);
                                    highlightCodeLine(7);
                                    unHighlightCodeLine(8);
                                    if (!adjacencyList[ind1].visited) {
                                       setTimeout(function() {
                                           highlightCodeLine(8);
                                           stack.push(adjacencyList[ind1]);
                                           appendToStack(adjacencyList[ind1].label);
                                       }, 1000);
                                    }
                                }, 2000 + ind1 * parseFloat(9800) / adjacencyList.length);
                            })(index1);
                        }
                    }
                }
            }, 12000 * ind);
        })(index);
    }
}

function getDFSPath(root) {
    var stack = [root];
    var numberOfQueueIterations = 0;
    var path = [root];
    while (stack.length > 0) {
        var u = stack.pop();
        if (!u.visited) {
            u.visited = true;
            var adjacencyList = u.adjacencyList;
            for (var i = 0; i < adjacencyList.length; i++) {
                if (!adjacencyList[i].visited) {
                    stack.push(adjacencyList[i]);
                    path.push(adjacencyList[i]);
                }
            }
        }
        numberOfQueueIterations++;
    }
    return {path: path, iter: numberOfQueueIterations};
}

function appendToStack(text) {
    var tr = '<tr><th>' + text + '</th></tr>';
    $('#stack').prepend(tr);
}

function removeFromStack() {
    $('#stack').find('tr:first').remove();
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

function editEdgeWithoutDrag(data, callback) {
    $('#edge-label-text').removeClass('is-empty');
    $('#edge-label').val(data.label);
    $('#edge-saveButton').click(saveEdgeData.bind(this, data, callback));
    $('#edge-cancelButton').click(cancelEdgeEdit.bind(this,callback));
    $('#close-x').click(cancelEdgeEdit.bind(this,callback));
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
    if (typeof data.to === 'object')
        data.to = data.to.id;
    if (typeof data.from === 'object')
        data.from = data.from.id;
    data.label = $('#edge-label').val();
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
    $('#node-saveButton').click(saveNodeData.bind(this, data, callback));
    $('#node-cancelButton').click(cancelNodeEdit.bind(this, callback));
    $('#close-x1').click(cancelNodeEdit.bind(this, callback));
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
