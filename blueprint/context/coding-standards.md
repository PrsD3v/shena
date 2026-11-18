# Coding Standards

> Conventions for Shena, tuned by `/onboard` to the stack found at setup:
> Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4,
> shadcn/ui on Base UI, npm. Edit freely; the workflow reads this file before
> changing code.

## TypeScript

- Strict mode is on in `tsconfig.json`. Keep it on.
- No `any` types - use a real type, or `unknown` narrowed at the boundary.
- Import through the `@/*` alias (maps to `src/*`) instead of long relative paths.
- Define interfaces for props, API responses, and data models; rely on inference
  for obvious local values.
- Typechecking is `tsc --noEmit`; there is no compiler emit step.

## React

- Functional components only, no class components.
- React Compiler is enabled (`reactCompiler: true` plus
  `babel-plugin-react-compiler`), so do not add `useMemo`, `useCallback`, or
  `memo` by default. Write plain code and let the compiler memoize; add manual
  memoization only with measured evidence.
- Keep components focused - one job per component.
- Extract reusable stateful logic into custom hooks under `src/hooks/`.

## Next.js

- App Router only, rooted at `src/app`. Server components by default.
- Add `'use client'` only for interactivity, hooks, or browser APIs.
- Use Server Actions for mutations and form submissions. Use route handlers when
  you need webhooks, uploads, custom status codes or headers, or a non-UI client.
- `cacheComponents` and `partialPrefetching` are enabled in `next.config.ts`.
  Keep data fetching compatible with them and prefer caching at the data source
  over client-side workarounds.
- Dynamic routes for item and collection pages.

## File Organization

Paths follow the aliases in `components.json`:

- Routes: `src/app/[route]/page.tsx`, with layouts in the same folder
- shadcn/ui primitives: `src/components/ui/`
- Feature components: `src/components/[feature]/ComponentName.tsx`
- Hooks: `src/hooks/[name].ts`
- Server Actions: `src/actions/[feature].ts`
- Types: `src/types/[feature].ts`
- Shared helpers: `src/lib/[utility].ts`

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: match the component name; helpers use one consistent casing per folder
- Functions and variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types and interfaces: PascalCase, no `I` prefix

## Styling

- Tailwind CSS v4, CSS-first. Design tokens live in `src/app/globals.css` under
  `@theme inline`; there is no `tailwind.config.js`.
- shadcn/ui components use `components.json` style `base-nova` on Base UI
  primitives (`@base-ui/react`) with `lucide-react` icons. Add primitives with the
  shadcn CLI rather than hand-rolling them.
- Merge and conditionally compose classes with `cn` from `@/lib/utils`.
- Theme through the CSS variables and `.dark` class already in `globals.css`.
  Don't hardcode color values in components.
- No inline `style` attributes.

## Data

- No database, ORM, or auth provider is configured yet. When one is added,
  record its migration and query conventions here before the first feature that
  uses it.
- No validation library is installed. Validate untrusted input at the boundary
  (server action or route handler) and scope user-owned reads and writes to the
  authenticated user once auth exists.

## Error Handling

- Fail at the boundary: validate inputs in the server action or route handler,
  not deep inside rendering.
- Return explicit, typed results from actions instead of throwing at the client,
  and render a visible error state.
- Never swallow errors silently. No toast or error-tracking library is installed
  yet.

## Testing

The project installs no test runner; testing is opt-in at the project level.
Adding unit testing is an explicit setup task, either as a build-plan item or
with `/tests`. The setup should choose the stack-native runner, wire the
scripts or commands, add a small example test, and update the Commands section
of `AGENTS.md`.

When `AGENTS.md` declares a `Verify` command, treat it as the umbrella automated
gate. It combines only the checks this project actually has, in this order when
available: typecheck, tests, then build. The command does not enable an absent
test runner or replace focused evidence. It gives local work and optional CI one
exact command to run. `/ci` owns Verify and CI setup. `/tests` adds the real test
command to Verify when it already exists, but never creates CI only because
testing was configured.

