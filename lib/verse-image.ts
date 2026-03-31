import sharp from "sharp";

export type VerseArtworkTheme =
  | "minimal"
  | "desert"
  | "cross"
  | "shepherd"
  | "dove"
  | "mountain"
  | "garden"
  | "sea";

export type VerseImageLayout = "classic" | "poster" | "immersive";
export type VerseSceneMood = "daybreak" | "golden" | "midnight";

const VERSE_ARTWORK_THEMES: VerseArtworkTheme[] = [
  "minimal",
  "desert",
  "cross",
  "shepherd",
  "dove",
  "mountain",
  "garden",
  "sea",
];

const VERSE_IMAGE_LAYOUTS: VerseImageLayout[] = [
  "classic",
  "poster",
  "immersive",
];

const VERSE_SCENE_MOODS: VerseSceneMood[] = [
  "daybreak",
  "golden",
  "midnight",
];

export interface VerseImageOptions {
  verse: string;
  reference: string;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
  theme?: VerseArtworkTheme;
  layout?: VerseImageLayout;
  mood?: VerseSceneMood;
}

export function normalizeVerseArtworkTheme(
  value: string | null | undefined,
): VerseArtworkTheme {
  if (value && VERSE_ARTWORK_THEMES.includes(value as VerseArtworkTheme)) {
    return value as VerseArtworkTheme;
  }

  return "minimal";
}

export function normalizeVerseImageLayout(
  value: string | null | undefined,
): VerseImageLayout {
  if (value && VERSE_IMAGE_LAYOUTS.includes(value as VerseImageLayout)) {
    return value as VerseImageLayout;
  }

  return "classic";
}

export function normalizeVerseSceneMood(
  value: string | null | undefined,
): VerseSceneMood {
  if (value && VERSE_SCENE_MOODS.includes(value as VerseSceneMood)) {
    return value as VerseSceneMood;
  }

  return "daybreak";
}

