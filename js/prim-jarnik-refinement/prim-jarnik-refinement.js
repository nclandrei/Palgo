const fs = require("fs");

let network;
let inc = 0;
let tvSet = [];
let ntvSet = [];

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
    primJarnikRefinement(network.body.data.nodes.get());
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
      nodeData.bestTV = null;
      nodeData.tv = false;
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

function primJarnikRefinement(nodes) {
  const rIndex = Math.floor(Math.random() * nodes.length);
  nodes[rIndex].tv = true;
  appendElementToTv(nodes[rIndex].label);

  const nodesArrayLength = nodes.length;

  ntvSet = getNtvNodes(nodes);
  tvSet = [nodes[rIndex]];

  for (let z = 0; z < nodesArrayLength; z++) {
    if (!nodes[z].tv) {
      appendElementToNtv(nodes[z].label);
    }
  }

  nodes[rIndex].color = "red";
  network = rebuildNetwork(network, container, options, nodes);
  highlightCodeLine(0);

  setTimeout(
    function() {
      nodes[rIndex].color = "#3f51b5";
      unHighlightCodeLine(0);
      highlightCodeLine(1);
      network = rebuildNetwork(network, container, options, nodes);
    },
    1000
  );

  setTimeout(
    function() {
      unHighlightCodeLine(1);
      highlightCodeLine(2);
      for (let z = 0; z < nodesArrayLength - 1; z++) {
        ntvSet[z].bestTV = nodes[rIndex];
      }
      network = rebuildNetwork(network, container, options, nodes);
    },
    2000
  );

  for (let i = 0; i < nodesArrayLength - 1; i++) {
    (function(ind) {
      setTimeout(
        function() {
          unHighlightAllCodeLines();
          highlightCodeLine(3);
          let minTv = findMinimalTvBestTvEdge(ntvSet);
          setTimeout(
            function() {
              highlightCodeLine(4);
              minTv.color = "red";
              minTv.bestTV.color = "red";
              network = rebuildNetwork(network, container, options, nodes);
            },
            1000
          );

          setTimeout(
            function() {
              unHighlightCodeLine(4);
              highlightCodeLine(5);
              minTv.color = "#3f51b5";
              minTv.bestTV.color = "#3f51b5";
              network = rebuildNetwork(network, container, options, nodes);
            },
            2000
          );

          setTimeout(
            function() {
              unHighlightCodeLine(5);
              highlightCodeLine(6);
              tvSet.push(minTv);
              appendElementToTv(minTv.label);
              removeElementFromNtv(minTv.label);
              ntvSet.splice(ntvSet.indexOf(minTv), 1);
            },
            3000
          );

          setTimeout(
            function() {
              unHighlightCodeLine(6);
              highlightCodeLine(7);
              for (let z = 0; z < ntvSet.length; z++) {
                ntvSet[z] = updateBestTV(ntvSet[z], tvSet);
              }
              network = rebuildNetwork(network, container, options, nodes);
            },
            4000
          );
        },
        3000 + 5000 * ind
      );
    })(i);
  }

  setTimeout(
    function() {
      unHighlightAllCodeLines();
      resetWholeNetwork(network, container, options);
      resetVertexSets();
    },
    3000 + (5000 * nodesArrayLength - 1)
  );
}

function findMinimalTvBestTvEdge(ntvSet) {
  let minNtv;
  let minWeight = Number.MAX_VALUE;
  for (let i = 0; i < ntvSet.length; i++) {
    let weight;
    let bestTV = ntvSet[i].bestTV;
    if (
      ntvSet[i].adjacencyList && containsObject(bestTV, ntvSet[i].adjacencyList)
    ) {
      weight = getEdgeWeight(ntvSet[i], bestTV);
      if (weight < minWeight) {
        minNtv = ntvSet[i];
        minWeight = weight;
      }
    } else if (
      bestTV.adjacencyList && containsObject(ntvSet[i], bestTV.adjacencyList)
    ) {
      weight = getEdgeWeight(bestTV, ntvSet[i]);
      if (weight < minWeight) {
        minNtv = ntvSet[i];
        minWeight = weight;
      }
    }
  }
  return minNtv;
}

function updateBestTV(node, tvSet) {
  let bestTV = node.bestTV;
  let minWeight = Number.MAX_VALUE;
  let weight;
  for (let i = 0; i < tvSet.length; i++) {
    if (containsObject(tvSet[i], node.adjacencyList)) {
      weight = getEdgeWeight(node, tvSet[i]);
      if (weight < minWeight) {
        bestTV = tvSet[i];
        minWeight = weight;
      }
    } else if (containsObject(node, tvSet[i].adjacencyList)) {
      weight = getEdgeWeight(tvSet[i], node);
      if (weight < minWeight) {
        bestTV = tvSet[i];
        minWeight = weight;
      }
    }
  }
  node.bestTV = bestTV;
  return node;
}

function getNtvNodes(nodes) {
  let set = [];
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].tv) {
      set.push(nodes[i]);
    }
  }
  return set;
}

function containsObject(obj, list) {
  let i;
  for (i = 0; i < list.length; i++) {
    if (list[i].id === obj.id) {
      return true;
    }
  }
  return false;
}

function resetVertexSets() {
    console.log(tvSet);
    for (let i = 0; i < tvSet.length; i++) {
        removeElementFromTv(tvSet.pop().label);
    }
}
