import { useTheme } from "~/lib/theme-context";

/**
 * Sun icon — shown in dark mode (clicking switches to light).
 */
function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

/**
 * Moon icon — shown in light mode (clicking switches to dark).
 */
function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * ThemeToggle — A glassmorphic pill-shaped button that toggles
 * between dark and light themes.
 *
 * - Shows a sun icon in dark mode (inviting the user to brighten)
 * - Shows a moon icon in light mode (inviting the user to darken)
 * - Uses the theme context from ThemeProvider
 * - Glassmorphic styling with backdrop-blur
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full glass text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Icon */}
      <span className="relative z-10 flex items-center justify-center w-5 h-5">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>

      {/* Label — hidden on mobile, visible on desktop */}
      <span className="relative z-10 hidden text-xs font-medium sm:block">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default ThemeToggle;
