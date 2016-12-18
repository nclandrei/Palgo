var Vis = require('vis');
var remote = require('remote');
var dialog = remote.require('dialog');
var fs = require('fs');

$(document).ready(function () {
    $('#submit-btn').click(function () {
        constructVisTree($('#inputText').val());
    });

    $('#random-btn').click(function () {
        var randomString = Math.random().toString(36).slice(2);
        constructVisTree(randomString);
    });

    $('#upload-btn').bind('click', function () {
        dialog.showOpenDialog(function (fileNames) {
            if (fileNames === undefined) {
                console.log("No file selected");
            } else {
                var text = readFile(fileNames[0]);
                constructVisTree(text);
            }
        });
    });
});

function readFile(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        return data;
    });
}

function constructVisTree(text) {
    var huffmanTree = buildHuffmanTree(text);
    var nodes = huffmanTree.nodes;
    var edges = huffmanTree.edges;

    // create a network
    var container = document.getElementById('tree-simple');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        autoResize: true,
        layout: {
            hierarchical: {
                enabled: true,
                parentCentralization: true,
                sortMethod: "directed"
            }
        },
        physics: {
            enabled: false
        }
    };

    var network = new Vis.Network(container, data, options);

    var positions = network.getPositions();
	
	// animation properties
	var k = 0, lambda = 0, tick = 10, totalTime = 5000;
		
	// toy example start x, y coordinates nodes
	var x_start = 0, y_start = 0
	// nr of steps, given tick time and total animation time
	var nrOfSteps = Math.floor( totalTime / tick);
	// perform moveNode every tick nr of milliseconds
	timer = setInterval(function(){
		
		// iteration counter
		k++;
		// lambda (for convex combination)
		var l = k / nrOfSteps;
		for (i = 1; i < nodes.length; i++) { 
		
			// get target positions 
			var x_target = positions[i].x;
			var y_target = positions[i].y;
			
			// compute the convex combination of x_start and x_target to find intermediate x and move node to it, same for y
			var xt = x_start * (1 - l) + x_target * l;
			var yt = y_start * (1 - l) + y_target * l;
			
			// move node
		    network.moveNode(i,xt,yt);
		}
	
		// stop if we have reached nr of steps
		if(k == nrOfSteps){
			clearInterval(timer)
		} 
	},tick);
}