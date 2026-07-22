import { useMemo, useState, useCallback, useRef } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { MEMOJI_ITEMS, type MemojiItem } from "~/lib/memoji-data";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, webPageSchema, softwareAppSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Memoji Downloader — Toolhub";
  const description =
    "Browse and download 800+ custom memojis with 14 unique characters, 29 emotions, and 2 skin tones. All designs are original and created in Figma.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/design/memoji"),
  ];
}

/* ---------- Constants ---------- */

/** Dimensions of the preview sprite (WebP, same resolution as original). */
const SPRITE_W = 9145;
const SPRITE_H = 7952;
const EMOJI_SIZE = 256;

/**
 * Returns background-size that scales the sprite so each 256×256 emoji
 * fills the container exactly.
 */
function spriteBgSize(): string {
  return `calc(100% * ${SPRITE_W} / ${EMOJI_SIZE}) calc(100% * ${SPRITE_H} / ${EMOJI_SIZE})`;
}

/**
 * Returns background-position that aligns the emoji at (spriteX, spriteY)
 * within the container, so the full 256×256 emoji is visible and centered.
 */
function spriteBgPos(spriteX: number, spriteY: number): string {
  const pctX = (spriteX / (SPRITE_W - EMOJI_SIZE)) * 100;
  const pctY = (spriteY / (SPRITE_H - EMOJI_SIZE)) * 100;
  return `${pctX}% ${pctY}%`;
}

/* ---------- Helpers ---------- */

