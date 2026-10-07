import "server-only";
import { createGroq } from "@ai-sdk/groq";
import { generateText, Output } from "ai";
import { z } from "zod";

// Optional AI features. Everything here returns suggestions the user reviews before saving.
export const AI_MODEL = "openai/gpt-oss-120b";
export const aiEnabled = () => Boolean(process.env.GROQ_API_KEY);

function model() {
  return createGroq({ apiKey: process.env.GROQ_API_KEY })(AI_MODEL);
}

const call = { maxRetries: 1, timeout: 30_000, providerOptions: { groq: { reasoningEffort: "low", strictJsonSchema: true } } } as const;

// ---- Paste a message → client ----

const clientOut = z.object({
  name: z.string().describe("Registered company name, or the person's name for an individual. Empty if not present."),
  address: z.string().describe("Postal address, one line per row (street, postcode and city, country). Empty if not present."),
  country: z.string().describe("ISO 3166-1 alpha-2 code of the address country, e.g. DE. Empty if unknown."),
  email: z.string().describe("Billing email if present, else empty."),
  ids: z.array(z.object({ label: z.string(), value: z.string() })).describe("Tax and registration numbers, e.g. {label:'VAT ID', value:'DE330117786'}. Copy values exactly."),
  currency: z.string().describe("ISO 4217 code only if the message states a currency, else empty."),
  isBusiness: z.boolean().describe("True if the client is a company rather than a private person."),
});
export type ExtractedClient = z.infer<typeof clientOut>;

export async function extractClient(message: string) {
  const { output } = await generateText({
    ...call,
    model: model(),
    instructions:
      "You extract billing details for an invoice from a message a client sent. Use only what the message says; never invent or complete details. " +
      "Copy names, addresses and numbers exactly as written, including accents. Ignore the sender's own signature unless it is the billing entity. " +
      "Label tax numbers the way the message does (e.g. 'VAT ID', 'ID number', 'Steuernummer', 'Company number').",
    prompt: message,
    output: Output.object({ schema: clientOut }),
  });
  return {
    ...output,
    country: /^[A-Z]{2}$/.test(output.country.toUpperCase()) ? output.country.toUpperCase() : "",
    currency: /^[A-Z]{3}$/.test(output.currency.toUpperCase()) ? output.currency.toUpperCase() : "",
    ids: output.ids.filter((i) => i.value.trim()),
  };
}

// ---- Describe the work → line items ----

const itemsOut = z.object({
  items: z.array(
    z.object({
      title: z.string().describe("Short line-item title, e.g. 'Website development (Webflow)'."),
      bullets: z.array(z.string()).describe("Short points restating only work the description mentions for this item. Empty if it gives no detail."),
      qty: z.number().describe("Quantity. Use 1 for fixed-price work; hours or days when the description gives them."),
      price: z.number().describe("Unit price in the invoice currency. 0 if the description gives no way to price it."),
    }),
  ),
});
export type DraftedItems = z.infer<typeof itemsOut>["items"];

export async function draftItems(description: string, currency: string) {
  const { output } = await generateText({
    ...call,
    model: model(),
    instructions:
      `You turn a freelancer's rough description of their work into invoice line items. Currency: ${currency}. ` +
      "Write in clear, professional English that a client's accountant would understand. Keep titles short and specific. " +
      "Only use prices the description gives. If it gives a total and says how to split it (e.g. 'mostly the website'), split it so the items add up exactly to that total, using round numbers. " +
      "If no amounts are given, set price to 0. Never add items, discounts or taxes that were not described. " +
      "This goes on a real invoice: every point must be something the description says was done. Do not invent features, technologies, tests or outcomes. " +
      "Rephrase for clarity, but if the description gives no detail for an item, leave its points empty.",
    prompt: description,
    output: Output.object({ schema: itemsOut }),
  });
  return output.items.slice(0, 20).map((i) => ({
    title: i.title.trim(),
    bullets: i.bullets.map((b) => b.trim()).filter(Boolean).slice(0, 6),
    qty: Number.isFinite(i.qty) && i.qty > 0 ? i.qty : 1,
    price: Number.isFinite(i.price) ? Math.round(i.price * 100) / 100 : 0,
  }));
}

// ---- Tidy wording ----

const polishOut = z.object({ title: z.string(), bullets: z.array(z.string()) });

export async function polishItem(title: string, bullets: string[]) {
  const { output } = await generateText({
    ...call,
    model: model(),
    instructions:
      "You edit one invoice line item so it reads clearly and professionally. Keep the meaning, every fact, product name and number. " +
      "Fix spelling and grammar, use sentence case, keep the title under 60 characters, and keep each point short. Do not add new claims. " +
      "Return the same number of points unless two say the same thing.",
    prompt: JSON.stringify({ title, bullets }),
    output: Output.object({ schema: polishOut }),
  });
  return { title: output.title.trim(), bullets: output.bullets.map((b) => b.trim()).filter(Boolean) };
}
