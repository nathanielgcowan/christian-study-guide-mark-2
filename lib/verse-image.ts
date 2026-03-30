import sharp from "sharp";

export type VerseArtworkTheme =
  | "minimal"
  | "desert"
  | "cross"
  | "shepherd"
  | "dove"
  | "mountain";

const VERSE_ARTWORK_THEMES: VerseArtworkTheme[] = [
  "minimal",
  "desert",
  "cross",
  "shepherd",
  "dove",
  "mountain",
];

export interface VerseImageOptions {
  verse: string;
  reference: string;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  theme?: VerseArtworkTheme;
}

export function normalizeVerseArtworkTheme(
  value: string | null | undefined,
): VerseArtworkTheme {
  if (value && VERSE_ARTWORK_THEMES.includes(value as VerseArtworkTheme)) {
    return value as VerseArtworkTheme;
  }

  return "minimal";
}

const DEFAULT_OPTIONS = {
  backgroundColor: "#1f2937",
  textColor: "#ffffff",
  width: 1200,
  height: 630,
  theme: "minimal" as VerseArtworkTheme,
};

export async function generateVerseImage(
  options: VerseImageOptions,
): Promise<Buffer> {
  const {
    verse,
    reference,
    backgroundColor = DEFAULT_OPTIONS.backgroundColor,
    textColor = DEFAULT_OPTIONS.textColor,
    width = DEFAULT_OPTIONS.width,
    height = DEFAULT_OPTIONS.height,
    theme = DEFAULT_OPTIONS.theme,
  } = options;

  const safeVerse = escapeXml(verse);
  const safeReference = escapeXml(reference);
  const verseLines = wrapText(safeVerse, 34, width / 2);
  const artwork = buildArtwork({
    theme,
    width,
    height,
    backgroundColor,
    textColor,
  });
  const accentColor = getAccentColor(theme, textColor);
  const frameFill = getFrameFill(theme);
  const frameStroke = getFrameStroke(theme);
  const quoteY = theme === "minimal" ? height / 2 - 56 : height / 2 - 34;
  const referenceY = theme === "minimal" ? height / 2 + 138 : height / 2 + 154;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(backgroundColor, -18)};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${adjustColor(textColor, -8)};stop-opacity:0.22" />
          <stop offset="100%" style="stop-color:${adjustColor(textColor, -8)};stop-opacity:0" />
        </linearGradient>
        <linearGradient id="panel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${frameFill};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(backgroundColor, -26)};stop-opacity:0.84" />
        </linearGradient>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      ${artwork}
      <rect width="${width}" height="${height}" fill="url(#light)"/>

      <rect x="72" y="72" width="${width - 144}" height="${height - 144}" rx="36" fill="url(#panel)" stroke="${frameStroke}"/>
      <rect x="92" y="92" width="${width - 184}" height="${height - 184}" rx="28" fill="none" stroke="rgba(255,255,255,0.08)"/>

      <line x1="120" y1="120" x2="${width - 120}" y2="120" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      ${theme !== "minimal" ? `<line x1="120" y1="${height - 120}" x2="${width - 120}" y2="${height - 120}" stroke="${adjustColor(accentColor, -12)}" stroke-width="2" stroke-linecap="round" opacity="0.72"/>` : ""}

      <text
        x="${width / 2}"
        y="${quoteY}"
        font-family="Georgia, serif"
        font-size="46"
        font-weight="normal"
        text-anchor="middle"
        fill="${textColor}"
      >
        <tspan x="${width / 2}" dy="0">"${verseLines}"</tspan>
      </text>

      <text
        x="${width / 2}"
        y="${referenceY}"
        font-family="Georgia, serif"
        font-size="31"
        font-style="italic"
        text-anchor="middle"
        fill="${accentColor}"
        opacity="0.95"
      >
        ${safeReference}
      </text>

      <text
        x="${width / 2}"
        y="${height - 44}"
        font-family="Arial, sans-serif"
        font-size="18"
        text-anchor="middle"
        fill="${adjustColor(textColor, -30)}"
        opacity="0.78"
      >
        Christian Study Guide
      </text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function buildArtwork({
  theme,
  width,
  height,
  backgroundColor,
  textColor,
}: {
  theme: VerseArtworkTheme;
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
}) {
  const mist = adjustColor(textColor, -35);
  const deep = adjustColor(backgroundColor, -28);
  const warm = getAccentColor(theme, textColor);
  const glow = adjustColor(warm, 12);
  const horizon = adjustColor(backgroundColor, 6);

  switch (theme) {
    case "desert":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.2}" rx="92" ry="88" fill="${glow}" opacity="0.18"/>
        <circle cx="${width * 0.78}" cy="${height * 0.2}" r="68" fill="${warm}" opacity="0.28"/>
        <path d="M0 ${height * 0.62} Q ${width * 0.32} ${height * 0.48}, ${width * 0.56} ${height * 0.56} T ${width} ${height * 0.5} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.28"/>
        <path d="M0 ${height * 0.82} Q ${width * 0.22} ${height * 0.66}, ${width * 0.48} ${height * 0.8} T ${width} ${height * 0.72} L ${width} ${height} L 0 ${height} Z" fill="${adjustColor(backgroundColor, 8)}" opacity="0.74"/>
        <path d="M0 ${height * 0.88} Q ${width * 0.16} ${height * 0.78}, ${width * 0.32} ${height * 0.84} T ${width * 0.7} ${height * 0.8} T ${width} ${height * 0.86} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.96"/>
        <path d="M${width * 0.2} ${height * 0.72} q 18 -38 44 -78 q 8 42 34 74" stroke="${mist}" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.22"/>
      `;
    case "cross":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.24}" rx="104" ry="92" fill="${glow}" opacity="0.14"/>
        <circle cx="${width * 0.78}" cy="${height * 0.24}" r="82" fill="${warm}" opacity="0.18"/>
        <path d="M0 ${height * 0.64} Q ${width * 0.22} ${height * 0.54}, ${width * 0.44} ${height * 0.58} T ${width} ${height * 0.48} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.22"/>
        <rect x="${width * 0.79}" y="${height * 0.22}" width="22" height="${height * 0.44}" rx="11" fill="${mist}" opacity="0.54"/>
        <rect x="${width * 0.746}" y="${height * 0.33}" width="108" height="18" rx="9" fill="${mist}" opacity="0.54"/>
        <path d="M0 ${height * 0.88} Q ${width * 0.24} ${height * 0.72}, ${width * 0.52} ${height * 0.84} T ${width} ${height * 0.78} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.94"/>
      `;
    case "shepherd":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.22}" rx="92" ry="82" fill="${glow}" opacity="0.12"/>
        <circle cx="${width * 0.78}" cy="${height * 0.22}" r="70" fill="${warm}" opacity="0.16"/>
        <path d="M0 ${height * 0.76} Q ${width * 0.22} ${height * 0.6}, ${width * 0.44} ${height * 0.7} T ${width} ${height * 0.62} L ${width} ${height} L 0 ${height} Z" fill="${adjustColor(backgroundColor, 10)}" opacity="0.28"/>
        <path d="M0 ${height * 0.9} Q ${width * 0.18} ${height * 0.78}, ${width * 0.36} ${height * 0.88} T ${width} ${height * 0.8} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.96"/>
        <circle cx="${width * 0.74}" cy="${height * 0.72}" r="15" fill="${mist}" opacity="0.72"/>
        <rect x="${width * 0.733}" y="${height * 0.74}" width="18" height="64" rx="9" fill="${mist}" opacity="0.72"/>
        <path d="M${width * 0.8} ${height * 0.58} q 22 -42 0 -84" stroke="${mist}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.72"/>
        <circle cx="${width * 0.62}" cy="${height * 0.8}" r="12" fill="${mist}" opacity="0.52"/>
        <circle cx="${width * 0.66}" cy="${height * 0.79}" r="14" fill="${mist}" opacity="0.58"/>
      `;
    case "dove":
      return `
        <ellipse cx="${width * 0.76}" cy="${height * 0.24}" rx="112" ry="94" fill="${glow}" opacity="0.12"/>
        <circle cx="${width * 0.76}" cy="${height * 0.24}" r="82" fill="${warm}" opacity="0.14"/>
        <path d="M${width * 0.62} ${height * 0.34} q 48 -54 112 -30 q -20 18 -18 44 q 36 10 58 42 q -48 -6 -78 16 q -20 14 -32 42 q -12 -30 -38 -50 q -24 -18 -54 -18 q 26 -20 50 -46 z" fill="${mist}" opacity="0.62"/>
        <path d="M${width * 0.2} ${height * 0.24} q 40 -18 82 0" stroke="${mist}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.18"/>
        <path d="M${width * 0.16} ${height * 0.3} q 34 -14 70 0" stroke="${mist}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.14"/>
      `;
    case "mountain":
      return `
        <ellipse cx="${width * 0.8}" cy="${height * 0.2}" rx="88" ry="78" fill="${glow}" opacity="0.11"/>
        <circle cx="${width * 0.8}" cy="${height * 0.2}" r="64" fill="${warm}" opacity="0.16"/>
        <path d="M0 ${height * 0.58} Q ${width * 0.26} ${height * 0.46}, ${width * 0.54} ${height * 0.52} T ${width} ${height * 0.46} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.18"/>
        <path d="M0 ${height * 0.88} L ${width * 0.24} ${height * 0.44} L ${width * 0.46} ${height * 0.88} Z" fill="${adjustColor(backgroundColor, -10)}" opacity="0.86"/>
        <path d="M${width * 0.2} ${height * 0.88} L ${width * 0.52} ${height * 0.32} L ${width * 0.84} ${height * 0.88} Z" fill="${deep}" opacity="0.96"/>
        <path d="M${width * 0.47} ${height * 0.47} L ${width * 0.52} ${height * 0.32} L ${width * 0.6} ${height * 0.5} Z" fill="${mist}" opacity="0.56"/>
      `;
    case "minimal":
    default:
      return `
        <circle cx="${width * 0.8}" cy="${height * 0.22}" r="78" fill="${warm}" opacity="0.08"/>
        <rect x="${width * 0.66}" y="${height * 0.18}" width="${width * 0.18}" height="${height * 0.46}" rx="30" fill="${mist}" opacity="0.08"/>
        <circle cx="${width * 0.24}" cy="${height * 0.76}" r="120" fill="${mist}" opacity="0.04"/>
      `;
  }
}

function wrapText(text: string, maxChars: number, x: number): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxChars) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }

  if (currentLine) lines.push(currentLine.trim());
  return lines.join(`</tspan><tspan x="${x}" dy="60">`);
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return (
    "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).substring(1)
  );
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getAccentColor(theme: VerseArtworkTheme, textColor: string) {
  switch (theme) {
    case "desert":
      return "#f5c46b";
    case "cross":
      return "#d8c7a3";
    case "shepherd":
      return "#c7d9b7";
    case "dove":
      return "#d9e6f7";
    case "mountain":
      return "#bdd3e7";
    case "minimal":
    default:
      return adjustColor(textColor, -18);
  }
}

function getFrameFill(theme: VerseArtworkTheme) {
  switch (theme) {
    case "desert":
      return "rgba(38,24,10,0.42)";
    case "cross":
      return "rgba(26,18,12,0.44)";
    case "shepherd":
      return "rgba(14,24,18,0.44)";
    case "dove":
      return "rgba(16,22,32,0.4)";
    case "mountain":
      return "rgba(14,18,24,0.44)";
    case "minimal":
    default:
      return "rgba(12,12,12,0.14)";
  }
}

function getFrameStroke(theme: VerseArtworkTheme) {
  switch (theme) {
    case "desert":
      return "rgba(245,196,107,0.24)";
    case "cross":
      return "rgba(216,199,163,0.24)";
    case "shepherd":
      return "rgba(199,217,183,0.22)";
    case "dove":
      return "rgba(217,230,247,0.22)";
    case "mountain":
      return "rgba(189,211,231,0.2)";
    case "minimal":
    default:
      return "rgba(255,255,255,0.12)";
  }
}
