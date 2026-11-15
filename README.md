# Enterprise Task Management API

> A portfolio-oriented REST API starter built with **NestJS, TypeScript, PostgreSQL, Prisma, and JWT**.

**Status:** Source code provided as a starter. Build, integration and deployment have **not been verified** in this environment. Do not present this as a deployed production system.

## Background

Teams need a consistent way to organise projects and track work. This repository explores the backend fundamentals of a multi-user task management service: account registration, authentication, project ownership, and task lifecycle updates. The emphasis is on clear API boundaries, data validation, and restricting each user to their own projects.

## Implemented in source
- Register and log in using bcrypt password hashes and JWT access tokens
- Create, list and delete projects belonging to the authenticated user
- Create, list, update and delete tasks inside owned projects
- Task status: `TODO`, `IN_PROGRESS`, `DONE`
- PostgreSQL schema managed with Prisma
- Request DTO validation and Swagger documentation at `/docs`
- Dockerfile, PostgreSQL Compose service, minimal Jest smoke test and CI workflow

## Quick start

Requirements: Node.js 20+, npm, Docker with Compose.

```bash
cp .env.example .env
# Set JWT_SECRET to a long random value in .env
docker compose up -d db
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

API: `http://localhost:3000`; Swagger UI: `http://localhost:3000/docs`.

## API overview

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Register (`email`, `password`) |
| POST | `/auth/login` | Obtain access token |
| GET | `/projects` | List owned projects |
| POST | `/projects` | Create project (`name`, optional `description`) |
| DELETE | `/projects/:id` | Delete owned project |
| GET | `/projects/:projectId/tasks` | List project tasks |
| POST | `/projects/:projectId/tasks` | Create task (`title`, optional `description`) |
| PATCH | `/projects/:projectId/tasks/:id` | Update task (`title`, `status`) |
| DELETE | `/projects/:projectId/tasks/:id` | Delete task |

All project/task endpoints require `Authorization: Bearer <token>`.

### Example requests

```bash
curl -X POST http://localhost:3000/auth/register -H 'Content-Type: application/json' -d '{"email":"demo@example.com","password":"example-password-123"}'
curl -X POST http://localhost:3000/auth/login -H 'Content-Type: application/json' -d '{"email":"demo@example.com","password":"example-password-123"}'
# Copy access_token from login response
curl -X POST http://localhost:3000/projects -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' -d '{"name":"Website launch"}'
```

## Design
See [architecture and next steps](docs/ARCHITECTURE.md).

## Quality and limitations

Run `npm test` and `npm run build` locally. The included unit test is a basic smoke test, not comprehensive coverage. There is no deployed demo, refresh-token flow, role-based authorization guard, pagination, or production monitoring. The schema defines `ADMIN` and `USER` roles but **does not implement role-based access control**. Add these before claiming those features.

## Suggested next steps
1. Run the project locally and resolve any environment-specific issues.
2. Add integration tests for authentication and ownership boundaries.
3. Add proper role-based permissions and API pagination.
4. Deploy to a hosting provider and document the real URL only after verifying it.

## Portfolio note

This is a learning/portfolio starter. Explain which parts you personally implemented or modified when discussing it in interviews.
