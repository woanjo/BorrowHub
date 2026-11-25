<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    // 1. Fetch all equipment rows via your stored function
    $equipStmt = $pdo->query("
        SELECT
            equipment_id,
            category_id,
            categoryname,
            equipmentname,
            quantity,
            status
        FROM public.get_equipment_list()
    ");
    $equipmentRows = $equipStmt->fetchAll();

    // 2. Fetch all categories so every category appears in the progress bar panel
    $catStmt = $pdo->query("
        SELECT category_id, categoryname
        FROM public.equipment_category
        ORDER BY categoryname ASC
    ");
    $categoryRows = $catStmt->fetchAll();

    // 3. Aggregate KPI totals and per-category availability
    $totalEquipment       = 0;
    $availableEquipment   = 0;
    $borrowedEquipment    = 0;
    $maintenanceEquipment = 0;

    $categoryMap = [];
    foreach ($categoryRows as $cat) {
        $catId = (int) $cat['category_id'];
        $categoryMap[$catId] = [
            'name'      => $cat['categoryname'],
            'available' => 0,
            'total'     => 0
        ];
    }

    foreach ($equipmentRows as $row) {
        $qty    = (int) ($row['quantity'] ?? 0);
        $status = $row['status'] ?? 'Available';
        $catId  = (int) ($row['category_id'] ?? 0);

        $totalEquipment += $qty;

        if ($status === 'Available') {
            $availableEquipment += $qty;
        } elseif ($status === 'Borrowed' || $status === 'Reserved') {
            $borrowedEquipment += $qty;
        } elseif ($status === 'Unavailable') {
            $maintenanceEquipment += $qty;
        }

        if (isset($categoryMap[$catId])) {
            $categoryMap[$catId]['total'] += $qty;
            if ($status === 'Available') {
                $categoryMap[$catId]['available'] += $qty;
            }
        }
    }

    echo json_encode([
        'success' => true,
        'kpis' => [
            'totalEquipment'       => $totalEquipment,
            'availableEquipment'   => $availableEquipment,
            'borrowedEquipment'    => $borrowedEquipment,
            'maintenanceEquipment' => $maintenanceEquipment,
            'overdueReturns'       => 0 // Connected in Step 2
        ],
        'categories'   => array_values($categoryMap),
        'overdue'      => [], // Connected in Step 2
        'transactions' => []  // Connected in Step 2
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}