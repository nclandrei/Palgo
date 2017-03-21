// TODO: add play/pause/next/previous functionality to all algorithms
// TODO: complete the insertion/deletion methods for heap

const Vis = require('vis');
const fs = require('fs');

let network;

const container = $('#tree-simple')[0];
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

$(document).ready(function () {
    $('#insert-btn').click(function () {
        addHeapNode();
    });

    $('#delete-btn').click(function () {
        deleteItem();
    });

    $('#random-btn').click(function () {
        const numberOfNodes = Math.floor((Math.random() * 30) + 10);
        if (network !== null) {
            network.destroy();
        }
        const data = getFreeScaleNetworkWithWeights(numberOfNodes);
        network = new Vis.Network(container, data, options);
    });
});

let nodes = [];
let edges = [];

network = new Vis.Network(container, [], options);

function insertItem(item) {
    let node = new HeapNode();

    unHighlightAllHeapCodeLines();

    $("#insert-function-call").css('color', 'red');

    unHighlightHeapCodeLine("insert", 1);
    unHighlightHeapCodeLine("insert", 2);
    highlightHeapCodeLine("insert", 0);

    node.label = item;
    node.id = nodes.length;
    setTimeout(function() {
        if (nodes.length === 0) {
            node.root = true;
            node.color = "red";
            nodes.push(node);
            network = rebuildHeap(nodes, edges);
        }
        else {
            unHighlightHeapCodeLine("insert", 0);
            highlightHeapCodeLine("insert", 1);
            node.setParentNode(nodes[Math.floor((nodes.length - 1) / 2)]);
            node.getParentNode().addChild(node);
            const edge = {
                from: node.parent.id,
                to: node.id
            };

            edges.push(edge);
            nodes.push(node);

            node.color = "red";
            nodes[0].color = "#009688";

            network = rebuildHeap(nodes, edges);
            const steps = getInsertSteps(node);
            let cursor = nodes[nodes.length - 1];
            let prev = null;
            for (let index = 0; index < steps; index++) {
                (function (i) {
                    highlightHeapCodeLine("insert", 2);
                    setTimeout(function() {
                        if (prev) {
                            prev.color = "#009688";
                        }
                        prev = cursor;
                        let tempLabel = cursor.label;
                        cursor.label = cursor.parent.label;
                        cursor.parent.label = tempLabel;

                        cursor.color = "red";
                        cursor.parent.color = "red";

                        cursor = cursor.parent;

                        network = rebuildHeap(nodes, edges);
                    }, 1000 + i * 1000);
                })(index);
            }
            setTimeout(function() {
                resetAllHeapNodesColors();
            }, 1000 * (steps + 1));
        }
    }, 1000);
}

function deleteItem() {
    unHighlightAllHeapCodeLines();

    $("#delete-function-call").css('color', 'red');

    highlightHeapCodeLine("delete", 0);
    nodes[0].color = "red";
    nodes[nodes.length - 1].color = "red";
    network = rebuildHeap(nodes, edges);

    setTimeout(function() {
        let tempLabel = nodes[0].label;
        nodes[0].label = nodes[nodes.length - 1].label;
        nodes[nodes.length - 1].label = tempLabel;
        network = rebuildHeap(nodes, edges);
    }, 1000);

    setTimeout(function() {
        unHighlightHeapCodeLine("delete", 0);
        highlightHeapCodeLine("delete", 1);
        nodes.pop();
        network = rebuildHeap(nodes, edges);
    }, 2000);

    setTimeout(function() {
        unHighlightHeapCodeLine("delete", 1);
        highlightHeapCodeLine("delete", 2);
        impose(nodes[0]);
    }, 3000);
}

function impose(item) {
    unHighlightAllHeapCodeLines();
    $("#impose-function-call").css('color', 'red');

    let cursor = item;
    const steps = getImposeSteps();

    while (cursor.children.length > 0 && cursor.label < Math.max(cursor.children[0].label, cursor.children[1].label)) {
        let largerValue;
        if (cursor.children[0].label > cursor.children[1].label) {
            largerValue = cursor.children[0];
        }
        else {
            largerValue = cursor.children[1];
        }
        let temp = cursor.label;
        cursor.label = largerValue.label;
        largerValue.label = temp;
        cursor = largerValue;
    }
    network = rebuildHeap(nodes, edges);
}

function addHeapNode() {
    $('#insert-node-label-text').removeClass('is-empty');
    document.getElementById('insert-node-saveButton').onclick = saveInsertNode.bind(this);
    document.getElementById('insert-node-cancelButton').onclick = cancelInsertNode.bind(this);
    document.getElementById('insert-close-x1').onclick = cancelInsertNode.bind(this);
    $('#insert-node-popUp').css('display', 'block');
}

function clearInsertNodePopUp() {
    $('#insert-node-saveButton').click(null);
    $('#insert-node-cancelButton').click(null);
    $('#insert-close-x1').click(null);
    $('#insert-node-popUp').css('display', 'none');
}

function cancelInsertNode() {
    clearInsertNodePopUp();
}

function saveInsertNode() {
    const nodeLabel = parseInt($('#insert-node-label').val());
    if (!checkIfLabelExists(nodeLabel, network.body.data.nodes.get())) {
        clearInsertNodePopUp();
        $("#insert-n-label-text").text("Change node label");
        insertItem(nodeLabel);
    }
    else {
        $("#insert-node-label-text").addClass("has-error");
        $("#insert-n-label-text").text("Label already exists - please input another one");
    }
}

function rebuildHeap(nodes, edges) {
    const data = {
        nodes: nodes,
        edges: edges
    };
    network.destroy();
    network = new Vis.Network(container, data, options);
    return network;
}

function getInsertSteps() {
    let cursorOne = nodes[nodes.length - 1];
    const originalLabel = cursorOne.label;
    let numberOfSteps = 0;

    while (cursorOne != nodes[0] && originalLabel > cursorOne.parent.label) {
        cursorOne = cursorOne.parent;
        numberOfSteps++;
    }
    return numberOfSteps;
}

function getImposeSteps() {

}

function resetAllHeapNodesColors() {
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].color = "#009688";
    }
    network = rebuildHeap(nodes, edges);
}

function unHighlightAllHeapCodeLines() {
    $("#insert-function-call").css('color', '#3f51b5');

    for (let i = 0; i < 3; i++) {
        unHighlightHeapCodeLine("insert", i);
    }

    $("#delete-function-call").css('color', '#3f51b5');

    for (let i = 0; i < 3; i++) {
        unHighlightHeapCodeLine("delete", i);
    }

    $("#impose-function-call").css('color', '#3f51b5');

    for (let i = 0; i < 2; i++) {
        unHighlightHeapCodeLine("impose", i);
    }
}
