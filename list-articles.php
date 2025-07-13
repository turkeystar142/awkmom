<?php
$files = glob('articles/*.txt');
$files = array_map('basename', $files);
header('Content-Type: application/json');
echo json_encode($files);
?>