
<?php
$host = "10.214.192.66";
$db = "drugdb";
$username = "root";
$password = "zju601";
if (!$_GET['name']) {
    echo "miss argument 'name'";
    exit(0);
}
$name = $_GET['name'];
//if (!$_GET['base']) {
    $base = 0;
//} else {
//    $base = $_GET['base'];
//}
$interval = 10;
$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $username, $password);
$stmt = $pdo->query("SELECT count(*) AS _count ".
        "FROM drug_approve_info ".
        "WHERE name like '%$name%';");
$count = $stmt->fetch(PDO::FETCH_ASSOC)['_count'];
if ($count != 0 && $base >= $count) {
    echo "balaba";
    exit(0);
}
$stmt = $pdo->query("SELECT id, name, approval_num, company_name ".
        "FROM drug_approve_info ".
        "WHERE name like '%$name%' ".
        "LIMIT $base, $interval;");
$length = $stmt->rowCount();
$drugs = $stmt->fetchall(PDO::FETCH_ASSOC);
$drugs['count'] = $count;
$drugs['length'] = $length;
echo json_encode($drugs);
?>
