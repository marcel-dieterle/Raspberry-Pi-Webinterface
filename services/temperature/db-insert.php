<?php
	header('Content-Type: application/json');

	set_include_path('/var/www/');
	require_once 'includes/get_db.php';
	require_once 'services/temperature/get-sensor-value.php';

	$sensors = get_temperature();

	foreach ($sensors as $key => $value) {
		$temp = $value["value"];
		if(is_numeric($temp)){
			$insert = $db->exec('INSERT INTO temperatures (sensorid,degree,timestamp) VALUES ("' . $key . '", "' . $temp . '",datetime(CURRENT_TIMESTAMP, "localtime"))');	
		}
	}
	

	if($insert){
		$response = array('success' => true);
	}else{
		$response = array('success' => false);
	}

	echo json_encode($response);
?>