const DEFAULT_OPTIONS = {
  backgroundColor: "#1f2937",
  textColor: "#ffffff",
  width: 1200,
  height: 630,
  theme: "minimal" as VerseArtworkTheme,
  layout: "classic" as VerseImageLayout,
  mood: "daybreak" as VerseSceneMood,
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
    layout = DEFAULT_OPTIONS.layout,
    mood = DEFAULT_OPTIONS.mood,
  } = options;

  const safeVerse = escapeXml(verse);
  const safeReference = escapeXml(reference);
  const layoutConfig = getLayoutConfig(layout, width, height, theme);
  const verseLines = wrapText(
    safeVerse,
    layoutConfig.maxChars,
    layoutConfig.textX,
    layoutConfig.lineHeight,
  );
  const artwork = buildArtwork({
    theme,
    layout,
    mood,
    width,
    height,
    backgroundColor,
    textColor,
  });
  const atmosphere = buildAtmosphere({
    mood,
    width,
    height,
    textColor,
  });
  const accentColor = getAccentColor(theme, textColor);
  const frameFill = getFrameFill(theme, mood);
  const frameStroke = getFrameStroke(theme, mood);
  const gradientEnd = getMoodGradientEnd(backgroundColor, mood);

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
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
      ${atmosphere}
      <rect width="${width}" height="${height}" fill="url(#light)"/>

      <rect x="${layoutConfig.panelX}" y="${layoutConfig.panelY}" width="${layoutConfig.panelWidth}" height="${layoutConfig.panelHeight}" rx="${layoutConfig.panelRadius}" fill="url(#panel)" stroke="${frameStroke}"/>
      <rect x="${layoutConfig.innerX}" y="${layoutConfig.innerY}" width="${layoutConfig.innerWidth}" height="${layoutConfig.innerHeight}" rx="${layoutConfig.innerRadius}" fill="none" stroke="rgba(255,255,255,0.08)"/>

      <line x1="${layoutConfig.lineLeft}" y1="${layoutConfig.lineTop}" x2="${layoutConfig.lineRight}" y2="${layoutConfig.lineTop}" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      ${layout !== "classic" || theme !== "minimal" ? `<line x1="${layoutConfig.lineLeft}" y1="${layoutConfig.lineBottom}" x2="${layoutConfig.lineRight}" y2="${layoutConfig.lineBottom}" stroke="${adjustColor(accentColor, -12)}" stroke-width="2" stroke-linecap="round" opacity="0.72"/>` : ""}

      <text
        x="${layoutConfig.textX}"
        y="${layoutConfig.quoteY}"
        font-family="Georgia, serif"
        font-size="${layoutConfig.quoteFontSize}"
        font-weight="normal"
        text-anchor="${layoutConfig.textAnchor}"
        fill="${textColor}"
      >
        <tspan x="${layoutConfig.textX}" dy="0">"${verseLines}"</tspan>
      </text>

      <text
        x="${layoutConfig.referenceX}"
        y="${layoutConfig.referenceY}"
        font-family="Georgia, serif"
        font-size="${layoutConfig.referenceFontSize}"
        font-style="italic"
        text-anchor="${layoutConfig.textAnchor}"
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
  layout,
  mood,
  width,
  height,
  backgroundColor,
  textColor,
}: {
  theme: VerseArtworkTheme;
  layout: VerseImageLayout;
  mood: VerseSceneMood;
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
  const scenicLift = layout === "immersive" ? 1.1 : layout === "poster" ? 1.05 : 1;
  const mistOpacity =
    mood === "daybreak"
      ? layout === "immersive"
        ? 0.34
        : 0.24
      : mood === "midnight"
        ? 0.16
        : layout === "immersive"
          ? 0.28
          : 0.18;

  switch (theme) {
    case "desert":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.2}" rx="${92 * scenicLift}" ry="${88 * scenicLift}" fill="${glow}" opacity="0.2"/>
        <circle cx="${width * 0.78}" cy="${height * 0.2}" r="${68 * scenicLift}" fill="${warm}" opacity="0.3"/>
        <path d="M0 ${height * 0.58} Q ${width * 0.28} ${height * 0.44}, ${width * 0.52} ${height * 0.54} T ${width} ${height * 0.48} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.34"/>
        <path d="M0 ${height * 0.78} Q ${width * 0.18} ${height * 0.6}, ${width * 0.44} ${height * 0.76} T ${width} ${height * 0.66} L ${width} ${height} L 0 ${height} Z" fill="${adjustColor(backgroundColor, 8)}" opacity="0.78"/>
        <path d="M0 ${height * 0.88} Q ${width * 0.16} ${height * 0.76}, ${width * 0.36} ${height * 0.84} T ${width * 0.72} ${height * 0.76} T ${width} ${height * 0.84} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.96"/>
        <path d="M${width * 0.16} ${height * 0.68} q 22 -44 54 -86 q 10 44 42 82" stroke="${mist}" stroke-width="5" fill="none" stroke-linecap="round" opacity="${mistOpacity}"/>
        <path d="M${width * 0.84} ${height * 0.7} q -20 -34 -52 -58" stroke="${adjustColor(mist, 8)}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.18"/>
      `;
    case "cross":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.24}" rx="${104 * scenicLift}" ry="${92 * scenicLift}" fill="${glow}" opacity="0.16"/>
        <circle cx="${width * 0.78}" cy="${height * 0.24}" r="${82 * scenicLift}" fill="${warm}" opacity="0.2"/>
        <path d="M0 ${height * 0.6} Q ${width * 0.22} ${height * 0.5}, ${width * 0.44} ${height * 0.56} T ${width} ${height * 0.46} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.25"/>
        <rect x="${width * 0.79}" y="${height * 0.18}" width="26" height="${height * 0.5}" rx="13" fill="${mist}" opacity="0.58"/>
        <rect x="${width * 0.738}" y="${height * 0.3}" width="124" height="20" rx="10" fill="${mist}" opacity="0.58"/>
        <path d="M0 ${height * 0.88} Q ${width * 0.24} ${height * 0.7}, ${width * 0.52} ${height * 0.84} T ${width} ${height * 0.76} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.95"/>
        <path d="M${width * 0.62} ${height * 0.18} q 68 12 132 -18" stroke="${adjustColor(glow, 16)}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.08"/>
      `;
    case "shepherd":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.22}" rx="${92 * scenicLift}" ry="${82 * scenicLift}" fill="${glow}" opacity="0.14"/>
        <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${70 * scenicLift}" fill="${warm}" opacity="0.18"/>
        <path d="M0 ${height * 0.7} Q ${width * 0.22} ${height * 0.56}, ${width * 0.44} ${height * 0.66} T ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${adjustColor(backgroundColor, 10)}" opacity="0.32"/>
        <path d="M0 ${height * 0.9} Q ${width * 0.18} ${height * 0.76}, ${width * 0.36} ${height * 0.88} T ${width} ${height * 0.78} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.96"/>
        <circle cx="${width * 0.74}" cy="${height * 0.72}" r="15" fill="${mist}" opacity="0.72"/>
        <rect x="${width * 0.733}" y="${height * 0.74}" width="18" height="64" rx="9" fill="${mist}" opacity="0.72"/>
        <path d="M${width * 0.8} ${height * 0.58} q 22 -42 0 -84" stroke="${mist}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.72"/>
        <circle cx="${width * 0.62}" cy="${height * 0.8}" r="12" fill="${mist}" opacity="0.52"/>
        <circle cx="${width * 0.66}" cy="${height * 0.79}" r="14" fill="${mist}" opacity="0.58"/>
        <circle cx="${width * 0.58}" cy="${height * 0.82}" r="10" fill="${mist}" opacity="0.45"/>
      `;
    case "dove":
      return `
        <ellipse cx="${width * 0.76}" cy="${height * 0.24}" rx="${112 * scenicLift}" ry="${94 * scenicLift}" fill="${glow}" opacity="0.14"/>
        <circle cx="${width * 0.76}" cy="${height * 0.24}" r="${82 * scenicLift}" fill="${warm}" opacity="0.16"/>
        <path d="M${width * 0.62} ${height * 0.34} q 48 -54 112 -30 q -20 18 -18 44 q 36 10 58 42 q -48 -6 -78 16 q -20 14 -32 42 q -12 -30 -38 -50 q -24 -18 -54 -18 q 26 -20 50 -46 z" fill="${mist}" opacity="0.66"/>
        <path d="M${width * 0.2} ${height * 0.24} q 40 -18 82 0" stroke="${mist}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.22"/>
        <path d="M${width * 0.16} ${height * 0.3} q 34 -14 70 0" stroke="${mist}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.18"/>
        <path d="M${width * 0.12} ${height * 0.18} q 80 -36 160 0" stroke="${adjustColor(mist, 12)}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.08"/>
      `;
    case "mountain":
      return `
        <ellipse cx="${width * 0.8}" cy="${height * 0.2}" rx="${88 * scenicLift}" ry="${78 * scenicLift}" fill="${glow}" opacity="0.14"/>
        <circle cx="${width * 0.8}" cy="${height * 0.2}" r="${64 * scenicLift}" fill="${warm}" opacity="0.18"/>
        <path d="M0 ${height * 0.58} Q ${width * 0.26} ${height * 0.44}, ${width * 0.54} ${height * 0.5} T ${width} ${height * 0.44} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.22"/>
        <path d="M0 ${height * 0.88} L ${width * 0.2} ${height * 0.48} L ${width * 0.42} ${height * 0.88} Z" fill="${adjustColor(backgroundColor, -10)}" opacity="0.84"/>
        <path d="M${width * 0.16} ${height * 0.88} L ${width * 0.5} ${height * 0.28} L ${width * 0.84} ${height * 0.88} Z" fill="${deep}" opacity="0.97"/>
        <path d="M${width * 0.44} ${height * 0.5} L ${width * 0.5} ${height * 0.28} L ${width * 0.61} ${height * 0.54} Z" fill="${mist}" opacity="0.6"/>
        <path d="M0 ${height * 0.72} Q ${width * 0.28} ${height * 0.64}, ${width} ${height * 0.68}" stroke="${adjustColor(mist, 8)}" stroke-width="5" fill="none" opacity="0.08"/>
      `;
    case "garden":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.22}" rx="${96 * scenicLift}" ry="${84 * scenicLift}" fill="${glow}" opacity="0.14"/>
        <circle cx="${width * 0.78}" cy="${height * 0.22}" r="${72 * scenicLift}" fill="${warm}" opacity="0.18"/>
        <path d="M0 ${height * 0.78} Q ${width * 0.18} ${height * 0.58}, ${width * 0.42} ${height * 0.74} T ${width} ${height * 0.62} L ${width} ${height} L 0 ${height} Z" fill="${adjustColor(backgroundColor, 10)}" opacity="0.34"/>
        <path d="M0 ${height * 0.9} Q ${width * 0.24} ${height * 0.7}, ${width * 0.5} ${height * 0.86} T ${width} ${height * 0.78} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.96"/>
        <path d="M${width * 0.14} ${height * 0.86} q 18 -52 0 -106" stroke="${mist}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.54"/>
        <circle cx="${width * 0.15}" cy="${height * 0.68}" r="30" fill="${mist}" opacity="0.2"/>
        <path d="M${width * 0.84} ${height * 0.86} q -16 -48 -4 -102" stroke="${mist}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.5"/>
        <circle cx="${width * 0.82}" cy="${height * 0.68}" r="28" fill="${mist}" opacity="0.16"/>
      `;
    case "sea":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.2}" rx="${100 * scenicLift}" ry="${86 * scenicLift}" fill="${glow}" opacity="0.16"/>
        <circle cx="${width * 0.78}" cy="${height * 0.2}" r="${74 * scenicLift}" fill="${warm}" opacity="0.2"/>
        <path d="M0 ${height * 0.64} Q ${width * 0.12} ${height * 0.58}, ${width * 0.26} ${height * 0.64} T ${width * 0.52} ${height * 0.62} T ${width} ${height * 0.58} L ${width} ${height} L 0 ${height} Z" fill="${adjustColor(backgroundColor, 12)}" opacity="0.28"/>
        <path d="M0 ${height * 0.76} Q ${width * 0.12} ${height * 0.7}, ${width * 0.24} ${height * 0.76} T ${width * 0.5} ${height * 0.74} T ${width} ${height * 0.7} L ${width} ${height} L 0 ${height} Z" fill="${horizon}" opacity="0.36"/>
        <path d="M0 ${height * 0.88} Q ${width * 0.1} ${height * 0.82}, ${width * 0.22} ${height * 0.88} T ${width * 0.48} ${height * 0.86} T ${width} ${height * 0.82} L ${width} ${height} L 0 ${height} Z" fill="${deep}" opacity="0.95"/>
        <path d="M${width * 0.72} ${height * 0.7} l 22 0 l -10 -18 z" fill="${mist}" opacity="0.54"/>
        <path d="M${width * 0.734} ${height * 0.7} l 0 22" stroke="${mist}" stroke-width="4" opacity="0.54"/>
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

