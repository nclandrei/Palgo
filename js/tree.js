var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

$(document).ready(function () {
    $('#submit-btn').click(function () {
        var nodes = buildHuffmanTree($('#inputText').val()).nodes;
        var edges = buildHuffmanTree($('#inputText').val()).edges;
        
        // create a network
        var container = document.getElementById('tree-simple');

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        
        var options = {};

        // initialize your network!
        var network = new Vis.Network(container, data, options);
    });

    $('#random-btn').click(function () {
        var simple_chart_config = {
            chart: {
                container: "#tree-simple"
            },
            nodeStructure: buildHuffmanTree("This is a very randomly generated string to be used as an example.")
        };
        new Treant(simple_chart_config);
    });

    $('#upload-btn').bind('click', function () {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                console.log("No file selected");
            }
            else {
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
        var simple_chart_config = {
            chart: {
                container: "#tree-simple"
            },
            nodeStructure: buildHuffmanTree("This is a very randomly generated string to be used as an example.")
        };
        new Treant(simple_chart_config);
    });
});

document.getElementById('upload-btn').addEventListener('click', function () {
    dialog.showOpenDialog(function (fileNames) {
        if (fileNames === undefined) {
            console.log("No file selected");
        }
        else {
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
}, false);

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        return data;
    });
}