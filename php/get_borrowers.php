
<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['staff'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Please log in first.'
    ]);

    exit;
}

require_once __DIR__ . '/db.php';

try {
    $sql = "
        SELECT
            borrower_id,
            voters_id,
            borrower_code,
            firstname,
            middlename,
            lastname,
            contactnumber,
            email,
            purok,
            street_address,
            proof_of_residency,
            standing_status,
            completed_borrowings,
            registered_at
        FROM public.borrower
        ORDER BY borrower_id DESC
    ";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $borrowers = [];

    foreach ($rows as $row) {
        $fullName = trim(
            $row['firstname'] . ' ' .
            ($row['middlename'] ?? '') . ' ' .
            $row['lastname']
        );

        $borrowers[] = [
            'key' => (string) $row['borrower_id'],
            'id' => $row['borrower_code'],
            'votersId' => $row['voters_id'],
            'name' => $fullName,
            'contact' => $row['contactnumber'],
            'email' => $row['email'],
            'purok' => (int) $row['purok'],
            'street' => $row['street_address'],
            'proof' => $row['proof_of_residency'],
            'status' => $row['standing_status'],
            'completed' => (int) $row['completed_borrowings'],
            'registered' => $row['registered_at']
        ];
    }

    echo json_encode([
        'success' => true,
        'borrowers' => $borrowers
    ]);

} catch (PDOException $e) {
    error_log('Get borrowers error: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to retrieve borrower records.'
    ]);
}