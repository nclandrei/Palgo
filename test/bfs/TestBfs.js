const assert = require("assert");

describe('bfs', function(){
    describe('#getBFSPath(root)', function(){
        it('should return the path when running the breadth-first search algorithm', function(){
            let thirdLeaf = {
                id: 3,
                label: 4,
                adjacencyList: [],
                visited: false
            };
            let firstLeaf = {
                id: 1,
                label: 3,
                adjacencyList: [],
                visited: false
            };
            let secondLeaf = {
                id: 2,
                label: 2,
                adjacencyList: [thirdLeaf],
                visited: false
            };
            const rootNode = {
                id: 0,
                label: 1,
                adjacencyList: [firstLeaf, secondLeaf],
                predecessor: null,
                visited: false
            };
            secondLeaf.predecessor = rootNode;
            firstLeaf.predecessor = rootNode;
            thirdLeaf.predecessor = secondLeaf;
            const path = getBFSPath(rootNode).path;
            assert.deepEqual([1, 3, 2, 4],
                [path[0].label, path[1].label, path[2].label, path[3].label]);
        });
    });
});

function getBFSPath(root) {
  let queue = [root];
  let numberOfQueueIterations = 0;
  let path = [root];
  while (queue.length > 0) {
    let u = queue.shift();
    let adjacencyList = u.adjacencyList;
    for (let i = 0; i < adjacencyList.length; i++) {
      if (!adjacencyList[i].visited) {
        adjacencyList[i].visited = true;
        adjacencyList[i].predecessor = u;
        queue.push(adjacencyList[i]);
        path.push(adjacencyList[i]);
      }
    }
    numberOfQueueIterations++;
  }
  return { path: path, iter: numberOfQueueIterations };
}
