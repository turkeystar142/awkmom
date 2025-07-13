<?php
$files = glob('images/*.{png,jpg,jpeg,gif,webp}', GLOB_BRACE);
$files = array_map('basename', $files);
header('Content-Type: application/json');
echo json_encode($files);
?>