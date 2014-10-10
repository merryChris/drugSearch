<?php
$root_path = $_SERVER['DOCUMENT_ROOT'];
require_once("${root_path}/utils/defines.php");
require_once("${root_path}/utils/pdo.php");

if (!$_GET['dfi']) {
  echo "Missing Argument 'name'.";
  exit(1);
}

if (empty($_GET['dfi'])) {
  echo "The Drug Doesn't Exist.";
  exit(1);
}

$query_id = $_GET['dfi'];

$pdo = PdoAdapter::getInstance();
$sql = "SELECT id, manual_id, contradication, drug_components, info, major_function, ".
       "indication, name, approval_num, properties, store, untoward_reaction, usages, validity ".
       "FROM drug_function_info ".
       "WHERE id='$query_id';";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$len  = $stmt->rowCount();

if ($len == 0) {
  echo "balaba";
  exit(2);
} else {
  $res = $stmt->fetchall(PDO::FETCH_ASSOC);
  echo json_encode($res);
  exit(0);
}
?>
