<?php
class PdoAdapter {
  const DSN   = 'mysql:dbname=drugdb;host=10.214.192.66';
  const UNAME = 'root';
  const PWD   = 'zju601';

  // Singleton instance
  private static $instance;

  private function __construct() { }

  public static function getInstance() {
    if (!self::$instance) {
      try {
        self::$instance = new PDO(self::DSN, self::UNAME, self::PWD, array(PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8"));
      } catch (PDOException $e) {
        echo "ERROR FROM PDOADPTER:".$e->getMessage();
      }
    }

    return self::$instance;
  }
}
?>
