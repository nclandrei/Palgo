function highlightCodeLine(number) {
    $('#line-' + number).css('color', 'red');
}

function unHighlightCodeLine(number) {
    $('#line-' + number).css('color', '#3f51b5');
}

function unHighlightAllCodeLines() {
    for (var i = 0; i < 10; i++) {
        unHighlightCodeLine(i);
    }
}

function highlightMultipleCodeLines(array) {
    for (var i = 0; i < array.length; i++) {
        highlightCodeLine(array[i]);
    }
}
