var heatmapYellow = "#ffce00";
var heatmapRed = '#ba0000';
var mainColor = "#ff0000"; // red, to be shaded
var hoverColor = "#000";
var circleOpacity = 0.7;

// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

var earthRadius = 6367; //radius in km
function convertSphericalToCartesian(latitude, longitude) {
	var lat = Math.radians(latitude);
	var lon = Math.radians(longitude);
	var x = earthRadius * Math.cos(lat) * Math.cos(lon);
	var y = earthRadius * Math.cos(lat) * Math.sin(lon);
	return {x: y + 45, y: x - 3944};
}

function shadeColor(color, shade) {
	var colorInt = parseInt(color.substring(1),16);

	var R = (colorInt & 0xFF0000) >> 16;
	var G = (colorInt & 0x00FF00) >> 8;
	var B = (colorInt & 0x0000FF) >> 0;

	R = R + Math.floor((shade/255)*R);
	G = G + Math.floor((shade/255)*G);
	B = B + Math.floor((shade/255)*B);

	var newColorInt = (R<<16) + (G<<8) + (B);
	var newColorStr = "#"+newColorInt.toString(16);

	return newColorStr;
}

var container;
var data;
var circles;
var colorScale;
var tip;
var day;
var time;
var direction;

d3.json("assets/js/data.json", function(error, json) {
	if (error) return console.warn(error);
	data = json;
	init();
});

function init() {
	container = d3.select("#container");

	container.transition().duration(900).attr({
		class: "animated-circles"
	});

	var canvas = container.append("svg");

	canvas.attr({
		"preserveAspectRatio": "xMidYMid",
		"viewBox": "0 0 1300 630",
	});

	/*
	// background rectangle used
	// to tweak svg viewport size
	canvas.append("rect").attr({
		width: "100%",
		height: "100%",
		fill: "#dadada"
	});
	*/

	colorScale = d3.scale.linear()
				.domain([0, d3.max(data, function (d) { return 90; })])
				// .range(["#ff0000", "#000000"]);
				.range([heatmapYellow, heatmapRed]);

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
	circles.call(tip);

	redraw();
	updateTimeLabel();
}

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
	// shoud i pause autoplay if direction is changed?
	// pauseAutoplay();
	redraw();
});

function updateTimeLabel() {
	var time = d3.select('input[type="range"]').node().value.toString();
	d3.select('#current-time').text(time + ":00").style({
		"margin-left": function() {
			var margin = time * 3.5;

			if (margin > 83) margin = 83;

			return margin + '%';
		}
	})
}

function numberOfPeople(circleData, day, time, direction) {
	if (circleData[day] == undefined) {
		return 0;
	} else if (circleData[day][time] == undefined) {
		return 0;
	} else {
		return circleData[day][time][direction];
	}
}

function redraw(checkInput) {
	// default behavious: check for changes in user input
	checkInput = typeof checkInput !== 'undefined' ? checkInput : true;

	if (checkInput) {
		day = d3.select('input[name="day"]:checked').node().value;
		time = d3.select('input[type="range"]').node().value.toString();
		direction = d3.select('input[name="direction"]:checked').node().value;

		// fix bug in which data for single digit hours is not displayed
		if (time.length == 1) {time = "0" + time;}
	}

	circles.sort(function (a, b) {	// select the parent and sort the path's
		if (numberOfPeople(a.data, day, time, direction) > numberOfPeople(b.data, day, time, direction)) return -1;				// a is not the hovered element, send "a" to the back
		else return 1;								// a is the hovered element, bring "a" to the front
	});

	circles.call(tip)

	if (circles !== undefined) {
		// circles.transition().duration(900).ease('elastic', 1, 0.75).attr({
		circles.transition().duration(900).ease('quad').attr({
		// circles.transition().duration(900).ease('linear').attr({
			fill: function(d) {
				return colorScale(numberOfPeople(d.data, day, time, direction));
			},
			"data-fill": function(d) {
				return colorScale(numberOfPeople(d.data, day, time, direction));
			},
			r: function(d) {
				var size = numberOfPeople(d.data, day, time, direction) * 0.9;
				
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
		}).style({
			"z-index": function(d) {
				return -(numberOfPeople(d.data, day, time, direction));
			}
		});
	}
}

var allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var allTimes = [
	"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
	"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
	"20", "21", "22", "23", "24"
];

var paused = true;
var autoplayDuration = 900;
var autoplayStartDay;
var autoplayStartTime;
var autoplayStartDirection;

function inputChanged() {
	var changes = false;

	if (paused) return true;

	return changes;
}

function updateInputControls() {
	d3.select('input[name="day"]:checked').property("checked", false);
	d3.selectAll('input[name="day"]').each(function(d){ 
		if(d3.select(this).property("value") == day) 
		d3.select(this).node().checked = true;
	});
	
	d3.select('input[type="range"]').node().value = time;
	updateTimeLabel();
}

function visualiseNext() {
	if (inputChanged()) return false;

	if (day == "Sun" && time == "24") {
		day = "Mon";
		time = "00";
	} else if (time == "24") {
		day = allDays[(allDays.indexOf(day) + 1)];
		time = "00";
	} else {
		time = allTimes[(allTimes.indexOf(time) + 1)];
	}

	updateInputControls();
	redraw(false);
	return true;
}

function autoplay() {
	setTimeout(function () {
		if (visualiseNext() == true) {
			autoplay();
		} else {
			return false;
		}
	}, autoplayDuration);
}

d3.select("#autoplay").on("click", function() {
	autoplayStartDay = day;
	autoplayStartTime = time;
	autoplayStartDirection = direction;

	if (paused == true) {
		paused = false;
		updatePlayButton();
		container.attr({class: ""});
		autoplay();
	} else {
		paused = true;
		updatePlayButton();
		container.attr({class: "animated-circles"});
	}
});

function updatePlayButton() {
	if (paused == true) {
		d3.select("#autoplay").attr("class","paused");
		d3.select("#autoplay span").text("Start");
	} else {
		d3.select("#autoplay").attr("class", "playing");
		d3.select("#autoplay span").text("Pause");
	}
}

function pauseAutoplay() {
	if (paused == false) {
		paused = true;
		updatePlayButton();
	}
}