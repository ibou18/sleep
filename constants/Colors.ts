/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Palette inspirée de Tailwind CSS
export const Colors = {
  light: {
    text: "#0f172a", // slate-900
    background: "#f8fafc", // slate-50
    surface: "#ffffff", // white
    tint: "#2563eb", // blue-600
    muted: "#64748b", // slate-400
    accent: "#0657c0ff", // violet-600
    success: "#16a34a", // green-600
    danger: "#dc2626", // red-600
    icon: "#475569",
    tabIconDefault: "#94a3b8",
    tabIconSelected: "#2563eb",
    textShadow: {
      color: "#5e5c5cff",
      opacity: 0.5,
      offset: { width: 0, height: 2 },
      radius: 4,
    },
  },
  dark: {
    text: "#e6eef8", // near white
    background: "#0d1d3dff", // slate-950
    surface: "#08295dff",
    tint: "#60a5fa", // blue-400
    muted: "#94a3b8",
    accent: "#f57b56ff",
    success: "#4ade80",
    danger: "#f97316",
    icon: "#9aa6b2",
    tabIconDefault: "#6b7280",
    tabIconSelected: "#60a5fa",
    textShadow: {
      color: "#a49f9fff",
      opacity: 0.5,
      offset: { width: 0, height: 2 },
      radius: 4,
    },
  },
} as const;
