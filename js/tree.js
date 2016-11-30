$(document).ready(function() {
    $('#submit-btn').click(function() {
        var simple_chart_config = {
            chart: {
                container: "#tree-simple"
            },
            nodeStructure: buildHuffmanTree($('#icon_prefix2').val())
        };
        new Treant(simple_chart_config);
    });
});

// simple_chart_config = {
//     chart : {
//         container : "#tree-simple"
//     },
//
//     nodeStructure : buildHuffmanTree("testing huffman tree building")
// };
