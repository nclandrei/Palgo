var rangeSlider = document.getElementById('slider-range');

noUiSlider.create(rangeSlider, {
	start: [ 0 ],
	range: {
		'min': [  0 ],
		'max': [ 10 ]
	}
});