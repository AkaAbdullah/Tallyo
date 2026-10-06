"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_COOKIE, parseTheme, type Theme } from "@/lib/theme-cookie";

// The server renders the saved theme as a class on <html> (see app/layout.tsx), so no inline script is needed.
const listeners = new Set<() => void>();

function readTheme(): Theme {
  return parseTheme(document.cookie.match(new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`))?.[1]);
}

function readResolved(): "light" | "dark" {
  const theme = readTheme();
  if (theme !== "system") return theme;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);
  const resolvedTheme = useSyncExternalStore(subscribe, readResolved, () => "light" as const);
  const setTheme = useCallback((t: Theme) => {
    document.cookie = `${THEME_COOKIE}=${t}; path=/; max-age=31536000; samesite=lax`;
    const root = document.documentElement;
    root.classList.toggle("dark", t === "dark");
    root.classList.toggle("light", t === "light");
    listeners.forEach((l) => l());
  }, []);
  return { theme, resolvedTheme, setTheme };
}
