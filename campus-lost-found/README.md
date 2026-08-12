# Campus Lost & Found Portal

A MERN-stack platform where verified students, staff, faculty, and workers
can report lost/found items and safely reclaim them through a
proof-of-ownership claim workflow.

## Status

🚧 Backend auth system is built and tested. Items, claims, and admin routes
are next. Frontend has not been started yet.

## Tech stack

- **MongoDB** + Mongoose — database
- **Express.js** — REST API
- **React** (Vite) — frontend (not yet scaffolded)
- **Node.js** — runtime
- JWT auth, bcrypt password hashing, Zod validation, Helmet + rate limiting

## What's built so far

- `User`, `Item`, `Claim` Mongoose models with indexes
- Registration restricted to campus email domain
- Password hashing (bcrypt) and JWT-based sessions
- Email verification flow (token generated; actual email sending is a TODO)
- Centralized error handling, input validation (Zod), rate limiting on auth routes
- `role` (user/admin) kept separate from `designation` (student/staff/worker/faculty)
  so access control logic never has to branch on more than two values
- `verificationStatus` field ready for the admin ID-approval workflow (queue and
  routes not built yet)

## Getting started (backend)

```bash
cd server
npm install
cp .env.example .env   # fill in your own MongoDB URI and JWT secret
npm run dev
```

Server runs on `http://localhost:5000` by default. Health check:
`GET http://localhost:5000/api/health`

## API — implemented so far

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register (campus email required) |
| GET | `/api/auth/verify-email/:token` | Public | Confirm email |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/auth/me` | Private | Get current user |

## Next up

1. Item routes (report, browse, search, filter)
2. Claim routes (submit, approve, reject)
3. Admin routes (verification queue, dashboard stats, resolve items)
4. Cloudinary integration for image uploads
5. React frontend
