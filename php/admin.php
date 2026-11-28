<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

function response($success, $message, $data = null, $statusCode = 200)
{
    http_response_code($statusCode);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);

    exit;
}

// GET REQUEST DATA
function getRequestData()
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        return is_array($data) ? $data : [];
    }

    return $_POST;
}

// VALIDATION HELPERS
function requiredField($data, $field, $label)
{
    $value = trim((string)($data[$field] ?? ''));

    if ($value === '') {
        response(false, $label . ' is required.', null, 422);
    }

    return $value;
}

function validateEmail($email_address)
{
    if (!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
        response(false, 'Please enter a valid email address.', null, 422);
    }
}

function validateRole($role)
{
    $role = strtolower(trim($role));

    if (!in_array($role, ['admin', 'staff'], true)) {
        response(false, 'Invalid role. Choose Admin or Staff.', null, 422);
    }

    return $role;
}

try {
    $action = $_GET['action'] ?? '';

    // GET STAFF
    if ($action === 'list') {

        $stmt = $pdo->query(
            'SELECT * FROM admin_get_staff_list()'
        );

        $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);

        response(
            true,
            'Staff accounts retrieved successfully.',
            $staff
        );
    }

    // All remaining actions require POST.
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? $_POST['action'] ?? '';

    if ($method === 'GET' && $action === 'list') {
        // Allow staff list requests
    } elseif ($method !== 'POST') {
        response(false, 'Invalid request method.', null, 405);
    }

    $data = getRequestData();

    // CREATE STAFF
    if ($action === 'create') {

        $firstname = requiredField(
            $data, 'firstname', 'First name'
        );

        $lastname = requiredField(
            $data, 'lastname', 'Last name'
        );

        $username = requiredField(
            $data, 'username', 'Username'
        );

        $email_address = requiredField(
            $data, 'email_address', 'Email address'
        );

        $contact_number = requiredField(
            $data, 'contact_number', 'Contact number'
        );

        $password = requiredField(
            $data, 'password', 'Password'
        );

        $confirmPassword = requiredField(
            $data, 'confirm_password', 'Confirm password'
        );

        $role = validateRole(
            requiredField($data, 'role', 'Role')
        );

        validateEmail($email_address);

        if ($password !== $confirmPassword) {
            response(false, 'Passwords do not match.', null, 422);
        }

        if (strlen($password) < 8) {
            response(
                false,
                'Password must contain at least 8 characters.',
                null,
                422
            );
        }

        // Generate secure password hash.
        $passwordHash = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        if ($passwordHash === false) {
            throw new Exception('Unable to secure the password.');
        }

        // Call PostgreSQL stored function.
        $stmt = $pdo->prepare(
            'SELECT public.admin_add_staff(
                :firstname,
                :username,
                :lastname,
                :email_address,
                :password_hash,
                :contact_number,
                :role
            ) AS new_staff_id'
        );

        $stmt->execute([
            ':firstname' => $firstname,
            ':username' => $username,
            ':lastname' => $lastname,
            ':email_address' => $email_address,
            ':password_hash' => $passwordHash,
            ':contact_number' => $contact_number,
            ':role' => $role
        ]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        response(
            true,
            'Staff account created successfully.',
            [
                'staff_id' => (int)$result['new_staff_id']
            ]
        );
    }

    // UPDATE STAFF
    if ($action === 'update') {

        $staffId = filter_var(
            $data['staff_id'] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$staffId || $staffId <= 0) {
            response(false, 'Invalid staff ID.', null, 422);
        }

        $firstname = requiredField(
            $data, 'firstname', 'First name'
        );

        $lastname = requiredField(
            $data, 'lastname', 'Last name'
        );

        $email_address = requiredField(
            $data, 'email_address', 'Email address'
        );

        $contact_number = requiredField(
            $data, 'contact_number', 'Contact number'
        );

        $role = validateRole(
            requiredField($data, 'role', 'Role')
        );

        $username = requiredField(
            $data, 'username', 'Username'
        );

        validateEmail($email_address);

        // Read password fields.
        $password = trim((string)($data['password'] ?? ''));
        $confirmPassword = trim(
            (string)($data['confirm_password'] ?? '')
        );

        $passwordHash = null;

        // Only update password when a new one is provided.
        if ($password !== '' || $confirmPassword !== '') {

            if ($password === '' || $confirmPassword === '') {
                response(
                    false,
                    'Enter and confirm the new password.',
                    null,
                    422
                );
            }

            if ($password !== $confirmPassword) {
                response(
                    false,
                    'Passwords do not match.',
                    null,
                    422
                );
            }

            if (strlen($password) < 8) {
                response(
                    false,
                    'Password must contain at least 8 characters.',
                    null,
                    422
                );
            }

            $passwordHash = password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            if ($passwordHash === false) {
                throw new Exception('Unable to secure the password.');
            }
        }

        // Read account status.
        $activeValue = $data['is_active'] ?? null;

        if (is_bool($activeValue)) {
            $isActive = $activeValue;
        } else {
            $isActive = filter_var(
                $activeValue,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );
        }

        if ($isActive === null) {
            response(
                false,
                'Invalid account status.',
                null,
                422
            );
        }

        // Call PostgreSQL stored function.
        $stmt = $pdo->prepare(
            'SELECT public.admin_update_staff(
                :staff_id,
                :firstname,
                :username,
                :lastname,
                :email_address,
                :contact_number,
                :role,
                :is_active,
                :password_hash
            ) AS updated'
        );

        $stmt->execute([
            ':staff_id' => $staffId,
            ':firstname' => $firstname,
            ':username' => $username,
            ':lastname' => $lastname,
            ':email_address' => $email_address,
            ':contact_number' => $contact_number,
            ':role' => $role,
            ':is_active' => $isActive ? 'true' : 'false',
            ':password_hash' => $passwordHash
        ]);

        $stmt->fetch(PDO::FETCH_ASSOC);

        response(
            true,
            'Staff account updated successfully.',
            [
                'staff_id' => $staffId
            ]
        );
    }

    // INVALID ACTION
    response(false, 'Unknown API action.', null, 400);

} catch (PDOException $e) {

    error_log('Admin API database error: ' . $e->getMessage());

    response(
        false,
        'A database error occurred. Please check your input or contact the administrator.',
        null,
        500
    );

} catch (Throwable $e) {

    error_log('Admin API error: ' . $e->getMessage());

    response(
        false,
        $e->getMessage(),
        null,
        500
    );
}