**The opt-in switch is one signal: a `test` command in the Commands section of
`AGENTS.md`.** Declare one and **tests become a gate for logic-bearing steps**,
not an optional extra; leave it out and the loop verifies logic with the evidence
it already uses (run it, a screenshot, the build). Adding the runner is itself a
deliberate step, never a silent mid-step install. This is the single definition
of the switch; the skills and `ai-interaction.md` only point back here.

- **What to test (the scope rule):** pure logic where a wrong answer is possible -
  parsers, formatters, validators, id/slug builders, server actions. These have
  assertable inputs and outputs and real edge cases (empty, missing, malformed).
- **What not to test:** UI components and integration-level surfaces (render or
  export routes, anything driving a real browser or external service). Verify those
  with a screenshot and the build, not brittle unit tests.
- **The gate (when a runner is configured):** a build step that adds in-scope logic
  must ship a passing test in the same reviewable diff. The project's test command
  must be green before the step is approved, before any checkpoint commit, and
  before `/complete` merges. UI and integration-only steps are exempt and ride on
  screenshot plus build evidence.
- **When it's named:** the `/feature` spec's Testing section predicts the coverage,
  `/implement` writes the test with the step, and if a step surfaces logic the spec
  didn't foresee, add a focused test then.
- An empty suite should fail, not pass, so "no tests ran" never looks like "passed".
- Test files live next to source files (for example `feature.test.ts`).
- Run them via the project's test command (see Commands in `AGENTS.md`), not a
  hardcoded tool name.

Stack binding (swap for yours): a TypeScript app uses Vitest, `vi.mock()` for
external dependencies, and `vi.useFakeTimers()` for time-dependent logic; a
Python app would use pytest; a Go app `go test`.

## Browser Verification

For UI and integration behavior, prefer real browser evidence over reading the
code and assuming it works.

- Browser automation is separately opt-in through `/tests browser`. That setup
  reuses a compatible runner or prefers Playwright for supported projects, then
  documents the exact command as `Browser tests` in `AGENTS.md`.
- When `Browser tests` is declared, add focused coverage for stable behavioral
  done-whens when it is proportionate, and run the documented command during
  `/check`. Do not assume it proves visual fidelity, real authenticated-profile
  behavior, browser chrome, or another claim the test does not observe.
- If no Browser tests command is declared, do not add a runner silently in the
  middle of an unrelated feature. Use the available dev server, browser
  screenshots, build output, API output, or manual evidence instead.
- Browser tests are not part of the default Verify command or CI unless the user
  separately chooses that slower gate.
- Browser evidence is especially important for flows that click, type, submit,
  navigate, download files, render complex layouts, or depend on client-side
  state.

## Code Quality

- No commented-out code unless specified
- No unused imports or variables (`npm run lint` covers this)
- Keep functions under 50 lines when possible

## Comments

Write code that explains itself; comment only what the code cannot say.
Over-commenting is a common AI tell, so resist it.

- Comment the **why**, not the **what**. Delete any comment that restates the code.
- No banner/header blocks, section dividers, or step-by-step narration of obvious
  code. A file does not need a comment announcing each region.
- A comment earns its place only when it captures something the code can't: a
  non-obvious decision, a gotcha or workaround, why a value is what it is, or a
  link to a spec or issue.
- Prefer self-documenting names and small functions over explanatory comments.
- Keep doc comments minimal: a one-line purpose on an exported type or function is
  plenty; don't write JSDoc that just repeats the signature.
- When in doubt, leave the comment out.

## Writing

- No em dashes (U+2014) in generated content: docs, comments, commit messages,
  READMEs, specs. They read as AI-generated.
- Use a hyphen for `term - description` separators; rephrase prose with commas,
  parentheses, or a colon. Avoid en dashes and the ellipsis character too.
