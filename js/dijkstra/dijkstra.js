const fs = require("fs");

let network;
let inc = 0;

$(document).ready(function() {
  $("#submit-btn").click(function() {
    if (network.body.data.nodes.get().length === 0) {
      createAlert("You have not added any nodes to the graph.");
      return;
    }
    if (network.body.data.edges.get().length === 0) {
      createAlert("You have not added any edges to the graph.");
      return;
    }
    let rootNode = findRootNode(network.body.data.nodes.get());
    if (!rootNode) {
      let nodes = network.body.data.nodes.get();
      rootNode = nodes[0];
      rootNode.root = true;
      network = rebuildNetwork(network, container, options, nodes);
      $("#algo-panel").prepend(alertUserThatNoRoot());
    }
    dijkstraAnimation(network.body.data.nodes.get());
  });
  $("#random-btn").click(function() {
    const numberOfNodes = Math.floor(Math.random() * 10 + 5);
    if (network !== null) {
      network.destroy();
    }
    const data = getFreeScaleNetworkWithWeights(numberOfNodes);
    network = new Vis.Network(container, data, options);
  });
});

const container = $("#tree-simple")[0];

const options = {
  autoResize: true,
  manipulation: {
    initiallyActive: true,
    addNode: function(nodeData, callback) {
      if (network.body.nodes === {}) {
        inc = 1;
      } else {
        inc++;
      }
      nodeData.root = false;
      nodeData.label = inc;
      nodeData.color = "#009688";
      nodeData.font = {
        color: "#fff"
      };
      nodeData.visited = false;
      nodeData.adjacencyList = [];
      nodeData.predecessor = null;
      callback(nodeData);
    },
    editNode: function(nodeData, callback) {
      editNodeCustom(network, nodeData, callback);
    },
    addEdge: function(data, callback) {
      if ($("#directed-chechbox").prop("checked")) {
        data.arrows = {};
        data.arrows.to = true;
      }
      if (data.from === data.to) {
        const r = confirm("Do you want to connect the node to itself?");
        if (r === true) {
          callback(null);
          return;
        }
      }
      editEdgeCustom(network, data, callback);
    },
    editEdge: {
      editWithoutDrag: function(data, callback) {
        editEdgeCustom(network, data, callback);
      }
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

function dijkstraAnimation(nodes) {
  const nodeRoot = findRootNode(nodes);
  let S = [nodeRoot];
  let distances = [];
  const nodesArrayLength = nodes.length;
  let prev = null;
  let innerPrev = null;

  appendElementToS(nodeRoot.label);
  nodeRoot.color = "#3f51b5";
  network = rebuildNetwork(network, container, options, nodes);

  highlightCodeLine(0);

  for (let i = 0; i < nodesArrayLength; i++) {
    (function(ind) {
      setTimeout(
        function() {
          unHighlightAllCodeLines();
          highlightCodeLine(1);
          if (nodes[ind] === nodeRoot) {
            distances[nodes[ind].label] = 0;
          } else if (containsObject(nodes[ind], nodeRoot.adjacencyList)) {
            distances[nodes[ind].label] = getEdgeWeight(nodeRoot, nodes[ind]);
          } else {
            distances[nodes[ind].label] = Number.POSITIVE_INFINITY;
          }
          appendRowToTable(nodes[ind].label);
          setupDistance(nodes[ind].label, distances[nodes[ind].label]);
          if (ind > 0) {
            if (!containsObject(nodes[ind - 1], S)) {
              nodes[ind - 1].color = "#009688";
            } else {
              nodes[ind - 1].color = "#3f51b5";
            }
            unHighlightTableRow(nodes[ind - 1].label);
          }
          nodes[ind].color = "red";
          highlightTableRow(nodes[ind].label);
          network = rebuildNetwork(network, container, options, nodes);
        },
        2000 + 3000 * ind
      );
    })(i);
  }

  for (let z = 0; z < nodesArrayLength - 1; z++) {
    (function(ind1) {
      setTimeout(
        function() {
          if (prev) {
            if (prev.visited) {
              prev.color = "#3f51b5";
            } else {
              prev.color = "#009688";
            }
            network = rebuildNetwork(network, container, options, nodes);
          }
          let minNode = findMinimumDistanceNode(nodes, S, distances);
          prev = minNode;
          unHighlightAllCodeLines();
          unHighlightTableRow(nodes[nodesArrayLength - 1].label);
          nodes[nodesArrayLength - 1].color = "#009688";
          minNode.color = "red";
          network = rebuildNetwork(network, container, options, nodes);
          highlightCodeLine(2);
          highlightCodeLine(3);
          setTimeout(
            function() {
              unHighlightCodeLine(3);
              highlightCodeLine(4);
              S.push(minNode);
              minNode.visited = true;
              appendElementToS(minNode.label);
            },
            1000
          );
          for (let j = 0; j < nodesArrayLength; j++) {
            (function(ind2) {
              setTimeout(
                function() {
                  if (!containsObject(nodes[ind2], S)) {
                    if (containsObject(nodes[ind2], minNode.adjacencyList)) {
                      if (innerPrev) {
                        innerPrev.color = "#009688";
                        unHighlightTableCell(innerPrev.label);
                      }
                      nodes[ind2].color = "red";
                      innerPrev = nodes[ind2];
                      network = rebuildNetwork(
                        network,
                        container,
                        options,
                        nodes
                      );
                      unHighlightCodeLine(4);
                      highlightCodeLine(5);
                      highlightCodeLine(6);
                      distances[nodes[ind2].label] = Math.min(
                        distances[nodes[ind2].label],
                        distances[minNode.label] +
                          getEdgeWeight(minNode, nodes[ind2])
                      );
                      changeDistance(
                        nodes[ind2].label,
                        distances[nodes[ind2].label]
                      );
                      highlightTableCell(nodes[ind2].label);
                    }
                  }
                },
                1000 + ind2 * 12000 / nodesArrayLength
              );
            })(j);
          }
        },
        2000 + 3000 * nodesArrayLength + 13000 * ind1
      );
    })(z);
  }

  setTimeout(
    function() {
      unHighlightAllCodeLines();
      for (let k = 0; k < nodesArrayLength; k++) {
        unHighlightTableCell(nodes[k].label);
      }
      resetWholeNetwork(network, container, options);
    },
    2000 + 3000 * nodesArrayLength + 13000 * nodesArrayLength - 1
  );
}

function findMinimumDistanceNode(nodes, S, distances) {
  let min = Number.MAX_VALUE;
  let minNode = null;
  let len = nodes.length;
  for (let i = 0; i < len; i++) {
    if (!containsObject(nodes[i], S)) {
      if (distances[nodes[i].label] < min) {
        min = distances[nodes[i].label];
        minNode = nodes[i];
      }
    }
  }
  return minNode;
}

function appendElementToS(label) {
  $("#s-line").append("<td style='text-align: center'>" + label + "</td>");
}

function appendRowToTable(label) {
  const tr = "<tr id=distance-" +
    label +
    '><td style="text-align: center">d(' +
    label +
    ")</td></tr>";
  $("#distances-table").append(tr);
}

function setupDistance(index, distance) {
  if (distance === Number.POSITIVE_INFINITY) {
    $("#distance-" + index).append(
      "<td style='text-align: center'> &infin; </td>"
    );
  } else {
    $("#distance-" + index).append(
      "<td style='text-align: center'>" + distance + "</td>"
    );
  }
}

function changeDistance(index, distance) {
  $("#distance-" + index).find("td:last").html(distance);
}

function highlightTableRow(index) {
  $("#distance-" + index).addClass("success");
}

function unHighlightTableRow(index) {
  $("#distance-" + index).removeClass("success");
}

function highlightTableCell(index) {
  $("#distance-" + index).find("td:last").addClass("success");
}

function unHighlightTableCell(index) {
  $("#distance-" + index).find("td:last").removeClass("success");
}
