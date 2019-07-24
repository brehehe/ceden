<?php

$filename = 'csc.json';

$datajson = json_decode(file_get_contents($filename), true);

$Data = [];
$StatesData = [];
$CountryData = [];
$CountryId = [];

foreach($datajson as $d){

    $CountryData[$d['iso2']] = $d;
    // $CountryData[$d['id']] = $d;
    unset($CountryData[$d['iso2']]['states']);
    // unset($CountryData[$d['id']]['states']);

    if(isset($d['states'])){
        $flnm = $d['iso2'] . '.json';
        $StatesData = [];
        $ThisStatesName = false;
        $NumberState = 1;
        $NumberCity = 1;
        foreach($d['states'] as $sk => $sv){
            // save the states data with 3 id upfront, 2 number on the last id
            $ThisStatesName = trim('1').str_pad($NumberState, 2, "0", STR_PAD_LEFT);
            if($ThisStatesName){
                $StatesData[$ThisStatesName.$d['iso2']] = [
                    'name' => $sk,
                    'sub' => []
                ];
                $NumberCity = 1;
                if(is_array($sv)){
                    foreach($sv as $v){
                        $StatesData[$ThisStatesName.$d['iso2']]['sub'][$ThisStatesName.trim('2').str_pad($NumberCity, 2, "0", STR_PAD_LEFT).$d['iso2']] = $v;
                        $NumberCity++;
                    }
                }
                $NumberState++;
            } else {
                $ThisStatesName = false;
            }
        }
        file_put_contents('state/'.$d['iso2'].'.json', json_encode($StatesData, JSON_PRETTY_PRINT));
    }
}

file_put_contents('countryName.json', json_encode($CountryData, JSON_PRETTY_PRINT));

// file_put_contents('countryID.json', json_encode($CountryData));