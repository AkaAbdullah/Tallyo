export const THEME_COOKIE = "tallyo-theme";
export type Theme = "light" | "dark" | "system";

export const parseTheme = (value: string | undefined): Theme =>
  value === "light" || value === "dark" ? value : "system";
