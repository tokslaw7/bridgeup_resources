# BridgeUp

BridgeUp is a community resource board for families, caregivers, and advocates supporting special needs and developmental differences. It is a full-stack CRUD application where users can create, browse, edit, and delete community resources, while everyone can browse and filter the public listings.

## What It Does

- Browse community resources without logging in.
- Sign up and log in with JWT-backed authentication.
- Post a new resource when authenticated.
- Edit or delete only the resources you own.
- Filter resources by category and search by text.
- Seed the database with demo content for quick testing.

## Stack

- Frontend: React 19, React Router, Vite
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JSON Web Tokens, bcryptjs password hashing
- Tooling: ESLint, Vite dev proxy, Docker Compose for local PostgreSQL

## Project Structure

- `backend/` contains the Express API, PostgreSQL schema, seed script, and authentication middleware.
- `frontend/` contains the React UI, routing, API client, and resource forms.
- `docker-compose.yml` starts a local PostgreSQL container on port `5440`.

## Setup

### Prerequisites

- Node.js 18+ recommended
- Docker Desktop or another Docker-compatible runtime
- PostgreSQL access if you do not want to use Docker

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d db
```

This starts PostgreSQL with these defaults:

- Database: `bridgeup`
- User: `bridgeup`
- Password: `bridgeup`
- Host port: `5440`

### 2. Configure the backend environment

Create `backend/.env` with values similar to these:

```env
DATABASE_URL=postgres://bridgeup:bridgeup@localhost:5440/bridgeup
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
PORT=4500
```

`DATABASE_URL` is required. If it is missing, the backend will fail to start.

### 3. Install dependencies

In a separate terminal for each app:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 4. Create the schema and seed data

Run the migration script from the backend folder:

```bash
node src/db/migrate.js
```

Then load the demo records:

```bash
node src/db/seed.js
```

The seed script creates a demo account and sample resources for testing.

### 5. Start the apps

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend on `http://localhost:4500`.

## Demo Login

The seed data creates a demo user:

- Email: `toks@bridgeup.local`
- Password: `password123`

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Resources

- `GET /api/resources`
- `GET /api/resources/:id`
- `POST /api/resources`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`

### Supporting Routes

- `GET /api/categories`
- `GET /api/autism` is currently the database health-check route, even though the name reads like a resource route.

## Known Bugs / Rough Edges

- The health-check route is misnamed as `/api/autism`, which is confusing and easy to overlook.
- The resource form and API currently only persist `title`, `description`, and `category`, even though the database schema includes additional fields like `location`, `contact`, and `url`.
- Category validation is hard-coded in the backend, so changing categories requires editing server code instead of data.
- The backend returns generic `500` errors for uncaught failures, which makes route debugging harder than it needs to be.
- The frontend silently ignores category fetch failures, so the browse page can still render, but the filter list may be incomplete.

## What I Would Do Differently With Routes

If I were tightening up the route design, I would make the API more consistent and easier to maintain:

- Rename the health route from `/api/autism` to `/api/health` so it reflects its purpose.
- Keep resource-related endpoints under one router with predictable REST naming and avoid extra one-off routes unless they are truly shared utilities.
- Add explicit route versioning such as `/api/v1/...` if the app is expected to grow.
- Move shared constants like categories into a single source of truth so the frontend and backend do not drift apart.
- Return more specific validation and not-found responses from each route instead of relying on the same generic error handler for everything.
- Add route-level tests for authentication, ownership checks, and resource validation so regressions show up immediately.

## Future Improvements

- Persist and display the additional resource fields already present in the database schema.
- Add pagination for larger communities.
- Add richer filtering and sorting.
- Improve error messaging around failed auth and invalid resource payloads.
- Expand automated tests for both backend routes and frontend flows.

## License

No license is currently specified.
