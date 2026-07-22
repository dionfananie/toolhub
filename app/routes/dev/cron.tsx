import { useState, useMemo } from "react";
import type { Route } from "./+types/cron";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cron Expression Parser — Toolhub" },
    {
      name: "description",
      content:
        "Parse cron expressions and get human-readable descriptions. Preview upcoming execution times for 5-field and 6-field cron schedules.",
    },
  ];
}

/* ---------- Cron Parser ---------- */

interface ParsedCron {
  description: string;
  nextDates: Date[];
  error?: string;
}

/** Days of week */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Parse a cron expression into a human-readable description.
 * Supports standard 5-field (minute hour day month weekday) and
 * 6-field (second minute hour day month weekday) expressions.
 */
function parseCron(expression: string): ParsedCron {
  const fields = expression.trim().split(/\s+/);

  if (fields.length !== 5 && fields.length !== 6) {
    return {
      description: "",
      nextDates: [],
      error: "Cron expression must have 5 or 6 fields",
    };
  }

  const hasSeconds = fields.length === 6;
  const minuteField = hasSeconds ? fields[1] : fields[0];
  const hourField = hasSeconds ? fields[2] : fields[1];
  const dayField = hasSeconds ? fields[3] : fields[2];
  const monthField = hasSeconds ? fields[4] : fields[3];
  const weekdayField = hasSeconds ? fields[5] : fields[4];

  type FieldInfo = { raw: string; desc: string };

  const describeField = (raw: string, type: "minute" | "hour" | "day" | "month" | "weekday"): string => {
    if (raw === "*") {
      switch (type) {
        case "minute": return "every minute";
        case "hour": return "every hour";
        case "day": return "every day";
        case "month": return "every month";
        case "weekday": return "every day of the week";
      }
    }

    const isStep = raw.includes("/");
    const isRange = raw.includes("-");
    const isList = raw.includes(",");

    if (isStep) {
      const parts = raw.split("/");
      if (parts[0] === "*") {
        return `every ${parts[1]} ${type}s`;
      }
      return `every ${parts[1]} ${type}s starting at ${parts[0]}`;
    }

    if (type === "month") {
      const num = parseInt(raw);
      if (!isNaN(num) && num >= 1 && num <= 12) {
        return MONTHS[num - 1];
      }
    }

    if (type === "weekday") {
      const num = parseInt(raw);
      if (!isNaN(num) && num >= 0 && num <= 6) {
        return DAYS[num];
      }
    }

    return `${type === "minute" ? "minute" : type === "hour" ? "hour" : type} ${raw}`;
  };

  const parts: string[] = [];

  const minuteDesc = describeField(minuteField, "minute");
  const hourDesc = describeField(hourField, "hour");
  const dayDesc = describeField(dayField, "day");
  const monthDesc = describeField(monthField, "month");
  const weekdayDesc = describeField(weekdayField, "weekday");

  // Build a natural-sounding description
  if (minuteField === "*" && hourField === "*") {
    parts.push("Every minute");
  } else if (minuteField !== "*" && hourField !== "*") {
    parts.push(`At ${minuteDesc} past ${hourDesc}`);
  } else if (minuteField !== "*") {
    parts.push(`At ${minuteDesc} past every hour`);
  } else {
    parts.push(`Every minute of ${hourDesc}`);
  }

  if (dayField !== "*") parts.push(`on day ${dayDesc}`);
  if (monthField !== "*") parts.push(`in ${monthDesc}`);
  if (weekdayField !== "*") parts.push(`on ${weekdayDesc}`);

  return {
    description: parts.join(", ") || "At every point in time",
    nextDates: [], // We'll compute these
    error: undefined,
  };
}

/**
 * Compute the next N execution times from a cron expression.
 * This is a simplified calculation — not perfectly precise for all edge cases.
 */