function wrapText(
  text: string,
  maxChars: number,
  x: number,
  lineHeight: number,
): string {
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
  return lines.join(`</tspan><tspan x="${x}" dy="${lineHeight}">`);
}

function buildAtmosphere({
  mood,
  width,
  height,
  textColor,
}: {
  mood: VerseSceneMood;
  width: number;
  height: number;
  textColor: string;
}) {
  switch (mood) {
    case "golden":
      return `
        <ellipse cx="${width * 0.78}" cy="${height * 0.18}" rx="${width * 0.26}" ry="${height * 0.24}" fill="${adjustColor("#f4c46a", 4)}" opacity="0.1"/>
        <path d="M0 ${height * 0.14} Q ${width * 0.28} ${height * 0.04}, ${width * 0.56} ${height * 0.12} T ${width} ${height * 0.06} L ${width} 0 L 0 0 Z" fill="${adjustColor("#f7dca2", 2)}" opacity="0.12"/>
      `;
    case "midnight":
      return `
        <circle cx="${width * 0.14}" cy="${height * 0.12}" r="2.4" fill="${textColor}" opacity="0.46"/>
        <circle cx="${width * 0.2}" cy="${height * 0.22}" r="1.8" fill="${textColor}" opacity="0.38"/>
        <circle cx="${width * 0.3}" cy="${height * 0.1}" r="2.2" fill="${textColor}" opacity="0.42"/>
        <circle cx="${width * 0.9}" cy="${height * 0.14}" r="2.1" fill="${textColor}" opacity="0.4"/>
        <circle cx="${width * 0.82}" cy="${height * 0.08}" r="1.7" fill="${textColor}" opacity="0.34"/>
      `;
    case "daybreak":
    default:
      return `
        <path d="M0 ${height * 0.22} Q ${width * 0.22} ${height * 0.16}, ${width * 0.46} ${height * 0.24} T ${width} ${height * 0.18}" stroke="${adjustColor(textColor, -10)}" stroke-width="5" fill="none" opacity="0.06"/>
      `;
  }
}

