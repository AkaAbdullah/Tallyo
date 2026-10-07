# Contributing to Tallyo

Thanks for helping. Tallyo is a small codebase on purpose, and it should stay easy to read.

## Setup

You need Node.js 20.9 or newer and pnpm.

```bash
pnpm install
cp .env.example .env.local   # set BETTER_AUTH_SECRET; leave MONGODB_URI empty for now
pnpm dev
```

With `MONGODB_URI` empty, `pnpm dev` starts a throwaway in-memory MongoDB, so you can sign up and click around straight away. Data resets when the server restarts. On the dashboard, **Add sample data** fills a new workspace with clients and invoices.

Add `GROQ_API_KEY` to try the AI helpers. A free key from [console.groq.com](https://console.groq.com/keys) is enough.

## Before you open a pull request

```bash
pnpm lint
pnpm typecheck
pnpm build
```

CI runs the same three checks on every pull request.

## Where things live

| Path | What it is |
| --- | --- |
| `src/app/(site)` | The public website: landing, features, pricing, self-hosting |
| `src/app/(app)` | The signed-in app: dashboard, invoices, clients, settings |
| `src/server` | Server actions and queries. Every one checks the signed-in workspace |
| `src/models` | Mongoose models: `Business`, `Client`, `Invoice` |
| `src/lib/schemas.ts` | Zod schemas shared by forms and server actions |
| `src/lib/money.ts` | Totals, rounding and date formatting. Used by the editor, server and PDFs |
| `src/lib/tax.ts` | Tax treatments and the note presets |
| `src/lib/ai-tasks.ts` | The AI prompts and their output schemas |
| `src/pdf` | Invoice templates (`@react-pdf/renderer`) |

Accounts and workspaces come from [Better Auth](https://better-auth.com). Each workspace is a Better Auth organization, and every query filters by its `organizationId`.

## Guidelines

- **Scope every query to the workspace.** Use `requireWorkspace()` and filter by `organizationId`. Never trust an id from the client on its own.
- **Write for the people using it.** Interface text is plain and specific, and buttons say what they do ("Save draft", not "Submit"). Error messages say how to fix the problem.
- **Keep the AI honest.** Prompts must not invent work, numbers or legal claims. AI output fills a form for the user to review; it never saves anything directly.
- **No real data.** Use fictional companies in code, tests and screenshots.
- **Dates are calendar dates.** Invoice dates are stored as `YYYY-MM-DD` strings to avoid time-zone bugs.

## Adding an invoice template

See [Adding an invoice template](README.md#adding-an-invoice-template) in the README.

## Reporting bugs and ideas

Use the [issue forms](https://github.com/AkaAbdullah/Tallyo/issues/new/choose). For security problems, see [SECURITY.md](SECURITY.md).
