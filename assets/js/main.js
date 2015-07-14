// Visualisation appearance variables
var heatmapYellow = "#ffce00";
var heatmapRed = '#ba0000';
var hoverColor = "#000";
var circleOpacity = 0.7;

// Global variables
var container, data, circles, colorScale, tip, day, time, direction;

// Load JSON data and initialise the visualisation
d3.json("assets/js/data.json", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	init();
});

// Initialisation process
function init() {

	// Select the container and create the canvas
	container = d3.select("#container");
	var canvas = container.append("svg");

	// Make the SVG responsive for different screen sizes
	canvas.attr({
		"preserveAspectRatio": "xMidYMid",
		"viewBox": "0 0 1300 630",
	});

	// Create a colour scale for the heatmap, from yellow to red
	colorScale = d3.scale.linear()
				.domain([0, d3.max(data, function (d) { return 90; })])
				// .range(["#ff0000", "#000000"]);
				.range([heatmapYellow, heatmapRed]);

	// Create the tooltips containing the name of the hovered station
	tip = d3.tip()
		.attr('class', 'tooltip')
		.offset([-10, 0])
		.html(function(d) {
			var commutersNumber = numberOfPeople(d.data, day, time, direction);
			var tooltipHTML = d.name + '<br /><span class="details">' + commutersNumber;
			
			if (commutersNumber > 1) {
				tooltipHTML += ' commuters ';
			} else {
				tooltipHTML += ' commuter ';
			}

			switch(direction) {
				case 'in':
					tooltipHTML += 'going in';
					break;
				case 'out':
					tooltipHTML += 'going out';
					break;
			}
			tooltipHTML += '</span class="details">';
			return tooltipHTML;
		});

	// Draw the basis for all of the circles
	circles = canvas.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr({
			cx: function(d) {return ((convertSphericalToCartesian(d.coordinates.lat, d.coordinates.lon)).x) * 20;},
			cy: function(d) {return ((convertSphericalToCartesian(d.coordinates.lat, d.coordinates.lon)).y) * 20;},
			r: 3,
			opacity: circleOpacity,
			class: "station-circle",
			name: function(d) {return d.name;},
		})
		.on('mouseover', function(d) {
			d3.select(this).attr({
				fill: hoverColor
			});
			tip.show(d);
		})
		.on('mouseout', function(d) {
			tip.hide(d);
			d3.select(this).attr({
				fill: function() {
					return d3.select(this).attr("data-fill");
				}
			});
		});
	
	// Add the tooltips to the circles
	circles.call(tip);

	// Finish drawing the circles
	redraw();

	// Update positioning of the label on the time control
	updateTimeLabel();
}

// Redraw function is called every time the dataset changes
function redraw(checkInput) {
	// Default behaviour: check for changes in user input
	checkInput = typeof checkInput !== 'undefined' ? checkInput : true;

	// Update control values
	if (checkInput) {
		day = d3.select('input[name="day"]:checked').node().value;
		time = d3.select('input[type="range"]').node().value.toString();
		direction = d3.select('input[name="direction"]:checked').node().value;

		// Fixing a bug in which data for single digit hours is not displayed
		if (time.length == 1) {time = "0" + time;}
	}

	// Sort the circles on the canvas (because z-index doesn't work with SVG)
	// Bring the smallest stations to the top and send the biggest to the back
	circles.sort(function (a, b) {
		// a is not the hovered element, send "a" to the back
		if (numberOfPeople(a.data, day, time, direction) > numberOfPeople(b.data, day, time, direction)) return -1;
		
		// a is the hovered element, bring "a" to the front
		else return 1;
	});

	// Update the tooltips
	circles.call(tip)

	// Update the properties, attributes and style of the circles and redraw.
	if (circles !== undefined) {
		// Other animations:
		// circles.transition().duration(900).ease('elastic', 1, 0.75).attr({
		// circles.transition().duration(900).ease('linear').attr({

		circles.transition().duration(900).ease('quad').attr({
			fill: function(d) {
				// The more people using the station, the darker the circle
				return colorScale(numberOfPeople(d.data, day, time, direction));
			},
			"data-fill": function(d) {
				// Include the additional fill property so that the circle colour
				// can be restored after the user has hovered on the circle
				return colorScale(numberOfPeople(d.data, day, time, direction));
			},
			r: function(d) {
				// The more people using the station, the bigger the circle's radius
				var size = numberOfPeople(d.data, day, time, direction) * 0.9;
				
				// Apply size limitations for circles
				// that are too small or too big
				if (size <= 0) {
					return 0;
				} else if (size > 0 && size < 2) {
					return size + 2;
				} else if (size > 50) {
					return size * 0.1 + 50;
				} else {
					return size;
				}
			}
		});
	}
}