<?php
	// Display errors
	ini_set('display_errors', 1);
	error_reporting(~0);

	// Set default timezone
	date_default_timezone_set("Europe/Berlin");

	// Get and set sqlite database
	$GLOBALS["db"] = new SQLite3('/var/www/db/myHome');
?>