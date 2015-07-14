// Control bindings
d3.selectAll('input[name="day"]').on("change", function() {
	redraw();
	pauseAutoplay();
});

d3.select('input[name="time"]').on("change", function() {
	pauseAutoplay();
	updateTimeLabel();
	redraw();
});

d3.select('input[name="time"]').on("input", function() {
	pauseAutoplay();
	updateTimeLabel();
	redraw();
});

d3.selectAll('input[name="direction"]').on("change", function() {
	// Do not pause autoplay on commuter flow change, just redraw
	redraw();
});

// Updates the position of the time label on the range control
function updateTimeLabel() {
	var time = d3.select('input[type="range"]').node().value.toString();
	d3.select('#current-time').text(time + ":00").style({
		"margin-left": function() {
			var margin = time * 3.5;
			if (margin > 83) margin = 83; // max
			return margin + '%';
		}
	})
}