function getLayoutConfig(
  layout: VerseImageLayout,
  width: number,
  height: number,
  theme: VerseArtworkTheme,
) {
  if (layout === "immersive") {
    return {
      panelX: 54,
      panelY: 54,
      panelWidth: width * 0.46,
      panelHeight: height - 108,
      panelRadius: 34,
      innerX: 72,
      innerY: 72,
      innerWidth: width * 0.46 - 36,
      innerHeight: height - 144,
      innerRadius: 24,
      lineLeft: 96,
      lineRight: width * 0.46 - 14,
      lineTop: 104,
      lineBottom: height - 104,
      textX: 104,
      quoteY: theme === "minimal" ? 180 : 166,
      quoteFontSize: 42,
      referenceX: 104,
      referenceY: height - 152,
      referenceFontSize: 28,
      textAnchor: "start",
      maxChars: 24,
      lineHeight: 56,
    };
  }

  if (layout === "poster") {
    return {
      panelX: 62,
      panelY: height * 0.47,
      panelWidth: width - 124,
      panelHeight: height * 0.41,
      panelRadius: 32,
      innerX: 82,
      innerY: height * 0.47 + 18,
      innerWidth: width - 164,
      innerHeight: height * 0.41 - 36,
      innerRadius: 24,
      lineLeft: 112,
      lineRight: width - 112,
      lineTop: height * 0.47 + 34,
      lineBottom: height - 92,
      textX: width / 2,
      quoteY: height * 0.47 + 104,
      quoteFontSize: 40,
      referenceX: width / 2,
      referenceY: height - 124,
      referenceFontSize: 29,
      textAnchor: "middle",
      maxChars: 36,
      lineHeight: 54,
    };
  }

  return {
    panelX: 72,
    panelY: 72,
    panelWidth: width - 144,
    panelHeight: height - 144,
    panelRadius: 36,
    innerX: 92,
    innerY: 92,
    innerWidth: width - 184,
    innerHeight: height - 184,
    innerRadius: 28,
    lineLeft: 120,
    lineRight: width - 120,
    lineTop: 120,
    lineBottom: height - 120,
    textX: width / 2,
    quoteY: theme === "minimal" ? height / 2 - 56 : height / 2 - 34,
    quoteFontSize: 46,
    referenceX: width / 2,
    referenceY: theme === "minimal" ? height / 2 + 138 : height / 2 + 154,
    referenceFontSize: 31,
    textAnchor: "middle",
    maxChars: 34,
    lineHeight: 60,
  };
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

function getMoodGradientEnd(color: string, mood: VerseSceneMood) {
  switch (mood) {
    case "golden":
      return mixColors(adjustColor(color, -10), "#7a4d20", 0.34);
    case "midnight":
      return mixColors(adjustColor(color, -26), "#070b14", 0.5);
    case "daybreak":
    default:
      return mixColors(adjustColor(color, -18), "#9fb7c7", 0.16);
  }
}

function mixColors(leftHex: string, rightHex: string, weight: number) {
  const left = parseInt(leftHex.replace("#", ""), 16);
  const right = parseInt(rightHex.replace("#", ""), 16);
  const ratio = Math.min(1, Math.max(0, weight));
  const r = Math.round(((left >> 16) & 0xff) * (1 - ratio) + ((right >> 16) & 0xff) * ratio);
  const g = Math.round(((left >> 8) & 0xff) * (1 - ratio) + ((right >> 8) & 0xff) * ratio);
  const b = Math.round((left & 0xff) * (1 - ratio) + (right & 0xff) * ratio);

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
    case "garden":
      return "#bdd7a4";
    case "sea":
      return "#97d3df";
    case "minimal":
    default:
      return adjustColor(textColor, -18);
  }
}

