/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const SPACING_BASE = 8;

/** Returns spacing in px based on 8px grid. spacing(1) = 8, spacing(2) = 16, spacing(0.5) = 4 */
export const spacing = (n: number): number => n * SPACING_BASE;

// Shared color values
const brand = { light: "#0a7ea4", dark: "#fff" };
const brandMuted = { light: "#E0F2F7", dark: "rgba(255, 255, 255, 0.15)" };
const textMuted = { light: "#687076", dark: "#9BA1A6" };
const error = { light: "#ffa2a2", dark: "#b86b6b" };
const onAccent = { light: "#fff", dark: "#11181C" };

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: textMuted.light,
    background: "#fff",
    tint: brand.light,
    tintBackground: brandMuted.light,
    positiveAmount: "#22c55e",
    error: error.light,
    inputBackground: "#f1f3f4",
    surface: "#fff",
    icon: textMuted.light,
    tabIconDefault: textMuted.light,
    tabIconSelected: brand.light,
    separator: "rgba(128, 128, 128, 0.2)",
    button: {
      primary: { background: brandMuted.light, text: brand.light },
      accent: { background: brand.light, text: onAccent.light },
      error: { background: error.light, text: onAccent.light },
      secondary: { background: "#e8eaed", text: "#11181C" },
    },
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: textMuted.dark,
    background: "#151718",
    tint: brand.dark,
    tintBackground: brandMuted.dark,
    positiveAmount: "#4ade80",
    error: error.dark,
    inputBackground: "#1f2326",
    surface: "#252a2e",
    icon: textMuted.dark,
    tabIconDefault: textMuted.dark,
    tabIconSelected: brand.dark,
    separator: "rgba(128, 128, 128, 0.15)",
    button: {
      primary: { background: brandMuted.dark, text: brand.dark },
      accent: { background: brand.dark, text: onAccent.dark },
      error: { background: error.dark, text: onAccent.dark },
      secondary: { background: "#2d3236", text: "#ECEDEE" },
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
