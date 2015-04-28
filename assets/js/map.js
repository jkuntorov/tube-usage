var londonLatitude = 51.557351;
var londonLongtitude = -0.1737575;
var stations_KML_URL = 'http://www.tfl.gov.uk/cdn/static/cms/documents/stations.kml';

function initialize() {
	// Create the map
	var mapOptions = {
		center: { lat: londonLatitude, lng: londonLongtitude},
		zoom: 11,
		disableDefaultUI: true
	};
	
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);

	// Overlay the map with the tube stations layer
	var stationsKML = new google.maps.KmlLayer({
		url: stations_KML_URL,
		options: {preserveViewport: true}
	});

	stationsKML.setMap(map);

	// Make the map light grey
	mapStyles = [{"stylers": [
			{ "visibility": "simplified" },
			{ "color": "#fafafa" }
		]
	}];

	map.setOptions({styles: mapStyles});

	// Limit the boundaries
	var boundsSW = new google.maps.LatLng(51.431752, -0.443573);
	var boundsNE = new google.maps.LatLng(51.646998, 0.09201);
	var allowedBounds = new google.maps.LatLngBounds(boundsSW, boundsNE);

	function checkBounds(allowedBounds) {
		if(!allowedBounds.contains(map.getCenter())) {
			var C = map.getCenter();
			var X = C.lng();
			var Y = C.lat();

			var AmaxX = allowedBounds.getNorthEast().lng();
			var AmaxY = allowedBounds.getNorthEast().lat();
			var AminX = allowedBounds.getSouthWest().lng();
			var AminY = allowedBounds.getSouthWest().lat();

			if (X < AminX) {X = AminX;}
			if (X > AmaxX) {X = AmaxX;}
			if (Y < AminY) {Y = AminY;}
			if (Y > AmaxY) {Y = AmaxY;}

			map.setCenter(new google.maps.LatLng(Y,X));
		}
	}
	
	google.maps.event.addListener(map,'center_changed',function() {
		checkBounds(allowedBounds);
	});

	// Limit the zoom level	
	var minZoomLevel = 11;
	var maxZoomLevel = 13;

	google.maps.event.addListener(map, 'zoom_changed', function() {
		if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
		if (map.getZoom() > maxZoomLevel) map.setZoom(maxZoomLevel);
	});
}


google.maps.event.addDomListener(window, 'load', initialize);