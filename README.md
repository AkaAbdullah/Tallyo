# Tallyo

Open-source invoicing for freelancers and small businesses, with AI that does the busywork.

> **Status:** early development. Accounts, workspaces and onboarding work; invoices, clients and PDFs are in progress.

## Features

- **Your own business**: company details, logo, tax numbers and bank details. Nothing is hard-coded.
- **Workspaces and teams**: run several businesses from one account and switch between them.
- **Invoices** *(in progress)*: live preview, auto-numbering, any currency, reverse-charge and export notes, PDF download.
- **AI helpers** *(planned, via Groq)*: turn a client's message into a client record, draft line items from a description, and tidy up wording.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · MongoDB + Mongoose · Better Auth · Zod

## Getting started

Requirements: Node.js 20.9+ and pnpm.

```bash
pnpm install
cp .env.example .env.local   # then fill in BETTER_AUTH_SECRET
pnpm dev
```

Open http://localhost:3000.

**Database:** leave `MONGODB_URI` empty in development and Tallyo starts a throwaway in-memory MongoDB (data resets on restart). To keep data, set `MONGODB_URI` to any MongoDB connection string. A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works well. Production requires `MONGODB_URI`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Production | MongoDB connection string |
| `BETTER_AUTH_SECRET` | Yes | Long random string, e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Yes | The URL the app is served from |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | Enables "Continue with GitHub" |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Enables "Continue with Google" |
| `GROQ_API_KEY` | No | Enables the AI features |

## License

[MIT](LICENSE)