function unique<T>(items: MemojiItem[], key: keyof MemojiItem): T[] {
  return [...new Set(items.map((i) => i[key] as T))].sort();
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function formatEmotion(emotion: string): string {
  return emotion
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- SVG Icons ---------- */

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ---------- Sub-components ---------- */

/**
 * PersonAvatar — shows a tiny clipped face from the sprite for the person selector.
 */
function PersonAvatar({ person }: { person: string }) {
  const first = MEMOJI_ITEMS.find((i) => i.person === person);
  if (!first) return <div className="w-10 h-10 rounded-full bg-surface-container-highest shrink-0" />;

  return (
    <div
      className="w-10 h-10 rounded-full overflow-clip shrink-0 ring-1 ring-inset ring-white/10"
      style={{
        backgroundImage: "url(/memojis/sprite-preview.webp)",
        backgroundSize: spriteBgSize(),
        backgroundPosition: spriteBgPos(first.spriteX, first.spriteY),
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

/**
 * MemojiCard — a single memoji card with sprite-based preview and download overlay.
 */
function MemojiCard({
  item,
  onDownload,
}: {
  item: MemojiItem;
  onDownload: (item: MemojiItem, format: "png" | "jpeg" | "svg") => void;
}) {
  return (
    <div className="group relative flex flex-col gap-1.5 p-2.5 rounded-card tonal-container-highest transition-all duration-200 hover:glass">
      {/* Sprite preview — 256×256 emoji clipped from the WebP sprite */}
      <div
        className="w-full aspect-square rounded-xl overflow-clip"
        style={{
          backgroundImage: "url(/memojis/sprite-preview.webp)",
          backgroundSize: spriteBgSize(),
          backgroundPosition: spriteBgPos(item.spriteX, item.spriteY),
          backgroundRepeat: "no-repeat",
        }}
      />

      <span className="text-[10px] sm:text-xs font-medium text-on-surface truncate mt-0.5">
        {item.person} — {formatEmotion(item.emotion)}
      </span>

      <span className="text-[9px] uppercase tracking-wider font-medium text-on-surface-variant/60">
        {item.skinTone}
      </span>

      {/* Download overlay */}
      <div className="absolute inset-0 rounded-card bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 pointer-events-none group-hover:pointer-events-auto">
        <span className="text-white text-[10px] font-semibold tracking-wide uppercase mb-0.5">
          Download as
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDownload(item, "png"); }}
            className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-medium hover:bg-white/30 transition-colors cursor-pointer"
          >
            PNG
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDownload(item, "jpeg"); }}
            className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-medium hover:bg-white/30 transition-colors cursor-pointer"
          >
            JPG
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDownload(item, "svg"); }}
            className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[10px] font-medium hover:bg-white/30 transition-colors cursor-pointer"
          >
            SVG
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function MemojiDownloader() {
  const navigate = useNavigate();
  const dlSpriteRef = useRef<HTMLImageElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<string>("all");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("all");
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const persons = useMemo(() => unique<string>(MEMOJI_ITEMS, "person"), []);
  const emotions = useMemo(() => unique<string>(MEMOJI_ITEMS, "emotion"), []);
  const skinTones = useMemo(() => unique<string>(MEMOJI_ITEMS, "skinTone"), []);

  const filtered = useMemo(() => {
    return MEMOJI_ITEMS.filter((item) => {
      if (selectedPerson !== "all" && item.person !== selectedPerson) return false;
      if (selectedEmotion !== "all" && item.emotion !== selectedEmotion) return false;
      if (selectedSkinTone !== "all" && item.skinTone !== selectedSkinTone) return false;
      if (searchQuery) {
        const q = normalize(searchQuery);
        if (
          !normalize(item.person).includes(q) &&
          !normalize(item.emotion).includes(q) &&
          !normalize(item.skinTone).includes(q)
        )
          return false;
      }
      return true;
    });
  }, [selectedPerson, selectedEmotion, selectedSkinTone, searchQuery]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  const handleDownload = useCallback(
    async (item: MemojiItem, format: "png" | "jpeg" | "svg") => {
      try {
        // Load the full-res PNG sprite on first download
        if (!dlSpriteRef.current) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => { dlSpriteRef.current = img; resolve(); };
            img.onerror = reject;
            img.src = "/memojis/sprite.png";
          });
        }

        // Extract the emoji region from the full sprite via canvas
        const cvs = document.createElement("canvas");
        cvs.width = item.spriteW;
        cvs.height = item.spriteH;
        const ctx = cvs.getContext("2d")!;
        ctx.drawImage(
          dlSpriteRef.current,
          item.spriteX, item.spriteY, item.spriteW, item.spriteH,
          0, 0, item.spriteW, item.spriteH,
        );

        let blob: Blob;
        if (format === "svg") {
          const pngDataUrl = cvs.toDataURL("image/png");
          blob = new Blob([
            `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="256" height="256" viewBox="0 0 256 256">
  <image width="256" height="256" xlink:href="${pngDataUrl}"/>
</svg>`,
          ], { type: "image/svg+xml" });
        } else if (format === "jpeg") {
          blob = await new Promise((resolve, reject) => {
            cvs.toBlob((b) => {
              if (b) resolve(b);
              else reject(new Error("JPEG conversion failed"));
            }, "image/jpeg", 0.92);
          });
        } else {
          blob = await new Promise((resolve, reject) => {
            cvs.toBlob((b) => {
              if (b) resolve(b);
              else reject(new Error("PNG extraction failed"));
            }, "image/png");
          });
        }

        downloadBlob(blob, `memoji-${item.person}-${item.emotion}-${item.skinTone}.${format}`);
        showToast(`${format.toUpperCase()} downloaded: ${item.person} — ${item.emotion}`);
      } catch (err) {
        showToast("Download failed — try again");
        console.error("Download error:", err);
      }
    },
    [showToast],
  );

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto animate-fade-in pt-4 pb-12">
      {/* JSON-LD structured data */}
      <JsonLd data={webPageSchema("Memoji Downloader — Toolhub", "Browse and download 800+ custom memojis with 14 characters, 29 emotions, and 2 skin tones.", "/design/memoji")} />
      <JsonLd data={softwareAppSchema("Memoji Downloader", "Browse and download 800+ custom memojis with 14 unique characters, 29 emotions, and 2 skin tones. All designs are original and created in Figma.", "/design/memoji")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Design Assets", url: "/design" },
        { name: "Memoji Downloader", url: "/design/memoji" },
      ])} />

      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-full glass text-sm font-medium text-on-surface animate-fade-in shadow-lg">
          {toastMsg}
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/design")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Design Assets
      </button>

      <section className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          Memoji Downloader
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed max-w-3xl">
          Browse, preview, and download <strong className="text-on-surface">812 memojis</strong> across{" "}
          <strong className="text-on-surface">{persons.length} unique characters</strong>,{" "}
          <strong className="text-on-surface">{emotions.length} emotions</strong>, and{" "}
          <strong className="text-on-surface">{skinTones.length} skin tones</strong>.
        </p>
      </section>

      <div className="flex flex-col gap-3">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{
            backgroundColor: "var(--tk-surface-container-high)",
            color: "var(--tk-on-surface-variant)",
          }}
        >
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by person, emotion, or skin tone..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-on-surface-variant/50"
            style={{ color: "var(--tk-on-surface)" }}
            aria-label="Search memojis"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="cursor-pointer hover:text-on-surface transition-colors"
              aria-label="Clear search"
            >
              <CloseIcon />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-full text-on-surface-variant/50">
            <span className="text-xs mr-0.5">&#8984;</span>K
          </kbd>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedPerson("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedPerson === "all"
                  ? "neon-gradient text-[#66002c]"
                  : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Persons <span className="opacity-60">({persons.length})</span>
            </button>
            {persons.map((person) => (
              <button
                key={person}
                type="button"
                onClick={() => setSelectedPerson(person)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedPerson === person
                    ? "neon-gradient text-[#66002c]"
                    : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <PersonAvatar person={person} />
                {person}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedEmotion("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedEmotion === "all"
                  ? "neon-gradient text-[#66002c]"
                  : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Emotions
            </button>
            {emotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => setSelectedEmotion(emotion)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedEmotion === emotion
                    ? "neon-gradient text-[#66002c]"
                    : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {formatEmotion(emotion)}
              </button>
            ))}
          </div>

          <span className="text-on-surface-variant/30 text-xs">|</span>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedSkinTone("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedSkinTone === "all"
                  ? "neon-gradient text-[#66002c]"
                  : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Tones
            </button>
            {skinTones.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => setSelectedSkinTone(tone)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedSkinTone === tone
                    ? "neon-gradient text-[#66002c]"
                    : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          Showing <strong className="text-on-surface">{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "memoji" : "memojis"}
          {selectedPerson !== "all" && (
            <> for <strong className="text-on-surface">{selectedPerson}</strong></>
          )}
          {selectedEmotion !== "all" && (
            <> — <strong className="text-on-surface">{formatEmotion(selectedEmotion)}</strong></>
          )}
          {selectedSkinTone !== "all" && (
            <> (<strong className="text-on-surface">{selectedSkinTone}</strong>)</>
          )}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <MemojiCard
              key={item.id}
              item={item}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-16 h-16 rounded-full tonal-container flex items-center justify-center">
            <SearchIcon />
          </div>
          <p className="text-on-surface-variant text-sm">No memojis match your filters</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedPerson("all");
              setSelectedEmotion("all");
              setSelectedSkinTone("all");
            }}
            className="px-4 py-2 rounded-full neon-gradient text-[#66002c] text-xs font-medium cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About This Memoji Pack</p>
        <p className="mb-2">
          All memojis are custom-designed in Figma as part of the{" "}
          <strong>1500+ Memoji Pack</strong>. Hover any memoji to download as
          PNG (256×256), JPG, or SVG. The full-resolution sprite loads
          on-demand only when you initiate a download.
        </p>
      </div>
    </div>
  );
}
