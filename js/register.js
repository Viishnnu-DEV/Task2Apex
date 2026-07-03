/**
 * register.js — Registration page logic
 * Apple-inspired Auth UI
 */

'use strict';

(function () {

  const TAKEN_USERNAMES = [
    'admin', 'administrator', 'john', 'johndoe', 'alex', 'alexsmith',
    'emma', 'emmastone', 'vishnu', 'vishnuk', 'user', 'test',
    'demo', 'root', 'superuser', 'mod', 'support', 'help',
  ];

  const REGISTERED_EMAILS = [
    'admin@apple.com',
    'john@example.com',
    'vishnu@demo.com',
    'demo@test.com',
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

  const DOM = {
    form:             null,
    fullName:         null,
    username:         null,
    email:            null,
    phone:            null,
    password:         null,
    confirmPassword:  null,
    terms:            null,
    submitBtn:        null,

    nameFeedback:     null,
    usernameFeedback: null,
    emailFeedback:    null,
    phoneFeedback:    null,
    pwFeedback:       null,
    confirmFeedback:  null,

    strengthBars:     null,
    strengthLabel:    null,
    pwRulesContainer: null,
    usernameStatus:   null,
    formError:        null,
  };

  const formState = {
    fullName:        false,
    username:        false,
    email:           false,
    phone:           false,
    password:        false,
    confirmPassword: false,
    terms:           false,
  };

  function validateFullName() {
    const { Validators, FieldUI } = getValidation();
    if (!Validators || !FieldUI) return true;
    const result = Validators.fullName(DOM.fullName.value);
    formState.fullName = result.valid;
    FieldUI.setState(DOM.fullName, DOM.nameFeedback,
      result.valid ? 'valid' : 'invalid', result.message);
    return result.valid;
  }

  function validateEmail() {
    const { Validators, FieldUI } = getValidation();
    if (!Validators || !FieldUI) return true;
    const val = DOM.email.value.trim();
    const result = Validators.email(val);

    if (result.valid) {
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const takenInStorage = storedUsers.some(u => u.email.toLowerCase() === val.toLowerCase());
      const taken = REGISTERED_EMAILS.includes(val.toLowerCase()) || takenInStorage;
      if (taken) {
        formState.email = false;
        FieldUI.setState(DOM.email, DOM.emailFeedback, 'invalid', 'This email is already registered.');
        return false;
      }
    }

    formState.email = result.valid;
    FieldUI.setState(DOM.email, DOM.emailFeedback,
      result.valid ? 'valid' : 'invalid', result.message);
    return result.valid;
  }

  function validatePhone() {
    const { Validators, FieldUI } = getValidation();
    if (!Validators || !FieldUI) return true;
    const result = Validators.phone(DOM.phone.value);
    formState.phone = result.valid;
    FieldUI.setState(DOM.phone, DOM.phoneFeedback,
      result.valid ? 'valid' : 'invalid', result.message);
    return result.valid;
  }

  function validatePassword() {
    const { Validators, FieldUI, PasswordStrength } = getValidation();
    if (!Validators || !FieldUI) return true;
    const result = Validators.password(DOM.password.value);
    formState.password = result.valid;

    FieldUI.setState(DOM.password, DOM.pwFeedback,
      result.valid ? 'valid' : (DOM.password.value ? 'invalid' : 'neutral'),
      DOM.password.value ? result.message : ''
    );

    if (PasswordStrength) {
      PasswordStrength.update(result.strength, DOM.strengthBars, DOM.strengthLabel);
      PasswordStrength.updateRules(DOM.password.value, DOM.pwRulesContainer);
    }

    if (DOM.confirmPassword.value) validateConfirmPassword();
    return result.valid;
  }

  function validateConfirmPassword() {
    const { Validators, FieldUI } = getValidation();
    if (!Validators || !FieldUI) return true;
    const result = Validators.confirmPassword(
      DOM.password.value,
      DOM.confirmPassword.value
    );
    formState.confirmPassword = result.valid;
    FieldUI.setState(DOM.confirmPassword, DOM.confirmFeedback,
      result.valid ? 'valid' : 'invalid', result.message);
    return result.valid;
  }

  function validateTerms() {
    const { Validators } = getValidation();
    if (!Validators) return true;
    const result = Validators.terms(DOM.terms.checked);
    formState.terms = result.valid;
    return result.valid;
  }

  let usernameCheckTimer = null;

  function setUsernameStatus(status, message = '') {
    const el = DOM.usernameStatus;
    if (!el) return;

    el.className = 'username-status';
    el.innerHTML = '';

    if (status === 'hidden') return;

    el.classList.add('show', status);

    const icons = {
      available: '<i class="bi bi-check-circle-fill"></i>',
      taken:     '<i class="bi bi-x-circle-fill"></i>',
      checking:  '<span class="spinner-xs"></span>',
      error:     '<i class="bi bi-exclamation-circle-fill"></i>',
    };

    el.innerHTML = `${icons[status] || ''} <span>${message}</span>`;
  }

  function validateUsername() {
    const { Validators, FieldUI } = getValidation();
    if (!Validators || !FieldUI) return true;
    const val = DOM.username.value.trim();

    clearTimeout(usernameCheckTimer);
    setUsernameStatus('hidden');

    const formatResult = Validators.username(val);
    if (!formatResult.valid) {
      formState.username = false;
      FieldUI.setState(DOM.username, DOM.usernameFeedback, 'invalid', formatResult.message);
      return false;
    }

    FieldUI.setState(DOM.username, DOM.usernameFeedback, 'neutral');
    setUsernameStatus('checking', 'Checking availability…');

    usernameCheckTimer = setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const takenInStorage = storedUsers.some(u => u.username?.toLowerCase() === val.toLowerCase());
      const taken = TAKEN_USERNAMES.includes(val.toLowerCase()) || takenInStorage;

      if (taken) {
        formState.username = false;
        FieldUI.setState(DOM.username, DOM.usernameFeedback, 'invalid', 'Username already taken.');
        setUsernameStatus('taken', 'Username already exists');
      } else {
        formState.username = true;
        FieldUI.setState(DOM.username, DOM.usernameFeedback, 'valid', '');
        setUsernameStatus('available', 'Username is available!');
      }
    }, 400);

    return true;
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const { Validators, FieldUI, ButtonState } = getValidation();

    DOM.formError?.classList.remove('show');

    const results = [
      validateFullName(),
      validateEmail(),
      validatePhone(),
      validatePassword(),
      validateConfirmPassword(),
      validateTerms(),
    ];

    const unameFormat = Validators ? Validators.username(DOM.username.value.trim()) : { valid: true };
    if (!unameFormat.valid) {
      if (FieldUI) FieldUI.setState(DOM.username, DOM.usernameFeedback, 'invalid', unameFormat.message);
      formState.username = false;
    }

    const allValid = results.every(Boolean) && formState.username;

    if (!allValid) {
      showToast({
        type: 'warning',
        title: 'Please Review Your Form',
        message: 'Some fields need attention before you can continue.',
      });

      const fields = [DOM.fullName, DOM.username, DOM.email, DOM.phone, DOM.password, DOM.confirmPassword];
      const fieldKeys = ['fullName', 'username', 'email', 'phone', 'password', 'confirmPassword'];
      for (let i = 0; i < fields.length; i++) {
        if (!formState[fieldKeys[i]]) {
          fields[i]?.focus();
          break;
        }
      }

      if (!formState.terms) {
        showToast({
          type: 'info',
          title: 'Terms Required',
          message: 'You must agree to the Terms of Service to create an account.',
        });
      }

      return;
    }

    if (ButtonState) ButtonState.loading(DOM.submitBtn, 'Creating account…');

    const payload = {
      fullName: DOM.fullName.value.trim(),
      username: DOM.username.value.trim().toLowerCase(),
      email:    DOM.email.value.trim().toLowerCase(),
      phone:    DOM.phone.value.trim(),
      password: DOM.password.value,
    };

    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    storedUsers.push(payload);
    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));

    await new Promise(r => setTimeout(r, 900));

    if (ButtonState) ButtonState.success(DOM.submitBtn, 'Account Created! 🎉');

    sessionStorage.setItem('authUser', JSON.stringify({
      ...payload,
      registeredAt: new Date().toISOString(),
    }));

    showToast({
      type: 'success',
      title: 'Welcome aboard! 🎉',
      message: `Your account has been created. Redirecting to sign in...`,
      duration: 3000,
    });

    setTimeout(() => {
      triggerPageTransition(() => {
        window.location.href = `index.html?email=${encodeURIComponent(payload.email)}`;
      });
    }, 1000);
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

  function initCharCounters() {
    const unameCounter = document.getElementById('usernameCounter');
    DOM.username?.addEventListener('input', () => {
      const len = DOM.username.value.length;
      if (unameCounter) {
        unameCounter.textContent = `${len}/20`;
        unameCounter.style.color = len > 20 ? 'var(--color-error)' : 'var(--text-mute)';
      }
    });
  }

  function init() {
    DOM.form            = document.getElementById('registerForm');
    DOM.fullName        = document.getElementById('regFullName');
    DOM.username        = document.getElementById('regUsername');
    DOM.email           = document.getElementById('regEmail');
    DOM.phone           = document.getElementById('regPhone');
    DOM.password        = document.getElementById('regPassword');
    DOM.confirmPassword = document.getElementById('regConfirmPassword');
    DOM.terms           = document.getElementById('regTerms');
    DOM.submitBtn       = document.getElementById('registerBtn');

    DOM.nameFeedback     = document.getElementById('nameFeedback');
    DOM.usernameFeedback = document.getElementById('usernameFeedback');
    DOM.emailFeedback    = document.getElementById('emailFeedback');
    DOM.phoneFeedback    = document.getElementById('phoneFeedback');
    DOM.pwFeedback       = document.getElementById('pwFeedback');
    DOM.confirmFeedback  = document.getElementById('confirmFeedback');

    DOM.strengthBars     = document.querySelectorAll('.strength-bar');
    DOM.strengthLabel    = document.getElementById('strengthLabel');
    DOM.pwRulesContainer = document.getElementById('pwRules');
    DOM.usernameStatus   = document.getElementById('usernameStatus');
    DOM.formError        = document.getElementById('formErrorBanner');

    if (!DOM.form) return;

    const val = getValidation();
    val.initRippleEffects?.();
    val.initPasswordToggles?.();
    val.initKeyboardA11y?.();
    initCharCounters();

    DOM.fullName.addEventListener('blur',  validateFullName);
    DOM.fullName.addEventListener('input', () => {
      if (DOM.fullName.classList.contains('is-invalid') ||
          DOM.fullName.classList.contains('is-valid')) validateFullName();
    });

    DOM.username.addEventListener('input', validateUsername);
    DOM.username.addEventListener('blur', () => {
      if (!DOM.username.value) {
        setUsernameStatus('hidden');
        formState.username = false;
        if (val.FieldUI) val.FieldUI.setState(DOM.username, DOM.usernameFeedback, 'invalid', 'Username is required.');
      }
    });

    DOM.email.addEventListener('blur',  validateEmail);
    DOM.email.addEventListener('input', () => {
      if (DOM.email.classList.contains('is-invalid') ||
          DOM.email.classList.contains('is-valid')) validateEmail();
    });

    DOM.phone.addEventListener('blur',  validatePhone);
    DOM.phone.addEventListener('input', () => {
      if (DOM.phone.classList.contains('is-invalid') ||
          DOM.phone.classList.contains('is-valid')) validatePhone();
    });

    DOM.password.addEventListener('input', validatePassword);
    DOM.password.addEventListener('blur',  validatePassword);

    DOM.confirmPassword.addEventListener('input', validateConfirmPassword);
    DOM.confirmPassword.addEventListener('blur',  validateConfirmPassword);

    DOM.terms.addEventListener('change', validateTerms);

    DOM.form.addEventListener('submit', handleRegisterSubmit);
  }

  document.addEventListener('DOMContentLoaded', init);

})();
