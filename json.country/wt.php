<?php

$filename = "country-json.json";

$dataArray = json_decode(file_get_contents($filename), true);

$dProvinces = [];
$dRegencies = [];
$DataDefault = [];

$provinces = $dataArray['provinces'];
$regencies = $dataArray['regencies'];

$NumberID = 1;
foreach ($provinces as $p) {
    $dProvinces[$p["id"]] = [
        'name' => $p['name'],
        'ID' => '1' . str_pad($NumberID, 2, '0', STR_PAD_LEFT),
        'sub' => []
    ];
    $NumberID++;
}


print '<pre>';
print json_encode($dProvinces, JSON_PRETTY_PRINT);
print '</pre>';

foreach ($regencies as $r) {
    // $DataDefault['1'.str_pad($NumberID,2,'0',STR_PAD_LEFT)]
    if (isset($dProvinces[$r['province_id']])) {
        // $dProvinces[$r['province_id']]['ID'] = $dProvinces[$r['province_id']]['ID'];
        if (!isset($DataDefault[$dProvinces[$r['province_id']]['ID'] . 'ID'])) {
            $DataDefault[$dProvinces[$r['province_id']]['ID'] . 'ID'] = [
                "name" => $dProvinces[$r['province_id']]['name'],
                "sub" => []
            ];
        }
        $DataDefault[$dProvinces[$r['province_id']]['ID'] . 'ID']['sub'][$dProvinces[$r['province_id']]['ID']
                // add number for sub
                . '2'
                // counts provinces sub
                . str_pad((count($DataDefault[$dProvinces[$r['province_id']]['ID'] . 'ID']['sub']) + 1), 2, '0', STR_PAD_LEFT) . 'ID'] = $r['name'];
    }
}

print '<pre>';
print json_encode($DataDefault, JSON_PRETTY_PRINT);
print '</pre>';

file_put_contents("state/ID.json", json_encode($DataDefault, JSON_PRETTY_PRINT));
