<?php
	set_include_path('/var/www/');
	require 'services/temperature/get-sensor-value.php';

	header('Content-Type: application/json');

	$temperature = get_temperature();

	echo json_encode($temperature);
?>