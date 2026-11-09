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

## Author commentaries

This app was developed with the constraints determined by the Artefact technical case. In this section, I comment a bit about my design choices and why some implementations are as they are.

### Back end

The current implementation uses a Map with an UUID as a key and the task data as its value. (`src/server/api/routers/task.ts`)

A real implementation would require authentication for data security and a database for persistence between deployments. Also, many optimizations in the back-end would be necessary since the database can get quite large.

The implementation of the database would change the logic inside the endpoints, but their functionality would remain mostly the same (despite some optimizations in the pagination).

### Front end

This is the part I spent most of the time developing. I decided to create a very subdivided approach, where I have some components I broke down. For example, I created the components in `task-list/` just to improve readability in the home page. I don't like writing front end code with super nested files and long pages with multiple callback functions and hooks, so I figured this was more appropriate.

I also broke down some components that are common into some pages, like the `task-form-component.tsx` that appears in the edit task and new task page. This avoids redundancy.

Finally, I prioritized user experience by reducing interactivity in some edge cases (for example, when the user tries to click the task after they have deleted it). By adding some loading states, this avoids some pesky users into getting stuck onto some weird pages -- although I also implemented some error messages in case that happened.

## Next Steps

### Authentication

- Create method to make tasks private and only accessible by each user with an adequate login method
- Use tokens to check current user and authentication for each information/request.

### Front End

- Standardize and create atomized components (buttons, forms, etc.)
- Improve styling and visual consistency

### Back End

- Implement a persistent backend
- Improve queries with optimization and appropriate pagination
