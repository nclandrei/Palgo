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

function unHighlightAllHeapCodeLines() {
  $("#insert-function-call").css("color", "#3f51b5");

  for (let i = 0; i < 3; i++) {
    unHighlightHeapCodeLine("insert", i);
  }

  $("#delete-function-call").css("color", "#3f51b5");

  for (let i = 0; i < 3; i++) {
    unHighlightHeapCodeLine("delete", i);
  }

  $("#impose-function-call").css("color", "#3f51b5");

  for (let i = 0; i < 2; i++) {
    unHighlightHeapCodeLine("impose", i);
  }
}

function unHighlightAllCodeLines() {
    for (let i = 0; i < 10; i++) {
        unHighlightCodeLine(i);
    }
}
