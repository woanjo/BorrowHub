
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

    $votersId = trim($data['voters_id'] ?? '');
    $firstName = trim($data['firstname'] ?? '');
    $middleName = trim($data['middlename'] ?? '');
    $lastName = trim($data['lastname'] ?? '');
    $contact = trim($data['contactnumber'] ?? '');
    $email = trim($data['email'] ?? '');
    $purok = filter_var($data['purok'] ?? null, FILTER_VALIDATE_INT);
    $street = trim($data['street_address'] ?? '');

    if (
        !ctype_digit($votersId) ||
        $votersId === '' ||
        $firstName === '' ||
        $lastName === '' ||
        $contact === '' ||
        $street === '' ||
        $purok === false ||
        $purok < 1 ||
        $purok > 5
    ) {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Please provide all required borrower information.'
        ]);
        exit;
    }

    $pdo->beginTransaction();

    // Generate a unique Borrower ID.
    $codeStmt = $pdo->query("
        SELECT 'BRG-BOR-2026-' ||
               LPAD(
                   (COALESCE(MAX(borrower_id), 0) + 1)::TEXT,
                   4,
                   '0'
               ) AS borrower_code
        FROM public.borrower
    ");

    $borrowerCode = $codeStmt->fetchColumn();

    // Insert the borrower.
    $sql = "
        INSERT INTO public.borrower (
            voters_id,
            borrower_code,
            firstname,
            middlename,
            lastname,
            contactnumber,
            email,
            purok,
            street_address
        )
        VALUES (
            :voters_id,
            :borrower_code,
            :firstname,
            :middlename,
            :lastname,
            :contactnumber,
            :email,
            :purok,
            :street_address
        )
        RETURNING borrower_id, borrower_code
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':voters_id' => (int) $votersId,
        ':borrower_code' => $borrowerCode,
        ':firstname' => $firstName,
        ':middlename' => $middleName !== '' ? $middleName : null,
        ':lastname' => $lastName,
        ':contactnumber' => $contact,
        ':email' => $email,
        ':purok' => $purok,
        ':street_address' => $street
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Borrower registered successfully.',
        'borrower' => [
            'key' => (string) $result['borrower_id'],
            'id' => $result['borrower_code']
        ]
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log('Add borrower error: ' . $e->getMessage());

    http_response_code(500);

    $message = 'Unable to register borrower. Please check the information.';

    if ($e->getCode() === '23505') {
        $message = 'This Voters ID is already registered.';
        http_response_code(409);
    }

    echo json_encode([
        'success' => false,
        'message' => $message
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
