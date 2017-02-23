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
            predecessor: null
        });

        connectionCount[i] = 0;

        if (i == 1) {
            var from = i;
            var to = 0;
            nodes[from].adjacencyList.push(nodes[to]);
            nodes[to].adjacencyList.push(nodes[from]);
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

            var from = i;
            var to = j;
            edges.push({
                from: from,
                to: to
            });
            nodes[i].adjacencyList.push(nodes[j]);
            nodes[j].adjacencyList.push(nodes[i]);
            connectionCount[from]++;
            connectionCount[to]++;
        }
    }

    return {nodes:nodes, edges:edges};
}