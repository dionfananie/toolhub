import { useLocation, useNavigate } from "react-router";
import { useMemo } from "react";

/**
 * Navigation item definition.
 */
interface NavItem {
  /** Route path */
  path: string;
  /** Display label */
  label: string;
  /** SVG path data for the icon (stroke-based, 24x24 viewBox) */
  icon: string;
}

/**
 * Nav items for the glassmorphic bottom navigation.
 */
const NAV_ITEMS: NavItem[] = [
  {
    path: "/",
    label: "Home",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    path: "/financial",
    label: "Financial",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  },
  {
    path: "/dev",
    label: "Developer",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    path: "/text",
    label: "Text",
    icon: "M4 6h16M4 12h16M4 18h7",
  },
  {
    path: "/convert",
    label: "Converters",
    icon: "M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4",
  },
];

/**
 * Checks if a nav item's path matches the current location.
 * Uses prefix matching for category routes (e.g., /financial/currency matches /financial).
 */
function isActive(path: string, location: string): boolean {
  if (path === "/") return location === "/";
  return location.startsWith(path);
}

/**
 * GlassNav — Fixed bottom navigation bar with glassmorphic styling.
 *
 * - Pill-shaped floating bar with backdrop blur
 * - Active items have a neon pink glow instead of a solid background
 * - Each item shows an SVG icon and a label
 * - Labels are hidden on mobile (compact) and visible on desktop
 * - Clicking navigates to the route via React Router
 *
 * @example
 * <GlassNav />
 */
export function GlassNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeIndices = useMemo(
    () => NAV_ITEMS.map((item) => isActive(item.path, location.pathname)),
    [location.pathname],
  );

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-full glass-strong"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map((item, index) => {
          const active = activeIndices[index];

          return (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={`
                  relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full
                  transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? "text-primary neon-glow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }
                `}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.5 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d={item.icon} />
                </svg>

                {/* Label — hidden on mobile, visible on sm+ */}
                <span className="hidden sm:block text-xs font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default GlassNav;
