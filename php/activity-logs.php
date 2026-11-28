
<?php
header('Content-Type: application/json');

require_once 'db.php';

try {
    $sql = "
        SELECT
            a.audit_id,
            a.table_name,
            a.action,
            a.record_id,
            a.old_data,
            a.new_data,
            a.changed_by,
            a.change_at,

            s.firstname,
            s.lastname,
            s.role

        FROM public.audit_logs AS a

        LEFT JOIN public.staff AS s
            ON s.staff_id::TEXT = a.changed_by

        ORDER BY a.change_at DESC, a.audit_id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Activity logs retrieved successfully.',
        'data' => $activities
    ]);

} catch (PDOException $e) {

    error_log('Activity Logs Error: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Unable to retrieve activity logs.',
        'error' => $e->getMessage(),
        'data' => []
    ]);
}
