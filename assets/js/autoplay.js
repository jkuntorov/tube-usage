// Define days and times arrays
var allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var allTimes = [
	"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
	"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
	"20", "21", "22", "23", "24"
];

// Autoplay state variables
var paused = true;
var autoplayDuration = 900;
var autoplayStartDay;
var autoplayStartTime;
var autoplayStartDirection;

// Main function
function autoplay() {
	setTimeout(function () {
		if (visualiseNext() == true) {
			autoplay();
		} else {
			return false;
		}
	}, autoplayDuration);
}

// Visualise the next time or day
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

// Check if the user has touched the controls
function inputChanged() {
	var changes = false;
	if (paused) return true;
	return changes;
}

// Update the UI to reflect the redrawn visualisation,
// triggered by the autoplay
function updateInputControls() {
	d3.select('input[name="day"]:checked').property("checked", false);
	d3.selectAll('input[name="day"]').each(function(d){ 
		if(d3.select(this).property("value") == day) 
		d3.select(this).node().checked = true;
	});
	
	d3.select('input[type="range"]').node().value = time;
	updateTimeLabel();
}

// Autoplay UI control binding
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

// Update state of UI control button
function updatePlayButton() {
	if (paused == true) {
		d3.select("#autoplay").attr("class","paused");
		d3.select("#autoplay span").text("Start");
	} else {
		d3.select("#autoplay").attr("class", "playing");
		d3.select("#autoplay span").text("Pause");
	}
}

// Update the UI button when paused
function pauseAutoplay() {
	if (paused == false) {
		paused = true;
		updatePlayButton();
	}
}