
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
    $data = json_decode(file_get_contents('php://input'), true);

    if (!is_array($data)) {
        throw new Exception('Invalid request data.');
    }

    $borrowerId = filter_var(
        $data['borrower_id'] ?? null,
        FILTER_VALIDATE_INT
    );

    $fullName = trim($data['name'] ?? '');
    $contact = trim($data['contactnumber'] ?? '');
    $purok = filter_var(
        $data['purok'] ?? null,
        FILTER_VALIDATE_INT
    );


    if (
        !$borrowerId ||
        $fullName === '' ||
        $contact === '' ||
        $purok === false ||
        $purok < 1 ||
        $purok > 5
    ) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide valid borrower information.'
        ]);
        exit;
    }

    // Split full name into first, middle, and last name.
    $parts = preg_split('/\s+/', $fullName);

    $firstName = array_shift($parts);
    $lastName = count($parts) > 0 ? array_pop($parts) : '';

    $middleName = implode(' ', $parts);

    if ($lastName === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Please enter both first and last name.'
        ]);
        exit;
    }

    $sql = "
        UPDATE public.borrower
        SET
            firstname = :firstname,
            middlename = :middlename,
            lastname = :lastname,
            contactnumber = :contactnumber,
            purok = :purok
        WHERE borrower_id = :borrower_id
        RETURNING borrower_id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':firstname' => $firstName,
        ':middlename' => $middleName !== '' ? $middleName : null,
        ':lastname' => $lastName,
        ':contactnumber' => $contact,
        ':purok' => $purok,
        ':borrower_id' => $borrowerId
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Borrower record not found.'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Borrower updated successfully.'
    ]);

} catch (PDOException $e) {
    error_log('Update borrower error: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to update borrower. Please try again.'
    ]);

} catch (Exception $e) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
