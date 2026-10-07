# Tallyo

Open-source invoicing for freelancers and small businesses, with AI that does the busywork.

**Live site:** [tallyo-dev.netlify.app](https://tallyo-dev.netlify.app)

> **Status:** early development, but the whole invoicing flow works: accounts, workspaces, settings, clients, invoices, PDF templates and the AI helpers.

## Features

- **Your own business**: company details, logo, tax numbers and bank details. Nothing is hard-coded.
- **Workspaces and teams**: run several businesses from one account and switch between them.
- **Clients**: saved addresses, VAT numbers, currency and a tax treatment suggested from their country.
- **Invoices**: auto-numbering, any currency, reverse-charge and export notes, partial payments, overdue tracking.
- **PDFs and templates**: four templates (Classic, Minimal, Bold, Compact) with your logo and brand colour. The live preview is the actual PDF, generated in the browser.
- **AI helpers** *(optional, via Groq)*: paste a client's email to fill in their company, address and VAT number; describe the work to draft line items; tidy the wording of an item. Results fill the form for you to check, and nothing is saved until you save. Without a `GROQ_API_KEY` the buttons don't appear.

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

## Adding an invoice template

Templates live in `src/pdf/templates/` and are built with [`@react-pdf/renderer`](https://react-pdf.org). Each one receives the same prepared data (`src/pdf/prepare.ts`), so totals and labels always match.

1. Copy an existing template, register it in `src/pdf/registry.ts` and `src/pdf/index.tsx`, and add it to the `invoiceTemplate` enums in the models and schemas.
2. Render it with sample data: `pnpm templates:render /tmp/templates` writes one PDF per template.
3. Make its thumbnail: `pdftoppm -png -r 72 -singlefile /tmp/templates/<id>.pdf public/templates/<id>`.

Two react-pdf quirks to keep in mind: set `lineHeight` on a wrapper `View` together with a `fontSize`, never on `<Page>` (it breaks page numbers), and give large text its own `lineHeight`.

## Credits, and an honest confession

Tallyo is built by [Syed Abdullah Hussain](https://github.com/AkaAbdullah), who had the idea, made the decisions, sent the invoices that started all this, and argued with the deploy logs.

Most of the frontend was written by Claude, an AI that has never once been paid on time, has never sent an invoice, and still has strong opinions about where the VAT number goes. It picked the font and named the colours (one of them is called "carbon", as if anyone still owns carbon paper) and spent a whole afternoon making sure "€3,650.00" didn't look like it was typed on a typewriter. It also put the "Save" button where its own error messages could cover it, then filed a bug report against itself.

If something looks thoughtfully designed, that was a team effort. If something is broken, it was obviously the AI.

## License

[MIT](LICENSE)
