function getScaleFreeNetwork(nodeCount) {
    var nodes = [];
    var edges = [];
    var connectionCount = [];

    for (var i = 0; i < nodeCount; i++) {
        nodes.push({
            id: i,
            label: String(i),
            root: false,
            color: '#009688',
            font: {
                color: '#fff'
            },
            visited: false,
            adjacencyList: [],
            predecessor: null,
            fixed: true
        });
    }

    for (i = 0; i < nodeCount; i++) {
        connectionCount[i] = 0;
        if (i == 1) {
            var from = 0;
            var to = i;
            nodes[from].adjacencyList.push(nodes[to]);
            edges.push({
                from: from,
                to: to
            });
            connectionCount[from]++;
            connectionCount[to]++;
        }
        else if (i > 1) {
            var conn = edges.length * 2;
            var rand = Math.floor(Math.random() * conn);
            var cum = 0;
            var j = 0;
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
            }
            else {
                nodes[j].adjacencyList.push(nodes[i]);
            }
            connectionCount[from]++;
            connectionCount[to]++;
        }
    }

    return {nodes:nodes, edges:edges};
}

function getFreeScaleNetworkWithWeights(nodeCount) {
    var data = getScaleFreeNetwork(nodeCount);
    var edges = data.edges;
    for (var i = 0; i < edges.length; i++) {
        edges[i].label = Math.floor(Math.random() * 300 + 50);
    }
    return {nodes:data.nodes, edges:edges};
}