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
        $('#inputText').val(randomString);
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
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        return data;
    });
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

    var index = 0;

    (function myLoop() {
        setTimeout(function () {
            if (index < text.length) {
                var i = 1;
                (function codeLineAnimation() {
                    setTimeout(function () {
                        if (i == 1) {
                            $("#line-6").css('color', '#3f51b5');
                        } 
                        else {
                            $("#line-" + (i - 1)).css('color', '#3f51b5');
                            $("#line-" + i).css('color', 'red');
                        }
                        i++;
                        if (i < 7) {
                            codeLineAnimation();
                        }
                    }, 700);
                })(0);
            }
            else {
                var t = 0;
                var firstChildNode = nodes[index].getEdges()[0].to;
                var secondChildNode = nodes[index].getEdges()[1].to;
                (function childNodesAnimation() {
                    setTimeout(function () {
                        if (t == 0) {
                            nodes[firstChildNode].color = "#3f51b5";
                        }
                        if (t == 1) {
                            nodes[secondChildNode].color = "#3f51b5";
                        }
                        t++;
                        if (t < 2) {
                            childNodesAnimation();
                        }
                    }, 2450);
                })(0);
            }
            nodes[index].hidden = false;
            if (nodes[index].getEdges()[0]) {
                nodes[index].getEdges()[0].hidden = false;
                nodes[nodes[index].getEdges()[0].to].color = "#009688";
            }
            if (nodes[index].getEdges()[1]) {
                nodes[index].getEdges()[1].hidden = false;
                nodes[nodes[index].getEdges()[1].to].color = "#009688";
            }
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
        }, 5000)
    })(0);
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
    for (i = 0; i < uniqueCharString.length; i++) {
        letters += "<th>" + uniqueCharString[i] + "</th>";
        frequencies += "<td>" + frequenciesSorted[uniqueCharString[i]] + "</td>";
    }
    letters += "</tr> </th>";
    frequencies += "</tr>";
    $("#algo-panel").prepend("<table id = 'freq-table' class = 'table table-striped table-hover'>" + letters + frequencies + "</table>");
}