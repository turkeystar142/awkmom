<?php
header('Content-Type: application/json');

$audioDir = 'audio/';
$audioFiles = [];

if (is_dir($audioDir)) {
    $files = scandir($audioDir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..' && preg_match('/\.(mp3|wav|ogg|m4a)$/i', $file)) {
            $audioFiles[] = $file;
        }
    }
}

echo json_encode($audioFiles);
?>
