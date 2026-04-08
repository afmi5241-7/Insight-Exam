# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Session-based via express-session + bcryptjs
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Font**: Tajawal (Arabic font from Google Fonts)
- **Layout**: Fully RTL (Right-to-Left) Arabic

## Applications

### Insight Exam (artifacts/insight-exam)
Arabic educational platform for analyzing past exam questions. Preview at `/`.

**Pages:**
- `/` — Landing page with hero, 3-step explanation, and CTAs
- `/login` — Login with email/password (demo: demo@insight.edu / demo123)
- `/register` — Create account
- `/dashboard` — User's courses list + summary stats
- `/courses/new` — Create a new course
- `/courses/:id` — Analytics dashboard with charts and smart recommendations
- `/courses/:id/questions` — Add questions to a course

**Features:**
- Authentication via express-session cookies
- Bar, Pie, Line charts via Recharts for analytics
- Smart Arabic recommendations based on question patterns
- Fully RTL Arabic interface with Tajawal font

### API Server (artifacts/api-server)
REST API serving at `/api`:
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user
- `GET/POST /api/courses` — Course CRUD
- `GET/DELETE /api/courses/:id` — Course by ID
- `GET/POST /api/courses/:id/questions` — Questions
- `GET /api/courses/:id/analytics` — Analytics data
- `GET /api/dashboard/summary` — Dashboard summary

## Database Schema

- **users**: id, name, email, password_hash, created_at
- **courses**: id, user_id, name, code, professor, created_at
- **questions**: id, course_id, text, chapter, question_type, difficulty, exam_period, created_at

## Demo Data

A seed user exists: `demo@insight.edu` / `demo123` with one course "هياكل البيانات والخوارزميات" (CS301) and 18 sample questions.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
