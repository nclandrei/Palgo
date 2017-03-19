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

function deleteItem() {

}

function impose() {

}

function addHeapNode() {
    $('#node-label-text').removeClass('is-empty');
    document.getElementById('node-saveButton').onclick = saveNodeData.bind(this);
    document.getElementById('node-cancelButton').onclick = cancelNodeEdit.bind(this);
    document.getElementById('close-x1').onclick = cancelNodeEdit.bind(this);
    $('#node-popUp').css('display', 'block');
}

function deleteHeapNode() {
    $('#node-label-text').removeClass('is-empty');
    document.getElementById('node-saveButton').onclick = saveNodeData.bind(this);
    document.getElementById('node-cancelButton').onclick = cancelNodeEdit.bind(this);
    document.getElementById('close-x1').onclick = cancelNodeEdit.bind(this);
    $('#node-popUp').css('display', 'block');
}

function clearNodePopUp() {
    $('#node-saveButton').click(null);
    $('#node-cancelButton').click(null);
    $('#close-x1').click(null);
    $('#node-popUp').css('display', 'none');
}

function cancelNodeEdit() {
    clearNodePopUp();
}

function saveNodeData() {
    var nodeLabel = parseInt($('#node-label').val());
    if (!checkIfLabelExists(nodeLabel, network.body.data.nodes.get())) {
        clearNodePopUp();
        $("#n-label-text").text("Change node label");
        insertItem(nodeLabel);
    }
    else {
        $("#node-label-text").addClass("has-error");
        $("#n-label-text").text("Label already exists - please input another one");
    }
}