function getFrameFill(theme: VerseArtworkTheme, mood: VerseSceneMood) {
  const overlay = mood === "midnight" ? 0.5 : mood === "golden" ? 0.38 : 0.42;
  switch (theme) {
    case "desert":
      return `rgba(38,24,10,${overlay})`;
    case "cross":
      return `rgba(26,18,12,${overlay + 0.02})`;
    case "shepherd":
      return `rgba(14,24,18,${overlay + 0.02})`;
    case "dove":
      return `rgba(16,22,32,${overlay - 0.02})`;
    case "mountain":
      return `rgba(14,18,24,${overlay + 0.02})`;
    case "garden":
      return `rgba(16,24,14,${overlay + 0.02})`;
    case "sea":
      return `rgba(10,23,28,${overlay - 0.02})`;
    case "minimal":
    default:
      return mood === "midnight" ? "rgba(12,12,12,0.22)" : "rgba(12,12,12,0.14)";
  }
}

function getFrameStroke(theme: VerseArtworkTheme, mood: VerseSceneMood) {
  const alpha = mood === "midnight" ? 0.3 : 0.24;
  switch (theme) {
    case "desert":
      return `rgba(245,196,107,${alpha})`;
    case "cross":
      return `rgba(216,199,163,${alpha})`;
    case "shepherd":
      return `rgba(199,217,183,${alpha - 0.02})`;
    case "dove":
      return `rgba(217,230,247,${alpha - 0.02})`;
    case "mountain":
      return `rgba(189,211,231,${alpha - 0.04})`;
    case "garden":
      return `rgba(189,215,164,${alpha - 0.02})`;
    case "sea":
      return `rgba(151,211,223,${alpha - 0.03})`;
    case "minimal":
    default:
      return mood === "midnight" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.12)";
  }
}