function computeNextDates(expression: string, count: number = 5): Date[] {
  const fields = expression.trim().split(/\s+/);
  if (fields.length !== 5 && fields.length !== 6) return [];

  const dates: Date[] = [];
  const now = new Date();
  let current = new Date(now);

  // For simplicity, we increment by 1 minute and test each time
  // This works for most common cron patterns
  const maxIterations = 525600; // max 1 year of checking
  let iterations = 0;

  const hasSeconds = fields.length === 6;
  const minuteField = hasSeconds ? fields[1] : fields[0];
  const hourField = hasSeconds ? fields[2] : fields[1];
  const dayField = hasSeconds ? fields[3] : fields[2];
  const monthField = hasSeconds ? fields[4] : fields[3];
  const weekdayField = hasSeconds ? fields[5] : fields[4];

  const matches = (value: number, field: string): boolean => {
    if (field === "*") return true;

    // Handle step: */N
    if (field.includes("/")) {
      const [range, step] = field.split("/");
      const start = range === "*" ? 0 : parseInt(range.split("-")[0]);
      if ((value - start) % parseInt(step) !== 0) return false;
      return true;
    }

    // Handle range: 1-5
    if (field.includes("-")) {
      const [lo, hi] = field.split("-").map(Number);
      return value >= lo && value <= hi;
    }

    // Handle list: 1,3,5
    if (field.includes(",")) {
      return field.split(",").map(Number).includes(value);
    }

    return value === parseInt(field);
  };

  while (dates.length < count && iterations < maxIterations) {
    const minute = current.getMinutes();
    const hour = current.getHours();
    const day = current.getDate();
    const month = current.getMonth() + 1;
    const weekday = current.getDay();

    if (
      matches(minute, minuteField) &&
      matches(hour, hourField) &&
      matches(day, dayField) &&
      matches(month, monthField) &&
      matches(weekday, weekdayField)
    ) {
      dates.push(new Date(current));
    }

    current = new Date(current.getTime() + 60000); // +1 minute
    iterations++;
  }

  return dates;
}

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Weekdays 9 AM", value: "0 9 * * 1-5" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
  { label: "Every 15 min", value: "*/15 * * * *" },
];

/* ---------- Main Component ---------- */

export default function CronParser() {
  const navigate = useNavigate();
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [presetLabel, setPresetLabel] = useState("Weekdays 9 AM");

  const parsed = useMemo(() => {
    const desc = parseCron(expression);

    let nextDates: Date[] = [];
    if (!desc.error) {
      try {
        nextDates = computeNextDates(expression, 10);
      } catch {
        // Fail silently
      }
    }

    return { ...desc, nextDates };
  }, [expression]);

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setExpression(preset.value);
    setPresetLabel(preset.label);
  };

  const formatDate = (d: Date) => {
    return d.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in pt-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/dev")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Developer Tools
      </button>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          Cron Expression Parser
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Parse cron expressions and preview upcoming execution times.
        </p>
      </section>

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePreset(preset)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                presetLabel === preset.label
                  ? "neon-gradient text-[#66002c]"
                  : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expression input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="cron-expr">
          Cron Expression
        </label>
        <div
          className="flex items-center rounded-full overflow-hidden"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: `1px solid color-mix(in srgb, ${parsed.error ? "#ef4444" : "var(--tk-outline-variant)"} 20%, transparent)`,
          }}
        >
          <input
            id="cron-expr"
            type="text"
            value={expression}
            onChange={(e) => { setExpression(e.target.value); setPresetLabel(""); }}
            placeholder="* * * * *"
            className="flex-1 px-6 py-4 bg-transparent text-lg font-mono outline-none"
            style={{ color: "var(--tk-on-surface)" }}
            aria-label="Cron expression"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {parsed.error && (
        <div className="p-3 rounded-card"
          style={{
            backgroundColor: "color-mix(in srgb, #ef4444 10%, transparent)",
            border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)",
          }}
        >
          <p className="text-xs font-mono" style={{ color: "#ef4444" }}>
            {parsed.error}
          </p>
        </div>
      )}

      {/* Description */}
      {!parsed.error && expression && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Description
          </label>
          <div
            className="relative p-5 rounded-xl overflow-hidden"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
            }}
          >
            <span
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--tk-primary) 5%, transparent) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <p className="text-lg font-display font-bold text-primary tracking-tight">
                {parsed.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next executions */}
      {!parsed.error && parsed.nextDates.length > 0 && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Next {parsed.nextDates.length} Execution Times
          </label>
          <div className="flex flex-col gap-1.5">
            {parsed.nextDates.map((date, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2.5 rounded-card tonal-container"
              >
                <span className="w-6 text-xs font-semibold text-on-surface-variant">
                  #{idx + 1}
                </span>
                <span className="text-sm font-mono text-on-surface">
                  {formatDate(date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Field reference */}
      <div className="p-4 rounded-card tonal-container text-sm">
        <p className="font-semibold text-on-surface mb-3">Field Reference</p>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {[
            { field: "min", pos: "1st", range: "0-59" },
            { field: "hour", pos: "2nd", range: "0-23" },
            { field: "day", pos: "3rd", range: "1-31" },
            { field: "month", pos: "4th", range: "1-12" },
            { field: "weekday", pos: "5th", range: "0-7 (Sun-Sat)" },
          ].map((f) => (
            <div key={f.field} className="flex flex-col gap-0.5 text-on-surface-variant">
              <span className="font-bold text-on-surface uppercase tracking-wider">{f.field}</span>
              <span>{f.pos}</span>
              <span>{f.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
