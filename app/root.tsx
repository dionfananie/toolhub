import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { ThemeProvider, ThemeScript } from "~/lib/theme-context";
import { Header } from "~/components/header";
import { GlassNav } from "~/components/glass-nav";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Inline script to set theme class before paint (prevents FOUC) */}
        <script dangerouslySetInnerHTML={{ __html: ThemeScript() }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1 px-4 sm:px-6 pt-16 pb-24">
          <Outlet />
        </main>
        <GlassNav />
      </div>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 gap-4">
      <h1 className="text-2xl font-bold font-display text-on-surface">
        {message}
      </h1>
      <p className="text-on-surface-variant">{details}</p>
      {stack && (
        <pre className="w-full max-w-lg p-4 overflow-x-auto rounded-card tonal-container text-xs">
          <code>{stack}</code>
        </pre>
      )}
      <a
        href="/"
        className="px-6 py-2 rounded-full neon-gradient text-on-primary text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Go Home
      </a>
    </div>
  );
}
