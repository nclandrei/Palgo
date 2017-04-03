const Vis = require("vis");

function getScaleFreeNetwork(nodeCount) {
  let nodes = [];
  let edges = [];
  let connectionCount = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: String(i),
      root: false,
      color: "#009688",
      font: {
        color: "#fff"
      },
      visited: false,
      adjacencyList: [],
      predecessor: null,
      fixed: true
    });
  }

  for (let i = 0; i < nodeCount; i++) {
    connectionCount[i] = 0;
    if (i === 1) {
      const from = 0;
      const to = i;
      nodes[from].adjacencyList.push(nodes[to]);
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    } else if (i > 1) {
      const conn = edges.length * 2;
      const rand = Math.floor(Math.random() * conn);
      let cum = 0;
      let j = 0, from;
      while (j < connectionCount.length && cum < rand) {
        cum += connectionCount[j];
        j++;
      }
      from = i;
      to = j;
      edges.push({
        from: from,
        to: to
      });
      if (i < j) {
        nodes[i].adjacencyList.push(nodes[j]);
      } else {
        nodes[j].adjacencyList.push(nodes[i]);
      }
      connectionCount[from]++;
      connectionCount[to]++;
    }
  }

  return { nodes: nodes, edges: edges };
}

function getFreeScaleNetworkWithWeights(nodeCount) {
  let data = getScaleFreeNetwork(nodeCount);
  let edges = data.edges;
  for (let i = 0; i < edges.length; i++) {
    edges[i].label = Math.floor(Math.random() * 300 + 50);
  }
  return { nodes: data.nodes, edges: edges };
}

function rebuildNetwork(network, container, options, nodes) {
  const data = {
    nodes: nodes,
    edges: network.body.data.edges
  };

  network.destroy();
  network = new Vis.Network(container, data, options);
  return network;
}

function editEdgeCustom(network, data, callback) {
  $("#edge-label-text").removeClass("is-empty");
  $("#edge-label").val(data.label);
  document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(
    this,
    network,
    data,
    callback
  );
  document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(
    this,
    callback
  );
  document.getElementById("close-x").onclick = cancelEdgeEdit.bind(
    this,
    callback
  );
  $("#edge-popUp").css("display", "block");
}

function clearEdgePopUp() {
  $("#edge-saveButton").click(null);
  $("#edge-cancelButton").click(null);
  $("#close-x").click(null);
  $("#edge-popUp").css("display", "none");
}

function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}

function saveEdgeData(network, data, callback) {
  const fromNode = network.body.data.nodes.get().filter(function(x) {
    return x.id === data.from;
  });
  const toNode = network.body.data.nodes.get().filter(function(x) {
    return x.id === data.to;
  });
  fromNode[0].adjacencyList.push(toNode[0]);
  if (typeof data.to === "object") {
    data.to = data.to.id;
  }
  if (typeof data.from === "object") {
    data.from = data.from.id;
  }
  data.label = $("#edge-label").val();
  clearEdgePopUp();
  callback(data);
}

function editNodeCustom(network, data, callback) {
  const nodeInData = network.body.data.nodes.get().filter(function(x) {
    return x.id === data.id;
  });
  data.adjacencyList = nodeInData[0].adjacencyList;
  if (data.root) {
    $("#node-root-checkbox").prop("checked", true);
  } else {
    $("#node-root-checkbox").prop("checked", false);
  }
  $("#node-label-text").removeClass("is-empty");
  $("#node-label").val(data.label);
  document.getElementById("node-saveButton").onclick = saveNodeData.bind(
    this,
    network,
    data,
    callback
  );
  document.getElementById("node-cancelButton").onclick = cancelNodeEdit.bind(
    this,
    callback
  );
  document.getElementById("close-x1").onclick = cancelNodeEdit.bind(
    this,
    callback
  );
  $("#node-popUp").css("display", "block");
}

function clearNodePopUp() {
  $("#node-saveButton").click(null);
  $("#node-cancelButton").click(null);
  $("#close-x1").click(null);
  $("#node-popUp").css("display", "none");
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(network, data, callback) {
  data.label = parseInt($("#node-label").val());
  data.root = $("#node-root-checkbox").prop("checked");
  if (!checkIfLabelExists(data.label, network.body.data.nodes.get())) {
    clearNodePopUp();
    $("#n-label-text").text("Change node label");
    callback(data);
  } else {
    $("#node-label-text").addClass("has-error");
    $("#n-label-text").text("Label already exists - please input another one");
  }
}

function resetWholeNetwork(network, container, options) {
  let nodes = network.body.data.nodes.get();

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].color = "#009688";
    nodes[i].root = false;
    nodes[i].visited = false;
    nodes[i].adjacencyList.map(function(x) {
      x.visited = false;
      return x;
    });
    nodes[i].predecessor = null;
  }

  let data = {
    nodes: nodes,
    edges: network.body.data.edges.get()
  };

  network.destroy();
  network = new Vis.Network(container, data, options);
  return network;
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

function getEdgeWeight(nodeOne, nodeTwo) {
  const edgeBetweenNodes = network.body.data.edges.get().filter(function(x) {
    return x.from === nodeOne.id && x.to === nodeTwo.id;
  });
  return parseInt(edgeBetweenNodes[0].label);
}
