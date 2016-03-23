<?php
	ini_set("display_errors", 1);
	ini_set("track_errors", 1);
	ini_set("html_errors", 1);
	error_reporting(E_ALL);

	// Set the url of the calendar feed.
	$url = "apple-ical-url-here";

	// Run the helper function with the desired URL and echo the contents.
	echo file_get_contents($url);
?>