const assert = require("assert");
const huffman = require("../../js/huffman/huffman-helper.js");

describe('huffman-helper', function(){
    describe('#findSmallestTwoNodes()', function(){
        it('should return two nodes with the smallest label values', function(){
            let firstNode = new huffman.Node();
            let secondNode = new huffman.Node();
            let thirdNode = new huffman.Node();
            firstNode.id = 0;
            secondNode.id = 1;
            thirdNode.id = 2;
            firstNode.weight = -2;
            secondNode.weight = -3;
            thirdNode.weight = 5;
            assert.deepEqual({firstMin : secondNode, secondMin : firstNode},
                huffman.findSmallestTwoNodes([firstNode, secondNode, thirdNode]));
        });
    });
});

describe('huffman-helper', function(){
    describe('#buildHuffmanTree()', function(){
        it('should return the tree constructed from a string', function(){
            const str = "abcd";
            assert.deepEqual(7, huffman.buildHuffmanTree(str).nodes.length);
        });
    });
});
