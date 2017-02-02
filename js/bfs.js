var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

var network;
var inc = 0;

// create a network
var container = $('#tree-simple')[0];

var options = {
    autoResize: true,
    manipulation: {
        enabled: true,
        initiallyActive: true,
        addNode: function(nodeData, callback) {
            if (network.body.nodes === {}) {
               inc++;
            }
            else {
                inc = 0;
            }
            nodeData.label = inc;
            callback(nodeData);
        }
    },
    physics: {
        enabled: false
    }
};

network = new Vis.Network(container, [], options);

function createAlert(alertText) {
    var alert = "<div id='customAlert' class='alert alert-dismissible alert-danger'> <button type='button' class='close' data-dismiss='alert'> x </button> <strong>Oh snap!</strong> " + alertText + " </div>";
    return alert;
}
