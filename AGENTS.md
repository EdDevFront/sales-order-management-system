<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Coding Guidelines & Technical Constraints

All coding agents working on this project must strictly adhere to the following rules:

## 1. Coding Style & Limits

- Keep all functions under **20 lines** of code.
- Keep all components under **200 lines** of code. If a component grows larger, break it down into subcomponents.

### Practical Rules for Component Splitting

Even before reaching the 200-line limit, use these triggers to extract new components:

- **Immediate Readability Rule**: If you need to scroll the screen to understand what the component does, it is already too large and should be divided.
- **Sub-component Extraction**: If the main file is approaching 150 lines and contains lists (`.map()`), modals, or internal forms, extract these pieces into separate files (typically 20 to 30 lines).
- **State Isolation**: If a block of code requires its own local state (`useState`) that the rest of the file does not need, extract it to a new file to avoid unnecessary re-renders.

## 2. Variable & Function Naming

- Variables representing checks, conditions, or business rules must have highly descriptive and specific names (e.g., `isLegalPerson` or `isTransportTypeAuthorizedForCustomer` instead of generic names).
- **The use of `any` is strictly forbidden.** Every value must have a proper TypeScript type. Use `unknown` when the type is truly not known, then narrow it with type guards.

## 3. Architecture Principles

- Strictly follow **SOLID** design principles.
- Adhere to **Domain-Driven Design (DDD)** practices. Segregate core business logic (Domain), data layers (Infrastructure), state workflows (Application), and components (Presentation).
- Use **Composition Patterns** for shared UI: prefer compound/composition components (e.g., `DataTable`, `DataTable.Head`, `DataTable.Body`) over copy-pasting HTML structures across templates.

## 4. Language & Commits

- All code, comments, variables, and documentation must be written in **English**.
- Git commits must strictly follow **Conventional Commits** in English.

## 5. Senior Behavioral Role

- Always act and write code like a Senior Frontend Developer, prioritizing performance optimization, robust state management, clean component segregation, and clear technical decisions.

## 6. UI Component Rules

- **All HTML native inputs** (`<input>`, `<select>`, `<textarea>`) must be replaced by custom-styled components from `src/components/ui/`.
- Use **Shadcn-style** UI primitives (Button, Input, Select, DatePicker) throughout — never raw HTML inputs in templates.
- Use **`DataTable`** composition component for all tabular data: `<DataTable>`, `<DataTable.Head>`, `<DataTable.Body>`, `<DataTable.Row>`, `<DataTable.Cell>`, `<DataTable.Footer>`.
- **Skeletons** must only be used where async data fetches happen. They must reflect the visual structure of the final loaded state (matching column count and approximate widths).
- **Empty states** must always be present:
  - If there is no data at all, show an inbox/empty icon with a descriptive message.
  - If filters are active but yield no results, show a "No results match your filters" message with a **Clear filters** button.
- **Clear Filters button** must only appear on pages/sections that actually have active filter controls (e.g., Dashboard). Never show it on unfiltered pages.

## 7. Performance & Memoization

- Wrap expensive derivations (e.g., filtered/sorted/paginated lists) in `React.useMemo`.
- Wrap event handlers passed as props in `React.useCallback`.
- Extract module-level constants (e.g., `ITEMS_PER_PAGE = 8`, column definitions) to avoid re-creating arrays on every render.

## 8. Pagination

- Every page with a table/list must implement pagination using the shared `DataTable.Footer` (backed by `Pagination` component).
- Default page size: **8 items per page**.
- `paginatedItems` must be derived via `useMemo`.
- Reset `currentPage` to `1` whenever filters change.

## 9. File Structure

```
src/
├── app/               # Next.js routes — page.tsx files only,
├── components/
│   ├── ui/            # Reusable, generic UI primitives (Button, Input, DataTable, etc.)
│   │   └── <component>/
│   │       ├── index.tsx              # Component entry/container
│   │       ├── types/                 # Component-scoped types
│   │       └── constants/             # Component-specific constants
│   │
│   └── templates/     # Domain/page-level components
│       └── <page>/
│           ├── index.tsx              # Entry/container component
│           ├── components/            # Sub-components specific to this page
│           ├── hooks/                 # Custom hooks (e.g. useOrderFilters)
│           ├── types/                 # Page-scoped TypeScript interfaces & enums
│           ├── context/               # React context (only if deep prop drilling exists)
│           ├── schemas/               # Zod validation schemas (only if page has forms)
│           ├── constants/             # Module-level constants (columns, status maps…)
│           └── utils/                 # Pure helper functions (formatters, variant maps…)
│
│   ⚠️  Only create the folders a page/component actually needs.
│       Do NOT create empty folders as boilerplate.
│
├── infrastructure/    # Data access (repositories, API clients)
├── stores/            # Redux store, slices, sagas, actions
└── types/             # Global TypeScript type definitions
```

## 10. Commits Convention

Always use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `chore:` — dependency updates, config, tooling
- `docs:` — documentation only changes
- `style:` — formatting changes
- `perf:` — performance improvements

**Version tags are only generated when the commit message contains one of these markers:**

- `[FEATURE]` → **Minor** version bump
- `[PATCH]` → **Patch** version bump
- `[BREAKING]` → **Major** version bump

The marker can appear anywhere in the commit subject (e.g. `feat: [FEATURE] add customer export` or `[PATCH] fix pagination bug`).

## 11. Release Flow (CI/CD)

This project uses **Semantic Release** to automate versioning via GitHub Actions.

Commit messages determine the next version:

- `feat:` → **Minor** (v0.2.0)
- `fix:` → **Patch** (v0.1.1)
- `BREAKING CHANGE:` in body → **Major** (v1.0.0)

The CI/CD pipeline runs on push to `main`:

1. **Quality** — lint, test, build
2. **Release** — generate changelog, bump version, create Git tag, publish GitHub Release
