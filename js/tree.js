var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

$(document).ready(function () {
    $('#submit-btn').click(function () {
        var text = $('#inputText').val();
        var alert = "<div class='alert alert-dismissible alert-danger'> <button type='button' class='close' data-dismiss='alert'> x </button> <strong>Oh snap!</strong> Insert some input text and try submitting again.</div>";
        if (text == null || text.length === 0) {
            $("#algo-panel").prepend(alert);
        }
        constructVisTree(text);
    });

    $('#random-btn').click(function () {
        var randomString = Math.random().toString(36).slice(2);
        constructVisTree(randomString);
    });

    $('#upload-btn').bind('click', function () {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                console.log("No file selected");
            } else {
                var text = readFile(fileNames[0]);
                constructVisTree(text);
            }
        });
    });
});

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        return data;
    });
}

function constructVisTree(text) {
    var huffmanTree = buildHuffmanTree(text);
    var nodes = huffmanTree.nodes;
    var edges = huffmanTree.edges;
    var network;

    // create a network
    var container = document.getElementById('tree-simple');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        autoResize: true,
        layout: {
            hierarchical: {
                enabled: true,
                parentCentralization: true,
                sortMethod: "directed"
            }
        },
        physics: {
            enabled: false
        }
    };

    network = new Vis.Network(container, data, options);

    var index = 0; 

    (function myLoop () {          
        setTimeout(function () {   
            nodes[index].hidden = false;
            var data = {
                nodes: nodes,
                edges: edges
            };
            network.destroy();
            network = new Vis.Network(container, data, options);
            index++;
            if (index < nodes.length) {
                myLoop(index);
            }
        }, 2000)
    })(0);   
}