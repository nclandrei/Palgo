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

for (var i = 0; i < 5; i++) {
    console.log("a " + Math.random().toString(36).substring(120));
}