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
    $('#random-btn').click(function() {
        var simple_chart_config = {
            chart: {
                container: "#tree-simple"
            },
            nodeStructure: buildHuffmanTree("This is a very randomly generated string to be used as an example.")
        };
        new Treant(simple_chart_config);
    });
});