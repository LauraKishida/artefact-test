# Task-Efact

A modern full-stack task management app built for the **Artefact** evaluation project. It demonstrates end-to-end type safety, server-side prefetching, infinite scrolling, responsive design, and toast notifications.

Developed by **Laura Kishida**.

## Tech Stack

- **Next.js 15** (App Router, React 19)
- **tRPC v11**
- **Zod 3**
- **TanStack React Query v5**
- **Zustand 5**
- **Tailwind CSS v4**
- **TypeScript 5**

## Features

- Create, edit, and delete tasks
- UUID-based task IDs and Zod validation
- Cursor-paginated task list with newest/oldest sorting
- Infinite scrolling
- Server-prefetched homepage with Suspense hydration
- Toast notifications that persist across navigation
- In-memory task store seeded with 15 sample tasks

## Key Files

### Data & API

- `src/schemas/task_schema.ts` — Zod schema for tasks: UUID `id`, 1–200 char `title`, `creationDate`, optional `description`.
- `src/server/api/routers/task.ts` — tRPC task router with an in-memory global store.
  - `create`: creates a task with UUID and timestamp.
  - `byId`: returns a task or `NOT_FOUND`.
  - `list`: cursor-paginated pages of 10, supports ascending/descending order.
  - `update`: updates title/description; requires at least one field.
  - `delete`: removes a task or throws `NOT_FOUND`.

### Frontend

- `task-form-component.tsx` — shared create/edit form; supports delete in edit mode, cache invalidation, loading states, and flash notifications.
- `task-list/` — infinite-scrolling task list with sort toggle, task cards, delete action, and notification handling.
- `popup-token-component.tsx` — animated toast/banner component with success/warning/error/info types, auto-dismiss, and manual close.
- `store/popup-store.ts` — Zustand store for cross-page notifications.

### Pages

- `/` — prefetches the first task page and renders the list with Suspense.
- `/tasks/new` — create task page.
- `/tasks/[id]` — edit task page.

## Getting Started

### Prerequisites

- Node.js 18.17+ or 20+
- `npm`, `pnpm`, or `yarn`

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Highlights

- **End-to-end type safety** through shared Zod schemas and tRPC.
- **Fast initial rendering** via server-side prefetching and hydration.
- **Smooth UX** with infinite scrolling and non-intrusive toast notifications.

## Next Steps

### Front End

- Standardize and create atomized components (buttons, forms, etc.)
- Improve styling and visual consistency

### Back End

- Implement a persistent backend
- Improve queries with optimization and appropriate pagination
