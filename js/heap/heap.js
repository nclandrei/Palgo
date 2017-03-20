// TODO: add play/pause/next/previous functionality to all algorithms
// TODO: complete the insertion/deletion methods for heap

var Vis = require('vis');
var fs = require('fs');

var network;

$(document).ready(function () {
    $('#insert-btn').click(function () {
        addHeapNode();
    });

    $('#delete-btn').click(function () {
        deleteItem();
    });

    $('#random-btn').click(function () {
        var numberOfNodes = Math.floor((Math.random() * 30) + 10);
        if (network !== null) {
            network.destroy();
        }
        var data = getFreeScaleNetworkWithWeights(numberOfNodes);
        network = new Vis.Network(container, data, options);
    });
});

var container = $('#tree-simple')[0];

var options = {
    autoResize: true,
    layout: {
        hierarchical: {
            enabled: true,
            parentCentralization: true,
            sortMethod: "directed",
            edgeMinimization: true
        }
    },
    interaction: {
        navigationButtons: true
    },
    physics: {
        enabled: false
    }
};

var nodes = [];
var edges = [];

network = new Vis.Network(container, [], options);

function insertItem(item) {
    var node = new Node();
    $("#insert-function-call").css('color', 'red');
    highlightHeapCodeLine("insert", 0);
    node.label = item;
    node.id = nodes.length;
    setTimeout(function() {
        if (nodes.length === 0) {
            node.root = true;
            nodes.push(node);
            network = rebuildHeap(nodes, edges);
        }
        else {
            unHighlightHeapCodeLine("insert", 0);
            highlightHeapCodeLine("insert", 1);
            node.parent = nodes[Math.floor((nodes.length - 1) / 2)];
            node.parent.addChild(node);
            var edge = {
                from: node.parent.id,
                to: node.id
            };
            edges.push(edge);
            nodes.push(node);
            network = rebuildHeap(nodes, edges);
            var index = 0;
            var cursor = node;
            // while (nodes[0].label != cursor.label && cursor.label > cursor.parent.label) {
            for (var index = 0; index < 1; index++) {
                (function (i) {
                    highlightHeapCodeLine("insert", 2);
                    setTimeout(function() {
                        var tempLabel = cursor.label;
                        cursor.label = cursor.parent.label;
                        cursor.parent.label = tempLabel;
                        cursor = cursor.parent;
                        network = rebuildHeap(nodes, edges);
                        i++;
                    }, 1000 + i * 1000);
                })(index);
            }
        }
    }, 1000);
}

function deleteItem() {
    var tempLabel = nodes[0].label;
    nodes[0].label = nodes[nodes.length - 1].label;
    nodes[nodes.length - 1].label = tempLabel;
    nodes.pop();
    impose(nodes[0]);
}

function impose(item) {
    var cursor = item;
    while (cursor.children.length > 0 && cursor.label < Math.max(cursor.children[0].label, cursor.children[1].label)) {
        var largerValue;
        if (cursor.children[0].label > cursor.children[1].label) {
            largerValue = cursor.children[0];
        }
        else {
            largerValue = cursor.children[1];
        }
        var temp = cursor.label;
        cursor.label = largerValue.label;
        largerValue.label = temp;
        cursor = largerValue;
    }
    network = rebuildHeap(nodes, edges);
}

function addHeapNode() {
    $('#insert-node-label-text').removeClass('is-empty');
    document.getElementById('insert-node-saveButton').onclick = saveInsertNode.bind(this);
    document.getElementById('insert-node-cancelButton').onclick = cancelInsertNode.bind(this);
    document.getElementById('insert-close-x1').onclick = cancelInsertNode.bind(this);
    $('#insert-node-popUp').css('display', 'block');
}

function clearInsertNodePopUp() {
    $('#insert-node-saveButton').click(null);
    $('#insert-node-cancelButton').click(null);
    $('#insert-close-x1').click(null);
    $('#insert-node-popUp').css('display', 'none');
}

function cancelInsertNode() {
    clearInsertNodePopUp();
}

function saveInsertNode() {
    var nodeLabel = parseInt($('#insert-node-label').val());
    if (!checkIfLabelExists(nodeLabel, network.body.data.nodes.get())) {
        clearInsertNodePopUp();
        $("#insert-n-label-text").text("Change node label");
        insertItem(nodeLabel);
    }
    else {
        $("#insert-node-label-text").addClass("has-error");
        $("#insert-n-label-text").text("Label already exists - please input another one");
    }
}

function rebuildHeap(nodes, edges) {
    var data = {
        nodes: nodes,
        edges: edges
    };
    network.destroy();
    network = new Vis.Network(container, data, options);
    return network;
}
