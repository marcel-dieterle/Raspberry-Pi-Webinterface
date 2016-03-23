<?php
	header('Content-Type: application/json');

	set_include_path('/var/www/');
	require_once 'includes/get_db.php';
	require_once 'includes/config.php';

	$return = array();

	$limit = isset($_GET["limit"]) ? $_GET["limit"] : 30;

	foreach ($GLOBALS["sensors"] as $sensor) {
		$result = $GLOBALS["db"]->query("SELECT * FROM temperatures WHERE sensorid = '" . $sensor . "' ORDER BY timestamp DESC LIMIT " . $limit);
		while($row = $result->fetchArray()){
		   $return['data'][$sensor][] = $row;
		}
	}	

	if($result){
		$return['success'] = true;		
	}else{
		$return['success'] = false;
	}
	
	echo json_encode($return);
?>