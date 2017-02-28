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
        var obj = getBFSPath(rootNode);
        obj.path = markAllNodesAsUnvisited(obj.path);
        bfsRootAnimation(obj.path);
        rootCodeLineAnimation();
        setTimeout(function () {
            bfsNodesAnimation(obj.path, obj.iter - 1);
        }, 3000);
    });
    $('#random-btn').click(function () {
        var numberOfNodes = Math.floor((Math.random() * 30) + 10);
        if (network !== null) {
            network.destroy();
            network = null;
        }
        var data = getScaleFreeNetwork(numberOfNodes);
        network = new Vis.Network(container, data, options);
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
            if ($('#directed-chechbox').prop('checked')){
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

function bfsRootAnimation(path) {
    var root = findRootNode(path);
    for (var index = 1; index < 3; index++) {
        (function (ind) {
            setTimeout(function () {
                if (ind === 1) {
                    root.visited = true;
                    root.color = '#3f51b5';
                    network = rebuildNetwork(path);
                }
                else {
                    appendToQueue(root.label);
                }
            }, (1000 * ind));
        })(index);
    }
}

function bfsNodesAnimation(path, iter) {
    var queue = [path[0]];
    highlightCodeLine(3);
    for (var index = 0; index < iter; index++) {
        (function (ind) {
            setTimeout(function () {
                var u = queue.shift();
                unHighlightAllCodeLines();
                highlightCodeLine(4);
                highlightCodeLine(3);
                removeFromQueue();
                if (u && u.adjacencyList && u.adjacencyList.length > 0) {
                    var adjacencyList = u.adjacencyList;
                    for (var index1 = 0; index1 < adjacencyList.length; index1++) {
                        (function (ind1) {
                            setTimeout(function () {
                                unHighlightCodeLine(4);
                                unHighlightCodeLine(9);
                                highlightCodeLine(5);
                                if (!adjacencyList[ind1].visited) {
                                    highlightCodeLine(6);
                                    var index2;
                                    for (index2 = 0; index2 < 3; index2++) {
                                        (function (ind2) {
                                            setTimeout(function () {
                                                if (ind2 === 0) {
                                                    adjacencyList[ind1].predecessor = u;
                                                    adjacencyList[ind1].visited = true;
                                                    adjacencyList[ind1].color = '#3f51b5';
                                                    network = rebuildNetwork(path);
                                                    highlightCodeLine(7);
                                                }
                                                else if (ind2 === 1) {
                                                    unHighlightCodeLine(7);
                                                    highlightCodeLine(8);
                                                }
                                                else if (ind2 === 2) {
                                                    queue.push(adjacencyList[ind1]);
                                                    appendToQueue(adjacencyList[ind1].label);
                                                    unHighlightCodeLine(8);
                                                    highlightCodeLine(9);
                                               }
                                            }, ind2 * (parseFloat(11600) / adjacencyList.length / 3));
                                        })(index2);
                                    }
                                }
                            }, ind1 * (parseFloat(11800) / adjacencyList.length));
                        })(index1);
                    }
                }
            }, 12000 * ind);
        })(index);
    }
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

function getBFSPath(root) {
    var queue = [root];
    var numberOfQueueIterations = 0;
    var path = [root];
    while (queue.length > 0) {
        var u = queue.shift();
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

function appendToQueue(text) {
    var th = '<th>' + text + '</th>';
    $('#queue-row').append(th);
}

function removeFromQueue() {
    $('#queue-row').find('th:first').remove();
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
    if (!checkIfLabelExists(data.label, network.body.data.nodes.get())) {
        clearNodePopUp();
        $("#n-label-text").text("Change node label");
        callback(data);
    }
    else {
        $("#node-label-text").addClass("has-error");
        $("#n-label-text").text("Label already exists - please input another one");
    }
}
