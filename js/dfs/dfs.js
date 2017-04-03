const Vis = require("vis");
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
      rootNode = network.body.data.nodes.get()[0];
      rootNode.root = true;
      $("#algo-panel").prepend(alertUserThatNoRoot());
    }
    let obj = getDFSPath(rootNode);
    obj.path = markAllNodesAsUnvisited(obj.path);
    highlightCodeLine(0);
    highlightCodeLine(1);
    appendToStack(rootNode.label);
    setTimeout(
      function() {
        dfsNodesAnimation(obj.path, obj.iter);
      },
      2000
    );
    setTimeout(
      function() {
        unHighlightAllCodeLines();
      },
      2000 + 12000 * obj.iter
    );
  });
  $("#random-btn").click(function() {
    const numberOfNodes = Math.floor(Math.random() * 30 + 10);
    if (network !== null) {
      network.destroy();
    }
    const data = getScaleFreeNetwork(numberOfNodes);
    network = new Vis.Network(container, data, options);
  });
});

const container = $("#tree-simple")[0];

const options = {
  autoResize: true,
  manipulation: {
    enabled: true,
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
    addEdge: function(edgeData, callback) {
      const fromNode = network.body.data.nodes.get().filter(function(x) {
        return x.id === edgeData.from;
      });
      const toNode = network.body.data.nodes.get().filter(function(x) {
        return x.id === edgeData.to;
      });
      fromNode[0].adjacencyList.push(toNode[0]);
      if ($("#directed-checkbox").prop("checked")) {
        edgeData.arrows = {};
        edgeData.arrows.to = true;
      }
      if (edgeData.from === edgeData.to) {
        const r = confirm("Do you want to connect the node to itself?");
        if (r === true) {
          callback(edgeData);
        }
      } else {
        callback(edgeData);
      }
    },
    editEdge: {
      editWithoutDrag: function(data, callback) {
        editEdgeCustom(data, callback);
      }
    }
  },
  nodes: {
    fixed: true
  },
  interaction: {
    navigationButtons: true
  },
  physics: {
    enabled: false
  }
};

network = new Vis.Network(container, [], options);

function dfsNodesAnimation(nodesArray, iter) {
  let stack = [nodesArray[0]];
  let prev = null;
  highlightCodeLine(2);
  for (let index = 0; index < iter; index++) {
    (function(ind) {
      setTimeout(
        function() {
          if (prev) {
            if (prev.adjacencyList && prev.adjacencyList.length > 0) {
              prev.adjacencyList[
                prev.adjacencyList.length - 1
              ].color = "#009688";
            }
            if (prev.visited) {
              prev.color = "#3f51b5";
            }
            network = rebuildNetwork(network, container, options, nodesArray);
          }
          let u = stack.pop();
          u.color = "red";
          network = rebuildNetwork(network, container, options, nodesArray);
          prev = u;
          unHighlightAllCodeLines();
          highlightCodeLine(2);
          highlightCodeLine(3);
          highlightCodeLine(4);
          removeFromStack();
          if (!u.visited) {
            setTimeout(
              function() {
                unHighlightCodeLine(3);
                highlightCodeLine(5);
                u.visited = true;
                if (ind === iter - 1) {
                  u.color = "#3f51b5";
                  network = rebuildNetwork(
                    network,
                    container,
                    options,
                    nodesArray
                  );
                }
              },
              1000
            );
            if (u && u.adjacencyList && u.adjacencyList.length > 0) {
              let adjacencyList = u.adjacencyList;
              for (let index1 = 0; index1 < adjacencyList.length; index1++) {
                (function(ind1) {
                  setTimeout(
                    function() {
                      if (ind1 > 0) {
                        adjacencyList[ind1 - 1].color = "#009688";
                      }
                      adjacencyList[ind1].color = "red";
                      network = rebuildNetwork(
                        network,
                        container,
                        options,
                        nodesArray
                      );
                      unHighlightCodeLine(5);
                      highlightCodeLine(6);
                      highlightCodeLine(7);
                      unHighlightCodeLine(8);
                      if (!adjacencyList[ind1].visited) {
                        setTimeout(
                          function() {
                            highlightCodeLine(8);
                            stack.push(adjacencyList[ind1]);
                            appendToStack(adjacencyList[ind1].label);
                          },
                          1000
                        );
                      }
                    },
                    2000 + ind1 * parseFloat(9800) / adjacencyList.length
                  );
                })(index1);
              }
            }
          }
        },
        12000 * ind
      );
    })(index);
  }
}

function getDFSPath(root) {
  let stack = [root];
  let numberOfQueueIterations = 0;
  let path = [root];
  while (stack.length > 0) {
    let u = stack.pop();
    if (!u.visited) {
      u.visited = true;
      let adjacencyList = u.adjacencyList;
      for (let i = 0; i < adjacencyList.length; i++) {
        if (!adjacencyList[i].visited) {
          stack.push(adjacencyList[i]);
          path.push(adjacencyList[i]);
        }
      }
    }
    numberOfQueueIterations++;
  }
  return { path: path, iter: numberOfQueueIterations };
}

function appendToStack(text) {
  const tr = "<tr><th>" + text + "</th></tr>";
  $("#stack").prepend(tr);
}

function removeFromStack() {
  $("#stack").find("tr:first").remove();
}
