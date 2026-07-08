# Sales Order Management System (OVGS) - Frontend Portal

This is the frontend implementation of the **Sales Order Management System (OVGS)**, designed as a Senior Frontend Developer technical challenge.

The project is implemented in **English** using modern React/Next.js practices, prioritizing **Clean Code**, **SOLID**, **Domain-Driven Design (DDD)**, and strict modularization constraints (functions $\le$ 20 lines, components $\le$ 200 lines).

---

## 🚀 Execution Instructions

### Local Development Server

To launch the hot-reloading development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Test Suites

To run unit and integration tests (Jest + React Testing Library):

```bash
npm run test
```

### Production Build

To test the production build compilation and static optimization output:

```bash
npm run build
```

---

## 🛠️ Technologies Used

- **Framework**: Next.js 16 (App Router, Client-side view providers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Global State / Workflows**: Redux Toolkit & Redux Saga
- **Server Caching**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod schema validation
- **Icons**: Lucide React
- **Testing**: Jest & React Testing Library (ts-jest)

---

## 🏛️ Architectural Decisions & Domain Modeling (DDD)

The project structure is organized following **DDD** and **Clean Architecture** patterns:

1. **Domain Layer** (`src/domain`):
   - Pure business rules and entities (`Customer`, `SalesOrder`, `Item`, `TransportType`, `AuditLog`).
   - Transition rules of order status workflow (`isValidStatusTransition`) and customer transport type authorization rules (`isTransportTypeAuthorizedForCustomer`).
2. **Infrastructure Layer** (`src/infrastructure`):
   - Simulated REST API database in-memory utilizing `localStorage` persistence (`mockDatabase.ts`) so page reloads do not wipe data.
   - Delay-mocked repository functions (`mockRepositories.ts`) to emulate server network requests.
3. **Application Layer** (`src/application`):
   - Redux store slices for UI active filters/tabs and transaction banners.
   - **Redux Saga middleware** coordinates transactional multi-step operations (e.g. updating order state and appending audit log details atomically).
4. **Presentation Layer** (`src/presentation`):
   - React components and custom styling. All components adhere to the `< 200 lines` rule, splitting functions into helper files when required.

---

## ⚙️ Persistence & Audit Log Strategy

- **Persistence**: Emulated using a `localStorage` database sync mechanism.
- **Audit Logs**: Any modification (creation, status update, scheduling change, transport mode change) is intercepted by **Redux Saga** which compiles the previous/next state snapshots, generates an audit entry, and saves it. The portal includes a detail panel to inspect raw payload changes.

---

## 📈 Scalability, Performance & Trade-offs

- **State Separation**: We separated UI state (Redux) from cached backend data (React Query). React Query avoids over-fetching through automatic cache management, while Redux Saga manages asynchronous workflows.
- **Micro-Animations**: Uses hover transforms, active tab indicator transitions, and bouncing toast messages.
- **Trade-offs**: LocalStorage is used for fast prototyping, but in a real-world system, it would be replaced by an actual REST client. Domain validation is executed client-side, but is designed to match backend constraints.

---

## 🔄 Release Flow (CI/CD)

This project uses **Semantic Release** to automate versioning via GitHub Actions.

Commit messages determine the next version:

- `feat:` → **Minor** (v0.2.0)
- `fix:` → **Patch** (v0.1.1)
- `BREAKING CHANGE:` in body → **Major** (v1.0.0)

The CI/CD pipeline runs on push to `main`:

1. **Quality** — lint, test, build
2. **Release** — generate changelog, bump version, create Git tag, publish GitHub Release
