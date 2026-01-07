import { useEffect } from "react";
import { useSettings } from "./useSettings";

export type Theme = "light" | "dark" | "system";

// Helper function to check system preference
function getSystemPreference(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Helper function to apply theme to document
function applyTheme(theme: Theme, prefersDark?: boolean) {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove("light", "dark");
  
  if (theme === "system") {
    // Use system preference
    const isDark = prefersDark ?? getSystemPreference();
    if (isDark) {
      root.classList.add("dark");
    }
  } else {
    // Apply explicit theme
    root.classList.add(theme);
  }
}

export function useTheme() {
  const { settingsData, setSettings } = useSettings();
  
  const theme = (settingsData?.Theme || "system") as Theme;

  // Apply theme to document
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(theme, e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    await setSettings({ Theme: newTheme });
  };

  return {
    theme,
    setTheme,
  };
}
