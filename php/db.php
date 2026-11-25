<?php
// db.php — Shared Neon PostgreSQL Connection for BorrowHub

$host       = 'ep-shy-pine-bioo9xut.c-5.ap-southeast-1.aws.neon.tech';
$port       = '5432';
$dbname     = 'borrowhub';
$endpointId = 'ep-shy-pine-bioo9xut';

// Connecting as the restricted Staff role (demonstrates RBAC in your prototype)
$username   = 'borrowhub_staff';
$password   = 'BorrowHub_Staff#2026!';

$dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require;options='endpoint={$endpointId}'";

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}