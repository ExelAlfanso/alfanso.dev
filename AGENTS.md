# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `npm exec -- ultracite fix`
- **Check for issues**: `npm exec -- ultracite check`
- **Diagnose setup**: `npm exec -- ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `npm exec -- ultracite fix` before committing to ensure compliance.

---

# Feature Architecture

## Folder Structure

Use `src/features` for product sections or user-facing capabilities. Keep shared primitives outside features.

```text
src/
  components/          # shared UI primitives and app chrome
  constants/           # shared animation constants and helpers
  hooks/               # reusable hooks across features
  features/
    hero/
      components/
      data/
      types/
    about/
      components/
    experience/
      components/
      data/
      types/
    projects/
      components/
      data/
      types/
    tech-stack/
      components/
      data/
      types/
    contact/
      components/
```

Rules:

- Put code in a feature only when it belongs to that feature alone.
- Keep reusable primitives in `src/components`, reusable hooks in `src/hooks`, and shared animation helpers in `src/constants`.
- Add `hooks/`, `data/`, or `types/` inside a feature only when that feature actually needs them.
- Avoid barrel files. Import the exact file you need.

## Best Practices

### Naming

- Use kebab-case for file and folder names: `project-card.tsx`, `use-scroll-spy.tsx`.
- Use PascalCase for React component names and type names.
- Use camelCase for variables, functions, and local helpers.
- Keep data files singular by domain: `project-data.ts`, `timeline-data.ts`.
- Prefer `ProjectItem` over `ProjectItems` for one item type.

### Composition

Based on `.agents/skills/vercel-composition-patterns`:

- Start with plain composition and `children`; do not add context/providers until state must be shared across sibling or distant components.
- Avoid boolean prop growth. If a component gets mode flags like `isCompact`, `isModal`, `isFeatured`, create explicit composed variants instead.
- Keep state at the smallest parent that needs it. For example, project modal state belongs to the experience/projects boundary, not global app state.
- Use compound components only for genuinely complex reusable widgets.

### WCAG And UI

Based on `.agents/skills/wcag-audit-patterns` and Vercel Web Interface Guidelines:

- Use semantic HTML before ARIA: `button` for actions, `a` or router links for navigation, real headings for section titles.
- Every interactive element needs visible `focus-visible` styling.
- Modal/dialog behavior must include Escape close, focus containment, and focus return.
- Images need `alt`, `width`, and `height`; decorative images use `alt=""`.
- Do not hide important content behind hover only.
- Check contrast, keyboard operation, heading order, reflow at mobile widths, and reduced motion behavior before shipping.

### Animation And Motion

- Prefer `motion/react` for React UI animation. Avoid mixing `framer-motion` imports with `motion/react` in new code.
- Animate `transform` and `opacity`; avoid layout-heavy animations.
- Keep hooks at the top level. If each mapped item needs motion hooks, extract a child component.
- Use `MotionValue` for scroll-driven values and pass values down instead of recalculating in children.
- Respect `prefers-reduced-motion` for decorative or looping effects.
- Use GSAP only for timeline/text effects that `motion` does not handle cleanly.
- Use React Three Fiber/Three.js only for real 3D scenes; keep 3D feature components inside the owning feature.

### Quality Gates

- Run `npm run lint` and `npm run build` before shipping.
- Use Ultracite for formatting/fix hooks. Lefthook should run Ultracite, not a separate formatter stack.
- Current hook pattern:

```yaml
pre-commit:
  jobs:
    - run: npx ultracite fix
      stage_fixed: true
```

## Library Choices For Future Features

Use what is already installed first:

- UI and composition: React, TypeScript, Tailwind CSS.
- Routing: `react-router-dom`.
- Icons: `lucide-react`.
- UI motion: `motion` via `motion/react`.
- Advanced text/timeline animation: GSAP, only when `motion` is not enough.
- 3D: `three`, `@react-three/fiber`, `@react-three/drei`.
- Formatting and static checks: Ultracite/Biome, ESLint React Hooks.
- Git hooks: Lefthook running Ultracite.

Add new libraries only when the feature earns them:

- Forms: native forms first; add React Hook Form plus Zod when validation/state gets complex.
- Server state: fetch first; add TanStack Query when caching, retries, invalidation, or background refresh matter.
- Client state: React state first; add Zustand only for cross-feature client state.
- Accessible primitives: native HTML first; add Radix UI for complex dialogs, menus, popovers, tabs, or comboboxes.
- Tables: plain tables first; add TanStack Table for sorting/filtering/column state.
- Accessibility testing: add axe/Playwright integration when UI flows become testable end to end.

## References

- `.agents/skills/vercel-composition-patterns/SKILL.md`
- `.agents/skills/wcag-audit-patterns/SKILL.md`
- `.agents/skills/web-design-guidelines/SKILL.md`
- Vercel Web Interface Guidelines: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
- Existing Ultracite guidance: `AGENTS.md`, `biome.jsonc`, `lefthook.yml`
