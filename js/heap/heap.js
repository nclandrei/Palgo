// TODO: add play/pause/next/previous functionality to all algorithms
// TODO: complete the insertion/deletion methods for heap

var Vis = require('vis');
var fs = require('fs');

var network;

$(document).ready(function () {
    $('#insert-btn').click(function () {
        insertItem();
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

network = new Vis.Network(container, [], options);

function insertItem() {

}

function deleteItem() {

}

function impose() {

}
