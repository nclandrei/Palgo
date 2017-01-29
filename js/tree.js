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
        var numberOfChars = rangeSlider.noUiSlider.get();
        var randomString = generateRandomString(numberOfChars);
        constructVisTree(randomString);
    });

    $('#upload-btn').bind('click', function () {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                console.log("No file selected");
            }
            else {
                var text = readFile(fileNames[0]);
                constructVisTree(text);
            }
        });
    });
});

function readFile(filepath) {
    var content;
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        content = data;
        processFile();
    });

    function processFile() {
        constructVisTree(content);
    }
}

function constructVisTree(text) {
    addFrequencyTable(text);
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
                sortMethod: "directed",
                edgeMinimization: true
            }
        },
        physics: {
            enabled: false
        }
    };

    network = new Vis.Network(container, data, options);
    $("#line-0").css('color', 'blue');
    var delay = text.length * 6000;

    constructLeafNodes(network, nodes, container, options, edges, text);
    setTimeout(function() {
        constructRestOfTree(network, nodes, container, options, edges, text);
    }, delay);
}

function addFrequencyTable(text) {
    if ($("#freq-table").length) {
        $("#freq-table").remove();
    }
    var frequenciesSorted = getCharFrequency(text);
    var uniqueCharString = text.split('').filter(function (item, i, ar) {
        return ar.indexOf(item) === i;
    }).join('');
    var letters = "<thead> <tr>";
    var frequencies = "<tr class = 'success'>";
    for (var i = 0; i < uniqueCharString.length; i++) {
        letters += "<th>" + uniqueCharString[i] + "</th>";
        frequencies += "<td>" + frequenciesSorted[uniqueCharString[i]] + "</td>";
    }
    letters += "</tr> </th>";
    frequencies += "</tr>";
    $("#algo-panel").prepend("<table id = 'freq-table' class = 'table table-striped table-hover'>" + letters + frequencies + "</table>");
}

function rebuildNetwork (network, nodes, container, options, edges) {
    var data = {
        nodes: nodes,
        edges: edges
    };
    network.destroy();
    network = new Vis.Network(container, data, options);
    return network;
}

function constructLeafNodes(network, nodes, container, options, edges, text) {
    for (var index = 0; index < text.length; index++) {
        (function (ind) {
            setTimeout(function () {
                nodes[ind].hidden = false;
                network = rebuildNetwork(network, nodes, container, options, edges);
            }, 6000 * ind);
        })(index);
    }

    for (var index1 = 0; index1 < 6 * text.length; index1++) {
        (function (ind1) {
            setTimeout(function () {
                var tempVal = ind1 % 6;
                if (tempVal == 0) {
                    $("#first-line-5").css('color', '#3f51b5');
                    $("#first-line-0").css('color', 'red');
                }
                else {
                    $("#first-line-" + (tempVal - 1)).css('color', '#3f51b5');
                    $("#first-line-" + (tempVal)).css('color', 'red');
                }
            }, (1000 * ind1));
        })(index1);
    }
}

function constructRestOfTree(network, nodes, container, options, edges, text) {
    for (var index1 = 0; index1 < 6 * (nodes.length - text.length); index1++) {
        (function (ind1) {
            setTimeout(function () {
                var tempVal = ind1 % 6;
                if (tempVal == 0) {
                    $("#second-line-5").css('color', '#3f51b5');
                    $("#second-line-0").css('color', 'red');
                }
                else {
                    $("#second-line-" + (tempVal - 1)).css('color', '#3f51b5');
                    $("#second-line-" + (tempVal)).css('color', 'red');
                }
            }, (1000 * ind1));
        })(index1);
    }

    for (var indexRestNodes = text.length; indexRestNodes < nodes.length; indexRestNodes++) {
        (function(indd){
            setTimeout(function() {
                nodes[indd].hidden = false;
                nodes[indd].getEdges()[0].hidden = false;
                nodes[indd].getEdges()[1].hidden = false;
                nodes[nodes[indd].getEdges()[0].to].color = "red";
                nodes[nodes[indd].getEdges()[1].to].color = "red";
                nodes[indd].color = "red";
                if (indd > text.length) {
                    nodes[indd-1].color = "#009688";
                    nodes[nodes[indd-1].getEdges()[0].to].color = "#009688";
                    nodes[nodes[indd-1].getEdges()[1].to].color = "#009688";
                    nodes[indd-1].getEdges()[0].color = "#009688";
                    nodes[indd-1].getEdges()[1].color = "#009688";
                }
                network = rebuildNetwork (network, nodes, container, options, edges);
            }, 6000 * indd);
        })(indexRestNodes);
    }
}

function generateRandomString(len) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for( var i=0; i < len; i++ ) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}
