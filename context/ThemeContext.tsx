import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

export type AppTheme = "light" | "dark";

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = Appearance.getColorScheme() || "light";
  const [theme, setTheme] = useState<AppTheme>(
    system === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener((prefs: any) => {
      // keep system in sync
      const sys = prefs.colorScheme || "light";
      setTheme(sys === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (t: AppTheme) => setTheme(t),
      toggleTheme: () => setTheme((s) => (s === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}
