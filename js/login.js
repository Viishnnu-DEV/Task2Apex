/**
 * login.js — Login page logic
 * Apple-inspired Auth UI
 */

'use strict';

(function () {

  const MOCK_USERS = [
    { email: 'admin@apple.com',    password: 'Admin@123',   name: 'Admin' },
    { email: 'john@example.com',   password: 'John@1234',   name: 'John' },
    { email: 'vishnu@demo.com',    password: 'Vishnu@123',  name: 'Vishnu' },
    { email: 'demo@test.com',      password: 'Demo@1234',   name: 'Demo User' },
  ];

  function getValidation() {
    return window.AuthValidation || {};
  }

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

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    closeBtn.addEventListener('click', removeToast);
    const timer = setTimeout(removeToast, duration);
    closeBtn.addEventListener('click', () => clearTimeout(timer));
  }

  function showLoader(text = 'Signing in...') {
    const overlay = document.getElementById('loadingOverlay');
    const spinnerText = overlay?.querySelector('.spinner-text');
    if (spinnerText) spinnerText.textContent = text;
    overlay?.classList.add('show');
  }

  function hideLoader() {
    document.getElementById('loadingOverlay')?.classList.remove('show');
  }

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

  const formState = {
    email:    false,
    password: false,
  };

  function validateEmail() {
    const { Validators, FieldUI } = getValidation();
    if (!Validators || !FieldUI) return true;
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

  function validatePassword() {
    const { FieldUI } = getValidation();
    const val = DOM.passwordInput.value;
    if (!val) {
      if (FieldUI) FieldUI.setState(DOM.passwordInput, DOM.pwFeedback, 'invalid', 'Password is required.');
      formState.password = false;
      return false;
    }
    if (FieldUI) FieldUI.setState(DOM.passwordInput, DOM.pwFeedback, 'neutral');
    formState.password = true;
    return true;
  }

  function loadRememberedEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam && DOM.emailInput) {
      DOM.emailInput.value = emailParam;
      validateEmail();
      return;
    }

    const saved = localStorage.getItem('authRememberEmail');
    if (saved && DOM.emailInput) {
      DOM.emailInput.value = saved;
      if (DOM.rememberMe) DOM.rememberMe.checked = true;
      validateEmail();
    }
  }

  function handleRememberMe(email) {
    if (DOM.rememberMe?.checked) {
      localStorage.setItem('authRememberEmail', email);
    } else {
      localStorage.removeItem('authRememberEmail');
    }
  }

  function simulateLogin(email, password) {
    return new Promise(resolve => {
      const delay = 600 + Math.random() * 400;
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const allUsers = [...storedUsers, ...MOCK_USERS];
        const user = allUsers.find(u =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (user) {
          resolve({
            success: true,
            user: {
              name: user.fullName || user.name || user.username || 'User',
              email: user.email
            }
          });
        } else {
          resolve({ success: false, error: 'Invalid email or password. Please try again.' });
        }
      }, delay);
    });
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const { ButtonState, FieldUI } = getValidation();

    DOM.formError?.classList.remove('show');

    const emailOk = validateEmail();
    const pwOk    = validatePassword();

    if (!emailOk || !pwOk) {
      showToast({
        type: 'warning',
        title: 'Incomplete Form',
        message: 'Please fill in all required fields correctly.',
      });
      if (!emailOk) DOM.emailInput?.focus();
      else DOM.passwordInput?.focus();
      return;
    }

    const email    = DOM.emailInput.value.trim();
    const password = DOM.passwordInput.value;

    if (ButtonState) ButtonState.loading(DOM.submitBtn, 'Signing in...');
    showLoader();

    try {
      const result = await simulateLogin(email, password);
      hideLoader();

      if (result.success) {
        handleRememberMe(email);

        sessionStorage.setItem('authUser', JSON.stringify({
          name:  result.user.name,
          email: result.user.email,
          loginAt: new Date().toISOString(),
        }));

        if (ButtonState) ButtonState.success(DOM.submitBtn, 'Welcome back! 👋');

        showToast({
          type: 'success',
          title: `Welcome back, ${result.user.name}!`,
          message: 'You have been signed in successfully.',
          duration: 3000,
        });

        setTimeout(() => {
          triggerPageTransition(() => {
            showToast({
              type: 'info',
              title: 'Signed In Successfully',
              message: 'Authentication complete. Demo dashboard state set.',
              duration: 5000,
            });
            if (ButtonState) ButtonState.reset(DOM.submitBtn);
          });
        }, 1200);

      } else {
        if (ButtonState) ButtonState.reset(DOM.submitBtn);

        if (DOM.formError) {
          DOM.formError.querySelector('.error-msg').textContent = result.error;
          DOM.formError.classList.add('show');
        }

        if (FieldUI) {
          FieldUI.setState(DOM.emailInput,    DOM.emailFeedback, 'invalid', '');
          FieldUI.setState(DOM.passwordInput, DOM.pwFeedback,    'invalid', result.error);
        }

        showToast({
          type: 'error',
          title: 'Sign In Failed',
          message: result.error,
        });
      }
    } catch (err) {
      hideLoader();
      if (ButtonState) ButtonState.reset(DOM.submitBtn);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Something went wrong. Please try again.',
      });
    }
  }

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

  function initForgotPassword() {
    const forgotBtn  = document.getElementById('forgotPasswordBtn');
    const modal      = document.getElementById('forgotModal');
    const sendBtn    = document.getElementById('sendResetBtn');
    const fpInput    = document.getElementById('fpEmail');
    const fpFeedback = document.getElementById('fpFeedback');
    const { Validators, FieldUI, ButtonState } = getValidation();

    if (!forgotBtn || !sendBtn) return;

    forgotBtn.addEventListener('click', () => {
      if (DOM.emailInput?.value && fpInput) {
        fpInput.value = DOM.emailInput.value;
      }
    });

    sendBtn.addEventListener('click', async () => {
      if (!Validators) return;
      const result = Validators.email(fpInput?.value || '');
      if (!result.valid) {
        if (FieldUI) FieldUI.setState(fpInput, fpFeedback, 'invalid', result.message);
        return;
      }

      if (FieldUI) FieldUI.setState(fpInput, fpFeedback, 'valid', 'Sending...');
      if (ButtonState) ButtonState.loading(sendBtn, 'Sending...');

      await new Promise(r => setTimeout(r, 1200));

      if (ButtonState) ButtonState.reset(sendBtn);
      if (FieldUI) FieldUI.setState(fpInput, fpFeedback, 'neutral');

      const bsModal = window.bootstrap?.Modal?.getInstance(modal);
      bsModal?.hide();

      showToast({
        type: 'success',
        title: 'Reset Link Sent',
        message: `If ${fpInput.value} is registered, you'll receive a reset link shortly.`,
        duration: 6000,
      });

      if (fpInput) fpInput.value = '';
    });
  }

  function init() {
    DOM.form          = document.getElementById('loginForm');
    DOM.emailInput    = document.getElementById('loginEmail');
    DOM.passwordInput = document.getElementById('loginPassword');
    DOM.rememberMe    = document.getElementById('rememberMe');
    DOM.submitBtn     = document.getElementById('loginBtn');
    DOM.emailFeedback = document.getElementById('emailFeedback');
    DOM.pwFeedback    = document.getElementById('pwFeedback');
    DOM.formError     = document.getElementById('formErrorBanner');

    if (!DOM.form) return;

    const val = getValidation();
    val.initRippleEffects?.();
    val.initPasswordToggles?.();
    val.initKeyboardA11y?.();

    loadRememberedEmail();

    DOM.emailInput?.addEventListener('blur',  validateEmail);
    DOM.emailInput?.addEventListener('input', () => {
      if (DOM.emailInput.classList.contains('is-invalid')) validateEmail();
    });

    DOM.passwordInput?.addEventListener('blur',  validatePassword);
    DOM.passwordInput?.addEventListener('input', () => {
      if (DOM.passwordInput.classList.contains('is-invalid')) validatePassword();
      DOM.formError?.classList.remove('show');
    });

    DOM.form.addEventListener('submit', handleLoginSubmit);
    initForgotPassword();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
