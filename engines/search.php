<?php
$root_path = $_SERVER['DOCUMENT_ROOT'];
require_once("${root_path}/utils/defines.php");
require_once("${root_path}/utils/pdo.php");

if (!$_GET['name']) {
  echo "Missing Argument 'name'.";
  exit(1);
}

$query_name = $_GET['name'];
$query_ncnt = $_GET['needCounter'];
$query_page = $_GET['pageId'];
$start_id   = $query_page * $RESULT_TO_SHOW_PER_PAGE;

$pdo  = PdoAdapter::getInstance();
$sql1 = "SELECT count(*) AS counter ".
        "FROM drug_approve_info ".
        "WHERE name like '%$query_name%';";
$sql2 = "SELECT id, name, approval_num, company_name ".
        "FROM drug_approve_info ".
        "WHERE name like '%$query_name%' ".
        "LIMIT $start_id, $RESULT_TO_SHOW_PER_PAGE;";

$stmt = $pdo->prepare($sql2);
$stmt->execute();
$len  = $stmt->rowCount();

if ($len == 0) {
  echo "balaba";
  exit(2);
} else {
  $res = $stmt->fetchall(PDO::FETCH_ASSOC);
  $res['length'] = $len;
  if ($query_ncnt == true) {
    $stmt = $pdo->query($sql1);
    $res['unit']    = $RESULT_TO_SHOW_PER_PAGE;
    $res['counter'] = $stmt->fetch(PDO::FETCH_ASSOC)['counter'];
  }
  echo json_encode($res);
  exit(0);
}
?>
