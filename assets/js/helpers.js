// Geographic helper functions
Math.radians = function(degrees) {
	// Converts from degrees to radians.
	return degrees * Math.PI / 180;
};
 
Math.degrees = function(radians) {
	// Converts from radians to degrees.
	return radians * 180 / Math.PI;
};

function convertSphericalToCartesian(latitude, longitude) {
	// Converts spherical coordinates to cartesian
	var earthRadius = 6367; //radius in km
	var lat = Math.radians(latitude);
	var lon = Math.radians(longitude);
	var x = earthRadius * Math.cos(lat) * Math.cos(lon);
	var y = earthRadius * Math.cos(lat) * Math.sin(lon);
	return {x: y + 45, y: x - 3944};
}

// Helper function for accessing commuter counts in the dataset
function numberOfPeople(circleData, day, time, direction) {
	if (circleData[day] == undefined) {
		return 0;
	} else if (circleData[day][time] == undefined) {
		return 0;
	} else {
		return circleData[day][time][direction];
	}
}