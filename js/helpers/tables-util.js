function appendElementToTv(label) {
  $("#tv-line").append(
    "<td style='text-align: center' id='tv-" + label + "'>" + label + "</td>"
  );
}

function appendElementToNtv(label) {
  $("#ntv-line").append(
    "<td style='text-align: center' id='ntv-" + label + "'>" + label + "</td>"
  );
}

function removeElementFromNtv(label) {
  $("#ntv-" + label).remove();
}
