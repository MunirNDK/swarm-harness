import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom theme colors (tailwind.config.ts). tailwind-merge doesn't know these by
// default, so without registering them it won't treat e.g. `text-accent` and
// `text-white` as conflicting — and a className override silently loses. Register
// them as color values for the text/bg/border groups so overrides resolve correctly.
const THEME_COLORS = [
  "bg", "surface", "surface2", "surface-dark", "surface-dark-2", "border",
  "fg", "fg-soft", "fg-faint", "muted",
  "accent", "accent-deep", "accent-mid", "accent-light", "accent-soft",
  "cta", "cta-fg", "trust", "trust-border", "trust-star", "urgency",
  "success", "warning", "danger", "info",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "text-color":   [{ text: THEME_COLORS }],
      "bg-color":     [{ bg: THEME_COLORS }],
      "border-color": [{ border: THEME_COLORS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
