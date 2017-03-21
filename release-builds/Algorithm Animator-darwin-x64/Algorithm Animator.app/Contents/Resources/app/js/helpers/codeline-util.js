function highlightCodeLine(number) {
    $('#line-' + number).css('color', 'red');
}

function unHighlightCodeLine(number) {
    $('#line-' + number).css('color', '#3f51b5');
}

function highlightHeapCodeLine(func, number) {
    $('#' + func + '-line-' + number).css('color', 'red');
}

function unHighlightHeapCodeLine(func, number) {
    $('#' + func + '-line-' + number).css('color', '#3f51b5');
}

function unHighlightAllCodeLines() {
    for (var i = 0; i < 10; i++) {
        unHighlightCodeLine(i);
    }
}
