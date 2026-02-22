/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const SPACING_BASE = 8;

/** Returns spacing in px based on 8px grid. spacing(1) = 8, spacing(2) = 16, spacing(0.5) = 4 */
export const spacing = (n: number): number => n * SPACING_BASE;

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const tintBackgroundLight = "#E0F2F7";
const tintBackgroundDark = "rgba(255, 255, 255, 0.15)";
const positiveAmountLight = "#22c55e";
const positiveAmountDark = "#4ade80";
const separatorLight = "rgba(128, 128, 128, 0.2)";
const separatorDark = "rgba(128, 128, 128, 0.15)";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    background: "#fff",
    tint: tintColorLight,
    tintBackground: tintBackgroundLight,
    positiveAmount: positiveAmountLight,
    error: "#ffa2a2",
    inputBackground: "#f1f3f4",
    surface: "#fff",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    separator: separatorLight,
    button: {
      primary: {
        background: tintBackgroundLight,
        text: tintColorLight,
      },
      tint: {
        background: tintColorLight,
        text: "#fff",
      },
      error: {
        background: "#ffa2a2",
        text: "#fff",
      },
      secondary: {
        background: "#e8eaed",
        text: "#11181C",
      },
    },
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    background: "#151718",
    tint: tintColorDark,
    tintBackground: tintBackgroundDark,
    positiveAmount: positiveAmountDark,
    error: "#b86b6b",
    inputBackground: "#1f2326",
    surface: "#252a2e",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    separator: separatorDark,
    button: {
      primary: {
        background: tintBackgroundDark,
        text: tintColorDark,
      },
      tint: {
        background: tintColorDark,
        text: "#11181C",
      },
      error: {
        background: "#b86b6b",
        text: "#fff",
      },
      secondary: {
        background: "#2d3236",
        text: "#ECEDEE",
      },
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
