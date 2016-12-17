var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

$(document).ready(function () {
    $('#submit-btn').click(function () {
        constructVisTree($('#inputText').val());
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
                document.getElementById("actual-file").value = fileNames[0];
                var text = readFile(fileNames[0]);
                var simple_chart_config = {
                    chart: {
                        container: "#tree-simple"
                    },
                    nodeStructure: buildHuffmanTree(text)
                };
                new Treant(simple_chart_config);
            }
        });
    });
});

// document.getElementById('upload-btn').addEventListener('click', function () {
//     dialog.showOpenDialog(function (fileNames) {
//         if (fileNames === undefined) {
//             console.log("No file selected");
//         }
//         else {
//             document.getElementById("actual-file").value = fileNames[0];
//             var text = readFile(fileNames[0]);
//             var simple_chart_config = {
//                 chart: {
//                     container: "#tree-simple"
//                 },
//                 nodeStructure: buildHuffmanTree(text)
//             };
//             new Treant(simple_chart_config);
//         }
//     });
// }, false);

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
        }
    };

    var network = new Vis.Network(container, data, options);
}