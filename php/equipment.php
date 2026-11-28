<?php

header('Content-Type: application/json; charset=utf-8');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

function setAuditActor(PDO $pdo): void
{
    $staffId = $_SESSION['staff']['staff_id'] ?? '';

    $stmt = $pdo->prepare(
        "SELECT set_config('app.changed_by', :staff_id, true)"
    );

    $stmt->execute([
        ':staff_id' => (string)$staffId
    ]);
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    switch ($action) {
        // 1. READ — calls public.get_equipment_list()
        case 'get':
            $stmt = $pdo->query("
                SELECT
                    equipment_id,
                    category_id,
                    categoryname,
                    equipmentname,
                    description,
                    quantity,
                    status
                FROM public.get_equipment_list()
            ");
            $equipment = $stmt->fetchAll();

            $catStmt = $pdo->query("
                SELECT category_id, categoryname
                FROM public.equipment_category
                ORDER BY categoryname ASC
            ");
            $categories = $catStmt->fetchAll();

            echo json_encode([
                'success'    => true,
                'equipment'  => $equipment,
                'categories' => $categories
            ]);
            break;

        // 2. CREATE — calls public.add_equipment()
        case 'add':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
                exit;
            }

            $categoryId    = isset($_POST['category_id']) ? (int) $_POST['category_id'] : null;
            $equipmentName = trim($_POST['equipmentname'] ?? '');
            $description   = trim($_POST['description'] ?? '');
            $quantity      = isset($_POST['quantity']) ? (int) $_POST['quantity'] : null;
            $status        = trim($_POST['status'] ?? 'Available');

            $pdo->beginTransaction();

            setAuditActor($pdo);

            $stmt = $pdo->prepare("
                CALL public.add_equipment(
                    :category_id,
                    :equipmentname,
                    :description,
                    :quantity,
                    :status,
                    NULL
                )
            ");

            $stmt->execute([
                ':category_id'   => $categoryId,
                ':equipmentname' => $equipmentName,
                ':description'   => $description === '' ? null : $description,
                ':quantity'      => $quantity,
                ':status'        => $status
            ]);

            $result = $stmt->fetch();
            echo json_encode([
                'success'          => true,
                'new_equipment_id' => $result['p_new_equipment_id'] ?? null,
                'message'          => 'Equipment added successfully.'
            ]);
            break;

            $pdo->commit();

        // 3. UPDATE — calls public.update_equipment()
        case 'update':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
                exit;
            }

            $equipmentId   = isset($_POST['equipment_id']) ? (int) $_POST['equipment_id'] : null;
            $categoryId    = isset($_POST['category_id']) && $_POST['category_id'] !== '' ? (int) $_POST['category_id'] : null;
            $equipmentName = isset($_POST['equipmentname']) ? trim($_POST['equipmentname']) : null;
            $description   = isset($_POST['description']) ? trim($_POST['description']) : null;
            $quantity      = isset($_POST['quantity']) && $_POST['quantity'] !== '' ? (int) $_POST['quantity'] : null;
            $status        = isset($_POST['status']) && $_POST['status'] !== '' ? trim($_POST['status']) : null;

            $stmt = $pdo->prepare("
                CALL public.update_equipment(
                    :equipment_id,
                    :category_id,
                    :equipmentname,
                    :description,
                    :quantity,
                    :status
                )
            ");
            $stmt->execute([
                ':equipment_id'  => $equipmentId,
                ':category_id'   => $categoryId,
                ':equipmentname' => $equipmentName,
                ':description'   => $description,
                ':quantity'      => $quantity,
                ':status'        => $status
            ]);

            echo json_encode([
                'success' => true,
                'message' => 'Equipment updated successfully.'
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or missing action parameter.'
            ]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(400);
    $cleanMessage = preg_replace('/^SQLSTATE\[[^\]]+\]:.*ERROR:\s*/s', '', $e->getMessage());
    $cleanMessage = strtok($cleanMessage, "\n");

    echo json_encode([
        'success' => false,
        'message' => $cleanMessage
    ]);
}