let bfsHelper = {};

bfsHelper.appendToQueue = function(text) {
  const th = "<th>" + text + "</th>";
  $("#queue-row").append(th);
};

bfsHelper.removeFromQueue = function() {
  $("#queue-row").find("th:first").remove();
};

bfsHelper.getBFSPath = function(root) {
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
};

module.exports = bfsHelper;
