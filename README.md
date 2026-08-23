# CartShare

A collaborative grocery list app for shared households. Roommates join a household with an invite code, add items to a shared list, claim items to buy, mark them purchased with a price, and see who owes whom based on what everyone spent.

**Stack:** React + TypeScript (Vite, Tailwind, MUI) on the frontend, Java + Spring Boot on the backend, PostgreSQL for storage, JWT for auth.

## Why this project

Most "shared list" demo apps skip the part that actually matters for roommates: money. CartShare tracks who bought what and computes a simple fair-share settlement (who owes whom, and how much) automatically from purchase history.

## Architecture

```
cartshare/
├── backend/    Spring Boot REST API (auth, households, grocery items)
└── frontend/   React + TypeScript client
```

The backend exposes a REST API secured with JWT. The frontend is a single-page app that authenticates, joins/creates a household, and talks to the API for everything else — no local-only state, all data is persisted server-side.

**Backend**
- Layered structure: `model` → `repository` → `service` → `controller`, with a separate `security` package for JWT issuing/validation and a `dto` package to keep entities off the wire.
- Stateless auth via Spring Security + JWT (no server-side sessions).
- CORS configured for local Vite dev origins.

**Frontend**
- Typed API layer (`services/`) — one file per resource (`authService`, `householdService`, `groceryService`) wrapping a shared Axios instance.
- Component tree split by feature: `auth/`, `household/`, `grocery/`.
- Fair-share settlement math (`Bills.tsx`) computes each member's balance from purchase history — no manual splitting.

## Running it locally

**Backend**
```bash
cd backend
# create a local PostgreSQL database named `cartshare` first
mvn spring-boot:run
# API available at http://localhost:8080/api
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# app available at http://localhost:5173
```

See `backend/README.md` for database setup and environment configuration.

## Status

Core flows work end to end: register/login, create or join a household, add/claim/complete grocery items, view purchase history, and see settlement balances. Not yet built: real-time sync between household members (currently requires a refresh to see others' changes) and push notifications.
