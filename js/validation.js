/**
 * validation.js — Shared validation utilities
 * Apple-inspired Auth UI
 * 
 * Provides reusable validation functions, field feedback rendering,
 * and form field state management used by both login.js and register.js.
 */

'use strict';

/* ============================================================
   VALIDATION RULES
   ============================================================ */

const Validators = {
  /**
   * Email validation using RFC 5322 simplified pattern.
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  email(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'Email is required.' };
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(trimmed)) return { valid: false, message: 'Enter a valid email address.' };
    return { valid: true, message: 'Looks good!' };
  },

  /**
   * Password validation: min 8 chars, uppercase, lowercase, digit, special char.
   * @param {string} value
   * @returns {{ valid: boolean, message: string, strength: number }}
   */
  password(value) {
    if (!value) return { valid: false, message: 'Password is required.', strength: 0 };

    let strength = 0;
    if (value.length >= 8)              strength++;
    if (/[A-Z]/.test(value))            strength++;
    if (/[a-z]/.test(value))            strength++;
    if (/[0-9]/.test(value))            strength++;
    if (/[^A-Za-z0-9]/.test(value))     strength++;

    if (value.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters.', strength };
    }
    if (strength < 3) {
      return { valid: false, message: 'Password is too weak.', strength };
    }

    return { valid: true, message: 'Strong password!', strength };
  },

  /**
   * Full name validation: at least two words, letters only (including accents).
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  fullName(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'Full name is required.' };
    if (trimmed.length < 3) return { valid: false, message: 'Name must be at least 3 characters.' };
    const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 2) return { valid: false, message: 'Please enter your full name (first & last).' };
    if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(trimmed)) return { valid: false, message: 'Name contains invalid characters.' };
    return { valid: true, message: 'Great name!' };
  },

  /**
   * Username validation: 3-20 chars, alphanumeric + underscore.
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  username(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'Username is required.' };
    if (trimmed.length < 3) return { valid: false, message: 'Username must be at least 3 characters.' };
    if (trimmed.length > 20) return { valid: false, message: 'Username must be at most 20 characters.' };
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return { valid: false, message: 'Only letters, numbers, and underscores allowed.' };
    if (/^[0-9]/.test(trimmed)) return { valid: false, message: 'Username cannot start with a number.' };
    return { valid: true, message: 'Valid username!' };
  },

  /**
   * Phone number validation: optional +country-code, 7-15 digits.
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  phone(value) {
    const trimmed = value.trim();
    if (!trimmed) return { valid: false, message: 'Phone number is required.' };
    // Strip spaces, dashes, parentheses for validation
    const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');
    const pattern = /^\+?[1-9]\d{6,14}$/;
    if (!pattern.test(cleaned)) return { valid: false, message: 'Enter a valid phone number.' };
    return { valid: true, message: 'Valid phone number!' };
  },

  /**
   * Confirm password match.
   * @param {string} password
   * @param {string} confirm
   * @returns {{ valid: boolean, message: string }}
   */
  confirmPassword(password, confirm) {
    if (!confirm) return { valid: false, message: 'Please confirm your password.' };
    if (password !== confirm) return { valid: false, message: 'Passwords do not match.' };
    return { valid: true, message: 'Passwords match!' };
  },

  /**
   * Terms checkbox validation.
   * @param {boolean} checked
   * @returns {{ valid: boolean, message: string }}
   */
  terms(checked) {
    if (!checked) return { valid: false, message: 'You must agree to the terms.' };
    return { valid: true, message: '' };
  }
};

/* ============================================================
   FIELD FEEDBACK HELPERS
   ============================================================ */

