/**
 * login.js — Login page logic
 * Apple-inspired Auth UI
 *
 * Handles:
 *  - Real-time field validation
 *  - Show/hide password
 *  - Remember me (localStorage)
 *  - Simulated async login
 *  - Toast notifications
 *  - Loading overlay
 *  - Forgot password modal
 *  - Page transition animation
 */

'use strict';

/* ── Shorthand aliases ────────────────────────────────────── */
const { Validators, FieldUI, ButtonState, initRippleEffects, initPasswordToggles, initKeyboardA11y } = window.AuthValidation;

/* ── Simulated user database (frontend only) ─────────────── */
const MOCK_USERS = [
  { email: 'admin@apple.com',    password: 'Admin@123',   name: 'Admin' },
  { email: 'john@example.com',   password: 'John@1234',   name: 'John' },
  { email: 'vishnu@demo.com',    password: 'Vishnu@123',  name: 'Vishnu' },
  { email: 'demo@test.com',      password: 'Demo@1234',   name: 'Demo User' },
];

/* ============================================================
   TOAST SYSTEM
   ============================================================ */

/**
 * Display a toast notification.
 * @param {object} options
 * @param {'success'|'error'|'info'|'warning'} options.type
 * @param {string} options.title
 * @param {string} options.message
 * @param {number} [options.duration=4000]
 */
function showToast({ type = 'info', title, message, duration = 4000 }) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'bi-check-circle-fill',
    error:   'bi-x-circle-fill',
    info:    'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
  };

  const toast = document.createElement('div');
  toast.className = 'toast-apple';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div class="toast-icon ${type}">
      <i class="bi ${icons[type]}"></i>
    </div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <i class="bi bi-x"></i>
    </button>
    <div class="toast-progress ${type}"></div>
  `;

  container.appendChild(toast);

  // Close handler
  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  closeBtn.addEventListener('click', removeToast);

  // Auto dismiss
  const timer = setTimeout(removeToast, duration);
  closeBtn.addEventListener('click', () => clearTimeout(timer));
}

/* ============================================================
   LOADING OVERLAY
   ============================================================ */

function showLoader(text = 'Signing in...') {
  const overlay = document.getElementById('loadingOverlay');
  const spinnerText = overlay?.querySelector('.spinner-text');
  if (spinnerText) spinnerText.textContent = text;
  overlay?.classList.add('show');
}

function hideLoader() {
  document.getElementById('loadingOverlay')?.classList.remove('show');
}

/* ============================================================
   FORM FIELD SETUP
   ============================================================ */

/** References to DOM elements */
const DOM = {
  form:          null,
  emailInput:    null,
  passwordInput: null,
  rememberMe:    null,
  submitBtn:     null,
  emailFeedback: null,
  pwFeedback:    null,
  formError:     null,
};

/** Validation state */
const formState = {
  email:    false,
  password: false,
};

/**
 * Validate the email field and update UI.
 */
function validateEmail() {
  const result = Validators.email(DOM.emailInput.value);
  formState.email = result.valid;
  FieldUI.setState(
    DOM.emailInput,
    DOM.emailFeedback,
    result.valid ? 'valid' : 'invalid',
    result.message
  );
  return result.valid;
}

/**
 * Validate the password field and update UI.
 * For login, we just check non-empty (actual check is server-side).
 */
function validatePassword() {
  const val = DOM.passwordInput.value;
  if (!val) {
    FieldUI.setState(DOM.passwordInput, DOM.pwFeedback, 'invalid', 'Password is required.');
    formState.password = false;
    return false;
  }
  FieldUI.setState(DOM.passwordInput, DOM.pwFeedback, 'neutral');
  formState.password = true;
  return true;
}

/* ============================================================
   REMEMBER ME
   ============================================================ */

function loadRememberedEmail() {
  const saved = localStorage.getItem('authRememberEmail');
  if (saved && DOM.emailInput) {
    DOM.emailInput.value = saved;
    DOM.rememberMe.checked = true;
  }
}

function handleRememberMe(email) {
  if (DOM.rememberMe?.checked) {
    localStorage.setItem('authRememberEmail', email);
  } else {
    localStorage.removeItem('authRememberEmail');
  }
}

/* ============================================================
   SIMULATED LOGIN
   ============================================================ */

/**
 * Simulate an async API call to authenticate a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
function simulateLogin(email, password) {
  return new Promise(resolve => {
    // Simulate network delay (800ms – 1.5s)
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const user = MOCK_USERS.find(u =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (user) {
        resolve({ success: true, user });
      } else {
        resolve({ success: false, error: 'Invalid email or password. Please try again.' });
      }
    }, delay);
  });
}

/* ============================================================
   FORM SUBMISSION
   ============================================================ */

async function handleLoginSubmit(e) {
  e.preventDefault();

  // Hide any previous errors
  DOM.formError.classList.remove('show');

  // Validate all fields
  const emailOk = validateEmail();
  const pwOk    = validatePassword();

  if (!emailOk || !pwOk) {
    showToast({
      type: 'warning',
      title: 'Incomplete Form',
      message: 'Please fill in all required fields correctly.',
    });
    // Focus first invalid field
    if (!emailOk) DOM.emailInput.focus();
    else DOM.passwordInput.focus();
    return;
  }

  const email    = DOM.emailInput.value.trim();
  const password = DOM.passwordInput.value;

  // Loading state
  ButtonState.loading(DOM.submitBtn, 'Signing in...');
  showLoader();

  try {
    const result = await simulateLogin(email, password);

    hideLoader();

    if (result.success) {
      handleRememberMe(email);

      // Store session (demo)
      sessionStorage.setItem('authUser', JSON.stringify({
        name:  result.user.name,
        email: result.user.email,
        loginAt: new Date().toISOString(),
      }));

      ButtonState.success(DOM.submitBtn, 'Welcome back! 👋');

      showToast({
        type: 'success',
        title: `Welcome back, ${result.user.name}!`,
        message: 'You have been signed in successfully.',
        duration: 3000,
      });

      // Page transition after short delay
      setTimeout(() => {
        triggerPageTransition(() => {
          // In a real app, redirect to dashboard. Here we reload as demo.
          showToast({
            type: 'info',
            title: 'Demo Mode',
            message: 'In production this would redirect to your dashboard.',
            duration: 5000,
          });
          ButtonState.reset(DOM.submitBtn);
        });
      }, 1200);

    } else {
      ButtonState.reset(DOM.submitBtn);

      // Show inline error banner
      DOM.formError.querySelector('.error-msg').textContent = result.error;
      DOM.formError.classList.add('show');

      // Mark fields as invalid
      FieldUI.setState(DOM.emailInput,    DOM.emailFeedback, 'invalid', '');
      FieldUI.setState(DOM.passwordInput, DOM.pwFeedback,    'invalid', result.error);

      showToast({
        type: 'error',
        title: 'Sign In Failed',
        message: result.error,
      });

      // Shake the card
      const card = document.querySelector('.auth-card');
      card?.classList.add('shake');
      setTimeout(() => card?.classList.remove('shake'), 600);
    }
  } catch (err) {
    hideLoader();
    ButtonState.reset(DOM.submitBtn);
    showToast({
      type: 'error',
      title: 'Network Error',
      message: 'Something went wrong. Please try again.',
    });
  }
}

/* ============================================================
   PAGE TRANSITION
   ============================================================ */

function triggerPageTransition(callback) {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) { callback?.(); return; }

  overlay.classList.add('enter');
  setTimeout(() => {
    callback?.();
    overlay.classList.remove('enter');
    overlay.classList.add('leave');
    setTimeout(() => overlay.classList.remove('leave'), 500);
  }, 400);
}

/* ============================================================
   FORGOT PASSWORD MODAL
   ============================================================ */

function initForgotPassword() {
  const forgotBtn  = document.getElementById('forgotPasswordBtn');
  const modal      = document.getElementById('forgotModal');
  const sendBtn    = document.getElementById('sendResetBtn');
  const fpInput    = document.getElementById('fpEmail');
  const fpFeedback = document.getElementById('fpFeedback');

  if (!forgotBtn || !sendBtn) return;

  // Populate email if already entered
  forgotBtn.addEventListener('click', () => {
    if (DOM.emailInput?.value && fpInput) {
      fpInput.value = DOM.emailInput.value;
    }
  });

  // Send reset
  sendBtn.addEventListener('click', async () => {
    const result = Validators.email(fpInput?.value || '');
    if (!result.valid) {
      FieldUI.setState(fpInput, fpFeedback, 'invalid', result.message);
      return;
    }

    FieldUI.setState(fpInput, fpFeedback, 'valid', 'Sending...');
    ButtonState.loading(sendBtn, 'Sending...');

    await new Promise(r => setTimeout(r, 1200));

    ButtonState.reset(sendBtn);
    FieldUI.setState(fpInput, fpFeedback, 'neutral');

    // Close modal
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal?.hide();

    showToast({
      type: 'success',
      title: 'Reset Link Sent',
      message: `If ${fpInput.value} is registered, you'll receive a reset link shortly.`,
      duration: 6000,
    });

    fpInput.value = '';
  });
}

