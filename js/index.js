var rangeSlider = $('#slider-range')[0];

noUiSlider.create(rangeSlider, {
    start: [ 10 ],
    step: 1,
    range: {
        'min': [  1 ],
        'max': [ 30 ]
    }
});

var rangeSliderValueElement = $('#slider-range-value')[0];

rangeSlider.noUiSlider.on('update', function( values, handle ) {
    rangeSliderValueElement.innerHTML = values[handle];
});
