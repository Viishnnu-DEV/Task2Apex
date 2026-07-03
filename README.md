# ✦ Lumina — Apple-Inspired Authentication UI

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</div>

<br />

> A premium, production-quality authentication UI inspired by Apple's design philosophy. Built with pure HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript — no frameworks, no backend required.

---

## 🌟 Project Overview

Lumina is a **frontend-only** authentication system that showcases modern web design principles with an Apple-like aesthetic. Every detail — from the glassmorphism card to the micro-animations and password strength meter — is crafted to create a premium, polished user experience that stands out.

---

## ✨ Features

### Design & UX
- 🎨 **Apple-inspired Design** — Minimal, elegant, and premium aesthetics
- 🪟 **Glassmorphism Card** — Frosted glass card with subtle borders and shadows
- 🌈 **Animated Left Panel** — Deep blue gradient with floating orbs and mesh grid
- ✨ **Smooth Animations** — Page fade, card slide-up, pill slide-in, floating logo
- 📱 **Fully Responsive** — Mobile-first design that works on all screen sizes
- 🌗 **Touch-Friendly** — Large tap targets and haptic-friendly interactions

### Login Page
- ✅ Real-time email validation
- ✅ Password show/hide toggle
- ✅ Remember Me (localStorage persistence)
- ✅ Simulated async authentication (mock user database)
- ✅ Inline error banner with shake animation
- ✅ Loading button state with spinner
- ✅ Success toast with redirect simulation
- ✅ Forgot Password modal with email input
- ✅ Social sign-in buttons (Google, Apple)
- ✅ Page transition animation

### Registration Page
- ✅ 6-field form: Full Name, Username, Email, Phone, Password, Confirm
- ✅ Two-column responsive layout for name/username
- ✅ **Username availability check** (debounced, simulated async)
- ✅ Real-time validation for all fields
- ✅ **Password strength meter** (5 levels: Too Weak → Strong)
- ✅ **Password rules checklist** (length, uppercase, lowercase, digit, special)
- ✅ Password match validation
- ✅ Phone number validation
- ✅ Character counter for username (0/20)
- ✅ Terms of Service modal with "I Agree" auto-check
- ✅ Social sign-up buttons

### Components
- 🔔 **Toast Notifications** — Animated, dismissible, with progress bar
- ⏳ **Loading Overlay** — Full-screen with blur backdrop
- 💬 **Modal Dialogs** — Forgot Password & Terms of Service
- 🔘 **Ripple Buttons** — Material-inspired click ripple on primary buttons
- 🧭 **Sticky Navbar** — Frosted glass effect with Apple-style links

### Accessibility
- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<aside>`, `<section>`, `<footer>`)
- ARIA labels, roles, and live regions throughout
- `visually-hidden` labels for all form inputs
- Keyboard navigation support
- Focus-visible outlines
- Reduced-motion media query support
- High-contrast mode support

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic structure, ARIA accessibility |
| **CSS3** | Design system, animations, glassmorphism, responsive layout |
| **Bootstrap 5.3** | Grid, navbar, modal, responsive utilities |
| **Bootstrap Icons 1.11** | All iconography |
| **Vanilla JavaScript (ES6+)** | Validation, UI logic, simulated async |
| **Google Fonts (Poppins)** | Premium typography |

**No external dependencies beyond the above CDN links.**

---

## 📁 Folder Structure

```
Task2/
├── index.html          # Login page
├── register.html       # Registration page
├── README.md           # This file
│
├── css/
│   ├── style.css       # Main design system & components
│   └── responsive.css  # Breakpoint-specific overrides
│
└── js/
    ├── validation.js   # Shared validation utilities & helpers
    ├── login.js        # Login page logic
    └── register.js     # Registration page logic
```

---

## 🚀 How to Run

No build process or server required!

### Option 1: Direct Open
1. Clone or download the project
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)

### Option 2: Live Server (Recommended for development)
```bash
# If you have VS Code + Live Server extension
# Right-click index.html → "Open with Live Server"
```

### Option 3: Python HTTP Server
```bash
cd Task2
python -m http.server 8080
# Open http://localhost:8080
```

### Option 4: Node.js `serve`
```bash
npx serve Task2
```

---

## 🔑 Demo Credentials (Login Page)

| Email | Password | Name |
|-------|----------|------|
| `vishnu@demo.com` | `Vishnu@123` | Vishnu |
| `admin@apple.com` | `Admin@123` | Admin |
| `john@example.com` | `John@1234` | John |
| `demo@test.com` | `Demo@1234` | Demo User |

### Taken Usernames (Registration)
`admin`, `john`, `alex`, `emma`, `vishnu`, `test`, `demo`, `user`, `root`

---

## 📸 Screenshots Section

> Add screenshots here after opening in browser.

| Page | Desktop | Mobile |
|------|---------|--------|
| Login | *(screenshot)* | *(screenshot)* |
| Registration | *(screenshot)* | *(screenshot)* |

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0071E3` | Buttons, links, focus states |
| Background | `#F5F5F7` | Page background |
| Card | `#FFFFFF` | Auth card surface |
| Text | `#1D1D1F` | Primary body text |
| Secondary | `#6E6E73` | Subtitles, hints |
| Border | `#D2D2D7` | Input borders, dividers |
| Success | `#34C759` | Valid states, available |
| Error | `#FF3B30` | Error states, validation |

### Typography
- **Font**: Poppins (Google Fonts) → system-ui fallback
- **Weights**: 300 / 400 / 500 / 600 / 700 / 800

---

## 🔮 Future Improvements

- [ ] **Dark Mode** — Full dark mode with CSS custom property swap
- [ ] **OAuth Integration** — Real Google/Apple OAuth flows
- [ ] **2FA / OTP** — Two-factor authentication step
- [ ] **Form Animations** — Multi-step wizard with progress indicator
- [ ] **Biometric** — WebAuthn / passkey support
- [ ] **i18n** — Multi-language support
- [ ] **Backend** — Connect to Node.js + MongoDB or Supabase
- [ ] **PWA** — Service worker for offline support
- [ ] **Unit Tests** — Jest tests for all validation functions

---

## 👨‍💻 Author

**Vishnu** — ApexPlanet Internship Task 2

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  <p>Made with ❤️ and attention to every pixel</p>
  <p><strong>Lumina — Where beauty meets function</strong></p>
</div>
