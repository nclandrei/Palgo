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
        deleteHeapNode();
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

network = new Vis.Network(container, [], options);

function insertItem(item) {

}

function deleteItem(item) {

}

function impose() {

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

function deleteHeapNode() {
    $('#delete-node-label-text').removeClass('is-empty');
    document.getElementById('delete-node-saveButton').onclick = saveDeleteNode.bind(this);
    document.getElementById('delete-node-cancelButton').onclick = cancelDeleteNode.bind(this);
    document.getElementById('delete-close-x1').onclick = cancelDeleteNode.bind(this);
    $('#delete-node-popUp').css('display', 'block');
}

function clearDeleteNodePopUp() {
    $('#delete-node-saveButton').click(null);
    $('#delete-node-cancelButton').click(null);
    $('#delete-close-x1').click(null);
    $('#delete-node-popUp').css('display', 'none');
}

function cancelDeleteNode() {
    clearDeleteNodePopUp();
}

function saveDeleteNode() {
    var nodeLabel = parseInt($('#insert-node-label').val());
    if (checkIfLabelExists(nodeLabel, network.body.data.nodes.get())) {
        clearDeleteNodePopUp();
        $("#delete-n-label-text").text("Change node label");
        deleteItem(nodeLabel);
    }
    else {
        $("#delete-node-label-text").addClass("has-error");
        $("#delete-n-label-text").text("Node does not exist! Please insert label of an existing node.");
    }
}
