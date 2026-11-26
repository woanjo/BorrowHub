
<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['staff'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'No staff member is currently logged in.'
    ]);
    exit;
}

$staff = $_SESSION['staff'];

echo json_encode([
    'success' => true,
    'message' => 'Logged-in staff retrieved successfully.',
    'user' => [
        'staff_id' => $staff['staff_id'],
        'firstname' => $staff['firstname'],
        'lastname' => $staff['lastname'],
        'name' => trim($staff['firstname'] . ' ' . $staff['lastname']),
        'email_address' => $staff['email_address'],
        'role' => $staff['role']
    ]
]);
