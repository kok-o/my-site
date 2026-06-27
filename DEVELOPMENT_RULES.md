# Development Rules — AI Developer Portfolio

> These rules are **non-negotiable**. Every contributor (human or AI) must follow them without exception.
> Violations must be corrected before any code is merged.

---

## 1. TypeScript

- **Never use `any`** — use `unknown`, generics, or proper types instead.
- Prefer `interface` for object shapes, `type` for unions/intersections/aliases.
- All function parameters and return types must be explicitly typed.
- Enable strict mode — `tsconfig.json` must have `"strict": true`.
- No `@ts-ignore` or `@ts-expect-error` without a co-located comment explaining exactly why.

---

## 2. React Component Architecture

### Server vs. Client Components

- **All components are Server Components by default.** Never add `'use client'` unless strictly required.
- **`'use client'` is only allowed when the component needs:**
  - `useState`, `useEffect`, `useRef`, `useReducer`, or any React hook
  - Browser-only APIs (`window`, `document`, `localStorage`, `navigator`)
  - Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
  - Third-party libraries that require client context (e.g. `framer-motion`, `next-themes`)
- Push `'use client'` boundaries as **deep** into the tree as possible. Never mark a layout or page Client unless unavoidable.
- Context providers that require client state (e.g. `ThemeProvider`) must be isolated in a dedicated `providers.tsx` file.

### Component Rules

- One component per file.
- All components must be exported as **named exports** AND a **default export**.
- Props interfaces must be defined directly above the component.
- No business logic in `page.tsx` — compose components there only.

---

## 3. Styling

- **No inline styles** — ever. Use Tailwind utility classes only.
- **No hardcoded color values** — always use CSS variables (`var(--background)`, `var(--accent)`, etc.) via Tailwind tokens.
- **No `style={{ ... }}`** on any JSX element.
- All animations must use Tailwind `transition-*` utilities or Framer Motion — not raw CSS in JSX.
- Follow the design system defined in `design_system.md` without deviation.
- `cn()` from `lib/utils.ts` must be used for conditional class merging — never string concatenation.

---

## 4. Images

- **Always use `next/image`** (`import Image from 'next/image'`) — never `<img>`.
- All images must have a descriptive, meaningful `alt` attribute.
- Hero images must use `priority` prop.
- All below-fold images must omit `priority` (lazy load is automatic).
- Provide explicit `width` and `height` to prevent layout shift.

---

## 5. Navigation

- **Always use `next/link`** (`import Link from 'next/link'`) — never raw `<a>` for internal links.
- `<a>` is only acceptable for external links (with `target="_blank"` and `rel="noopener noreferrer"`).

---

## 6. Code Quality

- **No code duplication** — extract repeated patterns into reusable components or utility functions.
- **Maximum reusability** — `SectionHeading`, `Badge`, `ScrollReveal`, etc. must be used consistently, never re-implemented per-section.
- No `console.log` in committed code.
- No commented-out code blocks.
- Keep components focused: if a component exceeds ~120 lines, consider splitting it.

---

## 7. Data & Constants

- All site data (name, bio, projects, skills, nav links) lives in `lib/constants.ts`.
- No hardcoded strings in component files (except labels for semantic HTML: `alt`, `aria-label`, etc.).
- All Framer Motion animation variants live in `lib/animations.ts`.

---

## 8. Accessibility

- Every interactive element must have a visible focus ring (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
- `<section>` elements must have an `aria-labelledby` pointing to their heading `id`.
- All icons used decoratively must have `aria-hidden="true"`.
- All icons used as interactive elements must have an `aria-label`.
- Text contrast must meet WCAG AA (4.5:1 body, 3:1 large text) in both light and dark modes.
- Respect `prefers-reduced-motion` — all Framer Motion animations must check `useReducedMotion()`.

---

## 9. Performance

- Dynamic import (`next/dynamic`) for any component that is heavy and below the fold.
- Never block the main thread with synchronous operations.
- `will-change` CSS property must be used sparingly — only when actively animating.
- Animate only `transform` and `opacity` — never animate `width`, `height`, `top`, `left`, or `margin`.

---

## 10. File Naming

| Item | Convention | Example |
|---|---|---|
| Components | `kebab-case.tsx` | `project-card.tsx` |
| Utilities | `kebab-case.ts` | `animations.ts` |
| Types | `kebab-case.ts` | `types.ts` |
| Pages | `page.tsx` (Next.js convention) | `app/page.tsx` |
| Layouts | `layout.tsx` (Next.js convention) | `app/layout.tsx` |

---

## Quick Checklist Before Every Commit

- [ ] No `any` type used
- [ ] No inline styles (`style={{ }}`)
- [ ] No raw `<img>` or `<a>` for internal links
- [ ] No `console.log`
- [ ] `'use client'` only where genuinely needed
- [ ] Tailwind classes only — no hardcoded colors
- [ ] `cn()` used for conditional class merging
- [ ] All images have meaningful `alt` text
- [ ] Interactive elements have focus rings
- [ ] `prefers-reduced-motion` respected
