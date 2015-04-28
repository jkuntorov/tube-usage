<?php

define(GOOGLE_MAPS_API_KEY, 'AIzaSyBMRUAv4yG5M-zSU5DEazCOwYrwsHeIR80');

?>
<!doctype html>
<html lang="en-gb">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<title>Tube Usage</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" type="text/css" href="assets/less/styles.css">
</head>
<body>
	<div id="map"></div>
	
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php echo GOOGLE_MAPS_API_KEY; ?>"></script>
	<script type="text/javascript" src="assets/js/map.js"></script>
</body>
</html>