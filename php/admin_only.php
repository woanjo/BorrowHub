
<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['staff'])) {
    http_response_code(401);
    exit('Please log in first.');
}

if (strtolower(trim($_SESSION['staff']['role'] ?? '')) !== 'admin') {
    http_response_code(403);
    exit('Access Denied. Admin access only.');
}
