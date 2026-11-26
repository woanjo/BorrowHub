
/* ==========================================================================
   Barangay BorrowHub - Login Page Logic
   ==========================================================================
   NOTE: There is no backend yet, so authentication below is a front-end DEMO.
   Replace authenticate() with a real API call before going live.
   Never store real passwords in client-side code.
   ========================================================================== */

(function () {
    'use strict';

    // Configuration
    var DASHBOARD_URL = 'dashboard.html';
    var SESSION_KEY = 'borrowhub_session';
    var REMEMBER_KEY = 'borrowhub_remembered_user';


    // DOM Elements
    var form = document.getElementById('loginForm');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var rememberInput = document.getElementById('remember');
    var toggleBtn = document.getElementById('togglePassword');

    // Make sure all required HTML elements exist.
    if (
        !form ||
        !usernameInput ||
        !passwordInput ||
        !rememberInput ||
        !toggleBtn
    ) {
        console.error('Login page elements could not be found.');
        return;
    }

    var submitBtn = form.querySelector('.btn-submit');
    var submitLabel = submitBtn
        ? submitBtn.querySelector('span')
        : null;

    if (!submitBtn || !submitLabel) {
        console.error('Login submit button could not be found.');
        return;
    }

    var defaultLabel = submitLabel.textContent;

    /* ======================================================================
       Safe Storage Helpers
       ====================================================================== */

    function store(storage, key, value) {
        try {
            storage.setItem(key, value);
        } catch (e) {
            // Ignore storage errors.
        }
    }

    function read(storage, key) {
        try {
            return storage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function remove(storage, key) {
        try {
            storage.removeItem(key);
        } catch (e) {
            // Ignore storage errors.
        }
    }

    /* ======================================================================
       Check Existing Session
       Redirect users who are already signed in.
       ====================================================================== */


    /* ======================================================================
       Restore Remembered Username
       ====================================================================== */

    var remembered = read(window.localStorage, REMEMBER_KEY);

    if (remembered) {
        usernameInput.value = remembered;
        rememberInput.checked = true;
        passwordInput.focus();
    } else {
        usernameInput.focus();
    }

    /* ======================================================================
       Error Message
       Created dynamically so login.html needs no additional markup.
       ====================================================================== */

    var errorBox = document.createElement('div');

    errorBox.id = 'loginError';
    errorBox.setAttribute('role', 'alert');
    errorBox.setAttribute('aria-live', 'assertive');

    errorBox.style.cssText =
        'display:none;' +
        'background:#fde4e4;' +
        'color:#b91c1c;' +
        'border-radius:6px;' +
        'padding:10px 12px;' +
        'font-size:0.8125rem;' +
        'font-weight:500;' +
        'line-height:1.4;';

    form.insertBefore(errorBox, submitBtn);

    function showError(message, field) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';

        [usernameInput, passwordInput].forEach(function (el) {
            el.style.borderColor = '';
            el.removeAttribute('aria-invalid');
        });

        if (field) {
            field.style.borderColor = '#b91c1c';
            field.setAttribute('aria-invalid', 'true');
            field.focus();
        }
    }

    function clearError() {
        errorBox.style.display = 'none';
        errorBox.textContent = '';

        [usernameInput, passwordInput].forEach(function (el) {
            el.style.borderColor = '';
            el.removeAttribute('aria-invalid');
        });
    }

    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);

    /* ======================================================================
       Show / Hide Password
       ====================================================================== */

    toggleBtn.setAttribute('aria-pressed', 'false');

    toggleBtn.addEventListener('click', function () {
        var hidden = passwordInput.getAttribute('type') === 'password';

        passwordInput.setAttribute(
            'type',
            hidden ? 'text' : 'password'
        );

        toggleBtn.setAttribute(
            'aria-pressed',
            hidden ? 'true' : 'false'
        );

        toggleBtn.setAttribute(
            'aria-label',
            hidden ? 'Hide password' : 'Show password'
        );

        toggleBtn.style.opacity = hidden ? '0.6' : '1';

        passwordInput.focus();
    });

    /* ======================================================================
       Authentication
       Replaced nov 26
       ====================================================================== */


    function authenticate(identifier, password) {
        return fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                identifier: identifier,
                password: password
            })
        })
        .then(async function (response) {
            var result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Login failed. Please try again.'
                );
            }

            return result.user;
        });
    }

    /* ======================================================================
       Loading State
       ====================================================================== */

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.style.opacity = isLoading ? '0.8' : '';
        submitBtn.style.cursor = isLoading ? 'wait' : '';

        submitLabel.textContent = isLoading
            ? 'Signing in...'
            : defaultLabel;
    }

    /* ======================================================================
       Form Submission
       ====================================================================== */

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        clearError();

        var identifier = usernameInput.value.trim();
        var password = passwordInput.value;

        // Validate username or email.
        if (!identifier) {
            showError(
                'Please enter your username or official email.',
                usernameInput
            );
            return;
        }

        // Validate email format.
        if (
            identifier.indexOf('@') > -1 &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
        ) {
            showError(
                'That email address doesn’t look right.',
                usernameInput
            );
            return;
        }

        // Validate password.
        if (!password) {
            showError(
                'Please enter your password.',
                passwordInput
            );
            return;
        }

        setLoading(true);

        authenticate(identifier, password)
            .then(function (user) {


                submitLabel.textContent =
                    'Welcome, ' + user.name.split(' ')[0] + '!';

                window.location.href = DASHBOARD_URL;
            })
            .catch(function (err) {
                setLoading(false);

                passwordInput.value = '';

                showError(err.message, passwordInput);
            });
    });

})();
