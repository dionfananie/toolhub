import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme type for the application.
 * 'dark' — Cinematic Discovery Language dark mode (default)
 * 'light' — Cinematic Discovery Language light mode
 */
export type Theme = "dark" | "light";

/**
 * Theme context value interface.
 */
interface ThemeContextValue {
  /** Current active theme */
  theme: Theme;
  /** Toggle between dark and light themes */
  toggleTheme: () => void;
  /** Set a specific theme */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "toolhub-theme";

/**
 * Reads the initial theme from localStorage, falling back to
 * prefers-color-scheme media query, then defaulting to 'dark'.
 * Safe for SSR — returns default when window is undefined.
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage may be blocked in some environments
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Applies the theme class to <html> and stores the preference.
 */
function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Inline script to inject into the HTML <head> to prevent FOUC.
 * This runs before React hydrates, setting the correct theme class
 * from localStorage or prefers-color-scheme.
 */
export function ThemeScript(): string {
  return `
    (function() {
      try {
        var theme = localStorage.getItem("${STORAGE_KEY}");
        if (theme !== "dark" && theme !== "light") {
          theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(theme);
      } catch(e) {}
      // Enable transitions after a tiny delay to avoid flash on load
      requestAnimationFrame(function() {
        document.documentElement.classList.add("theme-transitioning");
      });
    })();
  `;
}

/**
 * ThemeProvider — wraps the app and provides theme context.
 * Handles class-based theming on <html>, persistence to localStorage,
 * and smooth CSS transitions on toggle.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply theme on mount and on change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes when no stored preference exists
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setThemeState(mediaQuery.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useTheme — hook to access the current theme and toggle function.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
