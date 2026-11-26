
<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

require_once __DIR__ . '/db.php';

// Get login information from JavaScript
$data = json_decode(file_get_contents('php://input'), true);

$identifier = trim($data['identifier'] ?? '');
$password = $data['password'] ?? '';

if ($identifier === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter your username/email and password.'
    ]);
    exit;
}

try {
    // Find staff account
    $stmt = $pdo->prepare(
        'SELECT * FROM public.fn_staff_sign_in(:identifier)'
    );

    $stmt->execute([
        ':identifier' => $identifier
    ]);

    $staff = $stmt->fetch(PDO::FETCH_ASSOC);

    // TEMPORARY LOGIN DIAGNOSTICS
    error_log('Login identifier: ' . $identifier);
    error_log('Password length: ' . strlen($password));
    error_log('Staff found: ' . ($staff ? 'YES' : 'NO'));

    $passwordValid = $staff
        ? password_verify($password, $staff['password_hash'])
        : false;

    error_log('Password verification: ' .
        ($passwordValid ? 'SUCCESS' : 'FAILED'));

    // Verify password
    if (!$staff || !$passwordValid) {
        http_response_code(401);

        echo json_encode([
            'success' => false,
            'message' => 'Incorrect username/email or password.'
        ]);

        exit;
    }

    // Create PHP session
    session_regenerate_id(true);

    $_SESSION['staff'] = [
        'staff_id' => $staff['staff_id'],
        'username' => $staff['username'],
        'email_address' => $staff['email_address'],
        'firstname' => $staff['firstname'],
        'lastname' => $staff['lastname'],
        'role' => $staff['role']
    ];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'staffId' => $staff['staff_id'],
            'username' => $staff['username'],
            'name' => trim(
                $staff['firstname'] . ' ' . $staff['lastname']
            ),
            'role' => $staff['role']
        ]
    ]);

} catch (PDOException $e) {

    error_log('BorrowHub login error: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to process login. Please try again later.'
    ]);
}