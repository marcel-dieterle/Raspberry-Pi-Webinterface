<?php
	require_once 'includes/get_db.php';
	require_once 'includes/config.php';

	function get_temperature(){
		$output = array();

		foreach($GLOBALS["sensors"] as $sensor){
			$temp = exec("cat /sys/bus/w1/devices/" . $sensor . "/w1_slave |grep t=");
			$temp = explode('t=',$temp);
			$temp = $temp[1] / 1000;
			$temp = round($temp,1);

			$devicename = get_device_name($sensor);
			
			$output[$sensor]["value"] = $temp;
			$output[$sensor]["devicename"] = $devicename;
		}
		return $output;
	}

	function get_device_name($deviceid){
		$devicename = $GLOBALS["db"]->querySingle('SELECT devicename FROM devices WHERE deviceid = "' . $deviceid . '"');
		return $devicename;
	}
?>