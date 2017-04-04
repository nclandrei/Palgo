const assert = require("assert");

describe('dfs', function(){
    describe('#getDFSPath(root)', function(){
        it('should return the path when running the depth-first search algorithm', function(){
            let fourthLeaf = {
                id: 4,
                label: 5,
                adjacencyList: [],
                visited: false
            };
            let thirdLeaf = {
                id: 3,
                label: 4,
                adjacencyList: [],
                visited: false
            };
            let firstLeaf = {
                id: 1,
                label: 3,
                adjacencyList: [fourthLeaf],
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
            fourthLeaf.predecessor = firstLeaf;
            const path = getDFSPath(rootNode).path;
            assert.deepEqual([1, 3, 2, 4, 5],
                [path[0].label, path[1].label, path[2].label, path[3].label, path[4].label]);
        });
    });
});

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
