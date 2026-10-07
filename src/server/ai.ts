"use server";

import { aiEnabled, draftItems, extractClient, polishItem } from "@/lib/ai-tasks";
import { requireWorkspace } from "@/server/session";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// A light per-user limit so a shared Groq key can't be drained. In-memory: resets on restart and per server instance.
const WINDOW_MS = 10 * 60_000;
const LIMIT = 30;
const usage = new Map<string, number[]>();

async function guard(input: string, max: number): Promise<string | null> {
  if (!aiEnabled()) return "AI features are turned off. Add a GROQ_API_KEY to enable them.";
  const { user } = await requireWorkspace();
  const now = Date.now();
  const recent = (usage.get(user.id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return "You've used the AI a lot in the last few minutes. Try again shortly.";
  usage.set(user.id, [...recent, now]);
  if (!input.trim()) return "Write or paste something first.";
  if (input.length > max) return `That's too long. Keep it under ${max.toLocaleString()} characters.`;
  return null;
}

async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    console.error("[ai]", e);
    return { ok: false, error: "The AI couldn't do that just now. Try again, or fill it in yourself." };
  }
}

export async function aiExtractClient(message: string) {
  const blocked = await guard(message, 4000);
  if (blocked) return { ok: false, error: blocked } as const;
  return run(() => extractClient(message));
}

export async function aiDraftItems(description: string, currency: string) {
  const blocked = await guard(description, 3000);
  if (blocked) return { ok: false, error: blocked } as const;
  return run(() => draftItems(description, /^[A-Z]{3}$/.test(currency) ? currency : "USD"));
}

export async function aiPolishItem(title: string, bullets: string[]) {
  const text = [title, ...bullets].join("\n");
  const blocked = await guard(text, 2000);
  if (blocked) return { ok: false, error: blocked } as const;
  return run(() => polishItem(title, bullets));
}
