<?php
	ini_set('display_errors', 1);
	error_reporting(~0);

	header('Content-Type: application/json');

	$baseUrl = "http://INSERT-IP-HERE/api/YOUR-HUE-ID";
	$data = "";

	switch($_GET["action"]){
		case "toggle-light":
			$url = $baseUrl . "/lights/" . $_GET["light-id"] . "/state";
			$method = "PUT";
			$data = json_encode(
			    array(
			        'on' => filter_var($_GET["light-state"], FILTER_VALIDATE_BOOLEAN)
			    )
			);
		break;
		case "get-lights":
			$url = $baseUrl . "/lights";
			$method = "GET";
		break;
		case "get-scenes":
			$url = $baseUrl . "/scenes";
			$method = "GET";
		break;
		case "set-scene":
			$url = $baseUrl . "/groups/0/action";
			$method = "PUT";
			$data = json_encode(
				array("scene" => $_GET["scene-id"])
			);
		break;
		case "set-color":
			$url = $baseUrl . "/lights/" . $_GET["light-id"] . "/state";
			$method = "PUT";

			$data = json_encode(
				array(
					"on" => true,
					"xy" => array((float)$_GET["x"], (float)$_GET["y"]),
					"bri" => 254
				)
			);

			print_r($data);
		break;
		default:
			exit;
		break;
	}

	$response = do_request($url,$method,$data);
	echo $response;

	function do_request($url, $method, $data){
		$result = file_get_contents(
		    $url, 
		    false, 
		    stream_context_create(array(
		        'http' => array(
		            'method'  => $method,
		            'header'  => 'Content-type: application/json',
		            'content' => $data
		        )
		    ))
		);
		
		return $result;
	}
?>