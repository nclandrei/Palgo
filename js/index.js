let rangeSlider = $('#slider-range')[0];

noUiSlider.create(rangeSlider, {
    start: [ 10 ],
    step: 1,
    range: {
        'min': [  5 ],
        'max': [ 50 ]
    },
    format: wNumb({
        decimals: 0
    })
});


let rangeSliderValueElement = $('#slider-range-value')[0];

rangeSlider.noUiSlider.on('update', function( values, handle ) {
    rangeSliderValueElement.innerHTML = values[handle];
});
