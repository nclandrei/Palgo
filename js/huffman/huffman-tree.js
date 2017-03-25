const dialog = require('electron').remote.dialog;
const fs = require('fs');

$(document).ready(function () {
    $('#submit-btn').click(function () {
        let text = $('#inputText').val();
        if (text === null || text.length === 0) {
            $("#algo-panel").prepend(createAlert("You have submitted an empty string. Please try again."));
        }
        else {
            constructVisTree(text);
            $("#customAlert").remove();
        }
    });

    $('#random-btn').click(function () {
        let numberOfChars = rangeSlider.noUiSlider.get();
        let randomString = generateRandomString(numberOfChars);
        $('#inputText').val(randomString);
        $('#inputFormGroup').removeClass('is-empty');
        $("#customAlert").remove();
        constructVisTree(randomString);
    });

    $('#upload-btn').bind('click', function () {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                console.log("No file selected");
            }
            else {
                readFile(fileNames[0]);
            }
        });
    });
});

function readFile(filepath) {
    let content;
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            $("#algo-panel").prepend(createAlert("Error while trying to read the file. Please upload another one."));
            return;
        }
        content = data.trim();
        processFile();
    });

    function processFile() {
        if (content === null || content.length === 0) {
            $("#algo-panel").prepend(createAlert("You have submitted an empty string. Please try again."));
        }
        else {
            $("#customAlert").remove();
            constructVisTree(content);
            $('#inputFormGroup').removeClass('is-empty');
            $('#inputText').val(content);
        }
    }
}

function constructVisTree(text) {
    addFrequencyTable(text);
    let huffmanTree = buildHuffmanTree(text);
    let nodes = huffmanTree.nodes;
    let edges = huffmanTree.edges;
    let network;

    const container = $('#tree-simple')[0];

    const data = {
        nodes: nodes,
        edges: edges
    };

    const options = {
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

    network = new Vis.Network(container, data, options);
    const delay = text.length * 6000;

    constructLeafNoes(network, nodes, container, options, edges, text);
    runCodeLinesForLeafNodes(text);
    constructRestOfNodes(network, nodes, container, options, edges, text);
    setTimeout(function () {
        constructRestOfTree(nodes, text);
    }, delay);
    setTimeout(function() {
        nodes[nodes[nodes.length - 1].getEdges()[0].to].color = "red";
        nodes[nodes[nodes.length - 1].getEdges()[1].to].color = "red";
        network = rebuildNetwork(network, nodes, container, options, edges);
    }, 6000 * (nodes.length - 1));
}

function addFrequencyTable(text) {
    let freqTable = $("#freq-table");
    if (freqTable.length) {
        freqTable.remove();
    }
    const frequenciesSorted = getCharFrequency(text);
    const uniqueCharString = text.split('').filter(function (item, i, ar) {
        return ar.indexOf(item) === i;
    }).join('');
    let letters = "<thead> <tr>";
    let frequencies = "<tr class = 'success'>";
    for (let i = 0; i < uniqueCharString.length; i++) {
        letters += "<th>" + uniqueCharString[i] + "</th>";
        frequencies += "<td>" + frequenciesSorted[uniqueCharString[i]] + "</td>";
    }
    letters += "</tr> </th>";
    frequencies += "</tr>";
    $("#algo-panel").prepend("<table id = 'freq-table' class = 'table table-striped table-hover'>" + letters + frequencies + "</table>");
}

function rebuildNetwork (network, nodes, container, options, edges) {
    let data = {
        nodes: nodes,
        edges: edges
    };
    network.destroy();
    network = new Vis.Network(container, data, options);
    return network;
}

function constructLeafNodes(network, nodes, container, options, edges, text) {
    for (let index = 0; index < text.length; index++) {
        (function (ind) {
            setTimeout(function () {
                nodes[ind].hidden = false;
                network = rebuildNetwork(network, nodes, container, options, edges);
            }, 6000 * ind);
        })(index);
    }
}

function runCodeLinesForLeafNodes(text) {
    for (let index1 = 0; index1 < 6 * text.length; index1++) {
        (function (ind1) {
            setTimeout(function () {
                const tempVal = ind1 % 6;
                if (tempVal === 0) {
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

function constructRestOfTree(nodes, text) {
    $("#first-line-5").css('color', '#3f51b5');
    for (let index1 = 0; index1 < 6 * (nodes.length - text.length); index1++) {
        (function (ind1) {
            setTimeout(function () {
                const tempVal = ind1 % 6;
                if (tempVal === 0) {
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
}

function constructRestOfNodes(network, nodes,container, options, edges, text) {
    for (let indexRestNodes = text.length; indexRestNodes < nodes.length; indexRestNodes++) {
        (function(indd){
            setTimeout(function() {
                nodes[indd].hidden = false;
                nodes[indd].getEdges()[0].hidden = false;
                nodes[indd].getEdges()[1].hidden = false;
                nodes[indd].color = "red";
                nodes[nodes[indd].getEdges()[0].to].color = "red";
                nodes[nodes[indd].getEdges()[1].to].color = "red";
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
    let text = "";
    const charset = "abcdefghijklmnopqrstuvwxyz";
    for (let i=0; i < len; i++ ) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}
