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

    for (var index = 0; index < text.length; index++) {
        (function(ind){
            setTimeout(function() {
                nodes[ind].hidden = false;
                network = rebuildNetwork (network, nodes, container, options, edges);
            }, 6000 * ind);
        })(index);
    }

    for (var outerIndex = 0; outerIndex < text.length; outerIndex++) {
        for (var index1 = 1; index1 <= 6; index1++) {
            (function (ind1) {
                setTimeout(function () {
                    if (ind1 == 1) {
                        $("#line-6").css('color', '#3f51b5');
                        $("#line-" + (ind1 % 6)).css('color', 'red');
                    }
                    else {
                        $("#line-" + (ind1 - 1)).css('color', '#3f51b5');
                        $("#line-" + ind1).css('color', 'red');
                    }
                    console.log("hit");
                }, (1000 * ind1) + outerIndex);
            })(index1);
        }
    }
    // (function myLoop() {
    //     setTimeout(function () {
    //         if (index < text.length) {
    //             var i = 1;
    //             (function codeLineAnimation() {
    //                 setTimeout(function () {
    //                     if (i == 1) {
    //                         $("#line-6").css('color', '#3f51b5');
    //                     }
    //                     else {
    //                         $("#line-" + (i - 1)).css('color', '#3f51b5');
    //                         $("#line-" + i).css('color', 'red');
    //                     }
    //                     i++;
    //                     if (i < 7) {
    //                         codeLineAnimation();
    //                     }
    //                 }, 700);
    //             })(0);
    //         }
    //         nodes[index].hidden = false;
    //         if (nodes[index].getEdges()[0]) {
    //             nodes[index].getEdges()[0].hidden = false;
    //         }
    //         if (nodes[index].getEdges()[1]) {
    //             nodes[index].getEdges()[1].hidden = false;
    //         }
    //         if (index >= 2) {
    //             setCorrectingInterval(function () {
    //                 nodes[index].getEdges()[0].to.color = "#ffffff";
    //                 nodes[index].getEdges()[1].to.color = "#ffffff";
    //             }, 1000);
    //         }
    //         var data = {
    //             nodes: nodes,
    //             edges: edges
    //         };
    //         network.destroy();
    //         network = new Vis.Network(container, data, options);
    //         index++;
    //         if (index < nodes.length) {
    //             myLoop(index);
    //         }
    //     }, 5000)
    // });


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

function rebuildNetwork (network, nodes, container, options, edges) {
    var data = {
        nodes: nodes,
        edges: edges
    };
    network.destroy();
    network = new Vis.Network(container, data, options);
    return network;
}