/* ============================================================
   SHAKE ANIMATION (CSS injected)
   ============================================================ */

function injectShakeAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      15%       { transform: translateX(-6px); }
      30%       { transform: translateX(6px); }
      45%       { transform: translateX(-4px); }
      60%       { transform: translateX(4px); }
      75%       { transform: translateX(-2px); }
      90%       { transform: translateX(2px); }
    }
    .auth-card.shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  // Grab DOM references
  DOM.form          = document.getElementById('loginForm');
  DOM.emailInput    = document.getElementById('loginEmail');
  DOM.passwordInput = document.getElementById('loginPassword');
  DOM.rememberMe    = document.getElementById('rememberMe');
  DOM.submitBtn     = document.getElementById('loginBtn');
  DOM.emailFeedback = document.getElementById('emailFeedback');
  DOM.pwFeedback    = document.getElementById('pwFeedback');
  DOM.formError     = document.getElementById('formErrorBanner');

  if (!DOM.form) return; // Not the login page

  // Init shared utilities
  initRippleEffects();
  initPasswordToggles();
  initKeyboardA11y();
  injectShakeAnimation();

  // Restore saved email
  loadRememberedEmail();

  // Real-time validation listeners
  DOM.emailInput?.addEventListener('blur',  validateEmail);
  DOM.emailInput?.addEventListener('input', () => {
    if (DOM.emailInput.classList.contains('is-invalid')) validateEmail();
  });

  DOM.passwordInput?.addEventListener('blur',  validatePassword);
  DOM.passwordInput?.addEventListener('input', () => {
    if (DOM.passwordInput.classList.contains('is-invalid')) validatePassword();
    // Clear error banner on typing
    DOM.formError?.classList.remove('show');
  });

  // Form submit
  DOM.form.addEventListener('submit', handleLoginSubmit);

  // Forgot password
  initForgotPassword();

  // Demo credentials hint (in console for developers)
  console.info(
    '%c🔑 Demo Credentials\n%cemail: vishnu@demo.com\npassword: Vishnu@123',
    'color: #0071E3; font-weight: bold; font-size: 14px;',
    'color: #6E6E73; font-size: 12px;'
  );
}

/* Run on DOM ready */
document.addEventListener('DOMContentLoaded', init);
