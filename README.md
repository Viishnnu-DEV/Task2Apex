# ✦ Lumina — Apple-Inspired Authentication UI

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</div>

<br />

> A premium, production-quality authentication UI inspired by Apple design principles. Built with pure HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript — no frameworks, no backend required.

---

## 🌟 Project Overview

Lumina is a **frontend-only** authentication system that showcases modern web design principles with a clean light emerald aesthetic. Every detail — from the minimalist card structure to real-time field validation, `localStorage` user persistence, and interactive toasts — is crafted for a smooth, cohesive user experience.

---

## ✨ Features

### Design & UX
- 🎨 **Light Emerald Theme** — Air mint-white background (`#F5FBFA`) with electric emerald CTA (`#0BA37F`)
- 🔤 **Plus Jakarta Sans Typography** — Geometric humanist typography for maximum legibility
- 📐 **Centered Solo Card** — Balanced layout focused entirely on the user's intent
- ✨ **Micro-Animations** — Staggered field reveals, button loading state, and smooth toast transitions
- 📱 **Fully Responsive** — Mobile-first design optimized for desktop, tablet, and mobile screens

### Login Page
- ✅ Real-time email & password validation
- ✅ `localStorage` dynamic account authentication for newly registered users
- ✅ Automatic email prefill from URL query parameters (`?email=...`)
- ✅ Password show/hide toggle
- ✅ Remember Me functionality
- ✅ Inline error banner with card shake feedback
- ✅ Forgot Password modal with email link reset simulation
- ✅ Social sign-in buttons (Google, Apple)

### Registration Page
- ✅ 6-field registration: Full Name, Username, Email, Phone, Password, Confirm Password
- ✅ Compact 2-column layout for Name/Username and Password/Confirm Password
- ✅ Real-time **Username availability check** (checks mock data & `localStorage`)
- ✅ Real-time **Password strength meter** (5 levels) & rules checklist
- ✅ **Dynamic user persistence** — registered accounts can immediately log in on the sign-in page
- ✅ Phone number validation with country code support
- ✅ Terms of Service modal with "I Agree" auto-check integration
- ✅ Instant transition and redirect to login with pre-populated email

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
| **Google Fonts (Plus Jakarta Sans)** | Premium typography |

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
| Token | Hex | Role |
|-------|-----|------|
| Background | `#F5FBFA` | Air mint-white canvas |
| Card Surface | `#FFFFFF` | Elevated white card |
| Primary CTA | `#0BA37F` | Electric emerald accent |
| Headings | `#0D2B22` | Deep forest green |
| Subtitles | `#5A7A72` | Muted sage |
| Borders | `#D6EDE8` | Soft mint borders |
| Success | `#22C55E` | Validation checkmarks |
| Error | `#EF4444` | Invalid field feedback |

### Typography
- **Font Family**: `Plus Jakarta Sans` (Google Fonts)
- **Weights**: 400 (Body), 500 (Subtitles), 600 (Labels/Buttons), 700/800 (Headings)

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