const FieldUI = {
  /**
   * Set a field as valid, invalid, or neutral.
   * @param {HTMLElement} inputEl  - The input element
   * @param {HTMLElement} feedbackEl - The feedback container
   * @param {'valid'|'invalid'|'neutral'} state
   * @param {string} message
   */
  setState(inputEl, feedbackEl, state, message = '') {
    // Remove all state classes first
    inputEl.classList.remove('is-valid', 'is-invalid');

    if (feedbackEl) {
      feedbackEl.classList.remove('show', 'success', 'error');
      feedbackEl.innerHTML = '';
    }

    if (state === 'valid') {
      inputEl.classList.add('is-valid');
      if (feedbackEl && message) {
        feedbackEl.classList.add('show', 'success');
        feedbackEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${message}`;
      }
    } else if (state === 'invalid') {
      inputEl.classList.add('is-invalid');
      if (feedbackEl && message) {
        feedbackEl.classList.add('show', 'error');
        feedbackEl.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;
      }
    }
  },

  /**
   * Reset a field to neutral state.
   * @param {HTMLElement} inputEl
   * @param {HTMLElement} feedbackEl
   */
  reset(inputEl, feedbackEl) {
    this.setState(inputEl, feedbackEl, 'neutral');
  }
};

/* ============================================================
   PASSWORD STRENGTH METER
   ============================================================ */

const PasswordStrength = {
  labels: ['', 'Too Weak', 'Weak', 'Fair', 'Good', 'Strong'],
  barClasses: ['', 'active-weak', 'active-weak', 'active-fair', 'active-good', 'active-strong'],
  colors: ['', '#FF3B30', '#FF3B30', '#FF9F0A', '#5AC8FA', '#34C759'],

  /**
   * Update the strength meter UI.
   * @param {number} strength - 0 to 5
   * @param {NodeList} bars - the .strength-bar elements
   * @param {HTMLElement} label - the .strength-label element
   */
  update(strength, bars, label) {
    bars.forEach((bar, index) => {
      bar.classList.remove('active-weak', 'active-fair', 'active-good', 'active-strong');
      if (index < strength) {
        bar.classList.add(this.barClasses[strength]);
      }
    });

    if (label) {
      label.textContent = strength > 0 ? this.labels[strength] : '';
      label.style.color = this.colors[strength] || 'var(--color-text-muted)';
    }
  },

  /**
   * Update password rule checkmarks.
   * @param {string} password
   * @param {HTMLElement} container - holds .pw-rule elements
   */
  updateRules(password, container) {
    if (!container) return;

    const rules = {
      'rule-length':    password.length >= 8,
      'rule-upper':     /[A-Z]/.test(password),
      'rule-lower':     /[a-z]/.test(password),
      'rule-digit':     /[0-9]/.test(password),
      'rule-special':   /[^A-Za-z0-9]/.test(password),
    };

    Object.entries(rules).forEach(([id, met]) => {
      const ruleEl = container.querySelector(`#${id}`);
      if (!ruleEl) return;
      const icon = ruleEl.querySelector('i');
      if (met) {
        ruleEl.classList.add('met');
        if (icon) { icon.className = 'bi bi-check-circle-fill'; }
      } else {
        ruleEl.classList.remove('met');
        if (icon) { icon.className = 'bi bi-circle'; }
      }
    });
  }
};

/* ============================================================
   BUTTON LOADING STATE
   ============================================================ */

const ButtonState = {
  /**
   * Put button into loading mode.
   * @param {HTMLButtonElement} btn
   * @param {string} loadingText
   */
  loading(btn, loadingText = 'Please wait...') {
    btn._originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `
      <span class="btn-spinner"></span>
      <span>${loadingText}</span>
    `;
  },

  /**
   * Restore button to normal state.
   * @param {HTMLButtonElement} btn
   */
  reset(btn) {
    btn.disabled = false;
    if (btn._originalContent) {
      btn.innerHTML = btn._originalContent;
    }
  },

  /**
   * Show success state briefly then reset.
   * @param {HTMLButtonElement} btn
   * @param {string} successText
   * @param {number} duration - ms before reset
   */
  success(btn, successText = 'Success!', duration = 2000) {
    btn.disabled = true;
    btn.innerHTML = `<i class="bi bi-check-lg"></i> <span>${successText}</span>`;
    btn.style.background = 'linear-gradient(180deg, #4CD964 0%, #34C759 100%)';
    setTimeout(() => {
      btn.style.background = '';
      ButtonState.reset(btn);
    }, duration);
  }
};

/* ============================================================
   RIPPLE EFFECT
   ============================================================ */

/**
 * Attach a ripple click effect to all .btn-apple elements.
 * Called once on DOMContentLoaded.
 */
function initRippleEffects() {
  document.querySelectorAll('.btn-apple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ============================================================
   SHOW / HIDE PASSWORD TOGGLE
   ============================================================ */

/**
 * Initialize all password toggle buttons (data-toggle="password").
 */
function initPasswordToggles() {
  document.querySelectorAll('[data-toggle="password"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = this.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
      }

      // Announce to screen readers
      this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });
}

/* ============================================================
   KEYBOARD NAVIGATION HELPERS
   ============================================================ */

/**
 * Allow Enter key to submit forms naturally,
 * and Space to trigger button ripples.
 */
function initKeyboardA11y() {
  // Ensure labels are properly associated
  document.querySelectorAll('.check-label').forEach(label => {
    const forAttr = label.getAttribute('for');
    if (forAttr) {
      const input = document.getElementById(forAttr);
      if (input) {
        label.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change'));
          }
        });
      }
    }
  });
}

/* ============================================================
   EXPORT (module-style via global namespace)
   ============================================================ */
window.AuthValidation = {
  Validators,
  FieldUI,
  PasswordStrength,
  ButtonState,
  initRippleEffects,
  initPasswordToggles,
  initKeyboardA11y
};
