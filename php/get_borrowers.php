
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
    // Refresh all borrower statuses before retrieving records
    $pdo->query("SELECT fn_refresh_all_borrower_statuses()");

    // Retrieve borrower information
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

    // Retrieve borrowing history and equipment names
    $historySql = "
        SELECT
            b.borrower_id,
            b.borrowing_id,
            b.reservationdate,
            b.borrowdate,
            b.duedate,
            b.returndate,
            b.status,
            COALESCE(
                STRING_AGG(
                    DISTINCT e.equipmentname,
                    ', ' ORDER BY e.equipmentname
                ),
                'No equipment recorded'
            ) AS equipment_names
        FROM public.borrowing b
        LEFT JOIN public.borrowing_item bi
            ON b.borrowing_id = bi.borrowing_id
        LEFT JOIN public.equipment e
            ON bi.equipment_id = e.equipment_id
        GROUP BY
            b.borrower_id,
            b.borrowing_id,
            b.reservationdate,
            b.borrowdate,
            b.duedate,
            b.returndate,
            b.status
        ORDER BY b.borrowdate DESC
    ";

    $historyStmt = $pdo->query($historySql);
    $historyRows = $historyStmt->fetchAll(PDO::FETCH_ASSOC);

    // Group borrowing history by borrower ID
    $historyByBorrower = [];

    foreach ($historyRows as $history) {
        $borrowerId = (string) $history['borrower_id'];

        if (!isset($historyByBorrower[$borrowerId])) {
            $historyByBorrower[$borrowerId] = [];
        }

        $historyByBorrower[$borrowerId][] = [
            'borrowingId' => $history['borrowing_id'],
            'reservationDate' => $history['reservationdate'],
            'borrowDate' => $history['borrowdate'],
            'dueDate' => $history['duedate'],
            'returnDate' => $history['returndate'],
            'status' => $history['status'],
            'equipmentNames' => $history['equipment_names']
        ];
    }

    // Combine borrower information and borrowing history
    $borrowers = [];

    foreach ($rows as $row) {
        $fullName = trim(
            $row['firstname'] . ' ' .
            ($row['middlename'] ?? '') . ' ' .
            $row['lastname']
        );

        $borrowerId = (string) $row['borrower_id'];

        $borrowers[] = [
            'key' => $borrowerId,
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
            'registered' => $row['registered_at'],
            'history' => $historyByBorrower[$borrowerId] ?? []
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
