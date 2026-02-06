---
name: kith-ux-polisher
description: Enforces the Kith design system (Tailwind+Material), accessibility standards, and responsive behaviors. Use when creating new UI components, styling visualization charts (SVG/Canvas), or auditing UX consistency.
---

# Kith UX Polisher

This skill acts as the guardian of Kith's visual identity and user experience.

## Design System

### 1. Core Aesthetics
- **Rounded Corners**: Use `rounded-3xl` for main containers/modals, `rounded-2xl` for cards, `rounded-xl` for inputs/buttons.
- **Shadows**: Use soft, colored shadows for depth (e.g., `shadow-lg shadow-primary/20`).
- **Glassmorphism**: Use `backdrop-blur-md` and semi-transparent backgrounds (`bg-white/80`) for overlays and sticky headers.

### 2. Interaction Patterns
- **Modals**: Must have `animate-in fade-in zoom-in` entrance animations and close on backdrop click.
- **Buttons**:
    - Primary: `bg-primary text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]`
    - Secondary: `bg-slate-100 text-slate-600 hover:bg-slate-200`
- **Feedback**: All interactive elements must provide visual feedback (hover, active, focus states).

### 3. Data Visualization (Trees & Charts)
- **Consistency**: Use consistent node sizes (`w-40`, `h-16`) and stroke widths (`stroke-2`) across different tree views.
- **Lines**: Use orthogonal (right-angle) connectors with rounded corners for hierarchy.
- **Controls**: All charts must support Pan & Zoom interactions via consistent controls (top-right overlay).

## Accessibility & Responsiveness

### 1. Accessibility (a11y)
- **Contrast**: Ensure text passes WCAG AA. Use `text-slate-500` for secondary text, never lighter unless on dark backgrounds.
- **Labels**: All icon-only buttons MUST have an `aria-label` or `title`.
- **Keyboard**: Ensure all interactive elements are focusable and have visible focus rings (`focus:ring-2`).

### 2. Responsive Strategy
- **Mobile First**: Design for touch targets (min 44px) on small screens.
- **Overflow**: Complex charts should overflow with scroll (`overflow-auto`) on mobile rather than shrinking to illegibility.
- **Navigation**: Use the bottom navigation bar (`BottomNav.tsx`) pattern for mobile views.