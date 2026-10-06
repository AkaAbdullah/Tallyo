# Tallyo

Open-source invoicing for freelancers and small businesses, with AI that does the busywork.

**Live site:** [tallyo-dev.netlify.app](https://tallyo-dev.netlify.app)

> **Status:** early development. Accounts, workspaces, business settings, clients and invoices work. PDF download, invoice templates and the AI helpers are next.

## Features

- **Your own business**: company details, logo, tax numbers and bank details. Nothing is hard-coded.
- **Workspaces and teams**: run several businesses from one account and switch between them.
- **Clients**: saved addresses, VAT numbers, currency and a tax treatment suggested from their country.
- **Invoices**: live preview, auto-numbering, any currency, reverse-charge and export notes, partial payments, overdue tracking. PDF download and templates are coming next.
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

## Credits, and an honest confession

Tallyo is built by [Syed Abdullah Hussain](https://github.com/AkaAbdullah), who had the idea, made the decisions, sent the invoices that started all this, and argued with the deploy logs.

Most of the frontend was written by Claude, an AI that has never once been paid on time, has never sent an invoice, and still has strong opinions about where the VAT number goes. It picked the font and named the colours (one of them is called "carbon", as if anyone still owns carbon paper) and spent a whole afternoon making sure "€3,650.00" didn't look like it was typed on a typewriter. It also put the "Save" button where its own error messages could cover it, then filed a bug report against itself.

If something looks thoughtfully designed, that was a team effort. If something is broken, it was obviously the AI.

## License

[MIT](LICENSE)
