<?php
    ini_set('display_errors', 1);
    error_reporting(~0);

    header('Content-Type: application/json');

    // Feed einlesen
    if( !$xml = simplexml_load_file($_GET["feedUrl"]) ) {
        die('Fehler beim Einlesen der XML Datei!');
    }
     
    // Ausgabe Array
    $out = array();
     
    // auszulesende Datensaetze
    $i = intval($_GET["count"]);
     
    // Items vorhanden?
    if( !isset($xml->channel[0]->item) ) {
        die('Keine Items vorhanden!');
    }

    // Items holen
    foreach($xml->channel[0]->item as $item) {
        if( $i-- == 0 ) {
            break;
        }
     
        $out[] = array(
            'title'        => (string) str_ireplace("news, ","",$item->title),
            'description'  => (string) $item->description,
            'link'         => (string) $item->guid,
            'date'         => date('d.m.Y H:i', strtotime((string) $item->pubDate))
        );
    }
     
    echo json_encode($out);
?>