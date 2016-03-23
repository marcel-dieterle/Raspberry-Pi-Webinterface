<?php 
	set_include_path('/var/www/');
	require_once 'includes/get_db.php';

	function get_device_name($deviceid){
		$devicename = $db->query('SELECT devicename FROM devices WHERE deviceid = "' . $deviceid . '"');
		echo $devicename;
		return $devicename;
	}
?>