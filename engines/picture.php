<?php
$root_path = $_SERVER['DOCUMENT_ROOT'];
require_once("${root_path}/utils/defines.php");

if (!$_GET['name']) {
  echo "Missing Argument 'name'.";
  exit(1);
}

$query_name = $_GET['name'];
echo json_encode($res);
exit(0);
?>
