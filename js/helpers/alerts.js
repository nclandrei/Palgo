function createAlert(alertText) {
    const alert = "<div id='customAlert' class='alert alert-dismissible alert-danger'> <button type='button' class='close' data-dismiss='alert'> x </button> <strong>Oh snap!</strong> " + alertText + ' </div>';
    $('#algo-panel').prepend(alert);
}

function alertUserThatNoRoot() {
    return "<div class='alert alert-dismissible alert-info'> \
    <button type='button' class='close' data-dismiss='alert'>x</button> \
    <strong>Heads up!</strong> You have not selected any \
    root node, so the first node will be automatically set as root. \
    </div>";
}

function checkIfLabelExists (label, nodes) {
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
        if (label === nodes[i].label) {
            return true;
        }
    }
    return false;
}
