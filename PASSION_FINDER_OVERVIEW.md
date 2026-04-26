# Project Overview: Passion Finder (Discovery System)

**Passion Finder** is a state-of-the-art, action-oriented self-discovery platform. It is designed to bridge the gap between "what people think they like" and "what they actually enjoy doing."

---

## 1. Non-Technical Overview

### Core Vision
Most personality tests stop at questions. Passion Finder requires **action**. It uses a "Feedback Loop" methodology (Detect -> Act -> Reflect) to provide high-accuracy career and growth recommendations.

### The 3-Level User Journey
The platform enforces a strict, premium progression system:
1.  **Level 0: Discovery (The Instinct Phase)** - Users answer questions to reveal their baseline traits (e.g., Creative, Analytical).
2.  **Level 1: Validation (The Action Phase)** - Users perform micro-tasks to "test" if they actually enjoy the work associated with those traits.
3.  **Level 2: Mastery (The Deep Dive)** - Final confirmation of their "Passion Zone" and generation of a comprehensive growth report.

### Key Product Features
*   **Persistent Progress**: Never lose your place. Sessions save automatically to the cloud.
*   **Premium Dashboard**: A "Quest-style" interface showing your level status and progress.
*   **Final Passion Report**: A personalized 10-point analysis of your personality type, career paths, and growth advice.
*   **Universal Access**: Seamless experience on Mobile, Tablet, or Laptop.

---

## 2. Technical Overview

### Tech Stack
*   **Frontend**: React 18 (Vite) - Chosen for high performance and component reusability.
*   **Backend**: Supabase (PostgreSQL) - Handles User Authentication, Database Storage, and Real-time data.
*   **State Management**: Centralized React State in `App.jsx` with a custom `storage.js` persistence layer.
*   **Design System**: Pure Vanilla CSS with a **Glassmorphic Aesthetic**. No heavy CSS frameworks (like Tailwind) are used, ensuring maximum performance and full design control.

### Core Components
*   **App.jsx**: The "Brain" of the application. It manages the state machine, level gating, and session loading.
*   **Dashboard.jsx**: The interaction hub. Uses a tiered card system to guide users through the 3 levels.
*   **Questions.jsx**: A dynamic engine that renders assessment questions and tracks scoring.
*   **Tasks.jsx**: Manages micro-challenges and verification logic.
*   **FinalReport.jsx**: An aggregation component that calculates dominant traits and generates the final report.

### Database Architecture
*   **`profiles`**: Stores user bio, goals, and metadata.
*   **`discovery_sessions`**: The "Heartbeat" table. Stores the current screen, level, and answers for every user.
*   **`discovery_history`**: Permanent storage for every completed level.
*   **`discovery_questions/tasks`**: Content tables managed by the Admin Dashboard.

---

## 3. Design & Responsiveness
The app uses a **Premium Dark Mode** with:
*   **Glassmorphism**: Cards use `backdrop-filter: blur(20px)` and semi-transparent borders.
*   **Fluid Layouts**: Custom `@media` queries and utility classes (`flex-column-mobile`, `grid-2-1`) ensure the app looks like a native app on mobile and a professional dashboard on laptop.
*   **Animations**: Custom keyframes for `pulse-glow`, `fadeInUp`, and `loading-spinner` provide a polished, high-end feel.

---

## 4. GitHub & Version Control
*   **Repository**: [charantejakumbaji/PassionFinder](https://github.com/charantejakumbaji/PassionFinder.git)
*   **Commit History**: Follows a structured update path (Authentication -> Core Flow -> 3-Level Progression -> Full Responsiveness).

---

## 5. Current Project Status
*   **Production Readiness**: 100%
*   **Bug Status**: No known critical bugs. FK-crash guards and redirect loops have been resolved.
*   **Scaling**: The platform is ready for thousands of users and dynamic content updates via the Admin panel.
