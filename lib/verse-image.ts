import sharp from "sharp";

export interface VerseImageOptions {
  verse: string;
  reference: string;
  backgroundColor?: string;
  textColor?: string;
  width?: number;
  height?: number;
}

const DEFAULT_OPTIONS = {
  backgroundColor: "#1f2937",
  textColor: "#ffffff",
  width: 1200,
  height: 630,
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
  } = options;

  // Create SVG with verse text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustColor(backgroundColor, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      
      <!-- Decorative top border -->
      <line x1="50" y1="60" x2="${width - 50}" y2="60" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
      
      <!-- Verse text -->
      <text
        x="${width / 2}"
        y="${height / 2 - 60}"
        font-family="Georgia, serif"
        font-size="48"
        font-weight="normal"
        text-anchor="middle"
        fill="${textColor}"
        dominant-baseline="middle"
        width="${width - 100}"
      >
        <tspan x="${width / 2}" dy="0">"${wrapText(verse, 40)}"</tspan>
      </text>
      
      <!-- Reference -->
      <text
        x="${width / 2}"
        y="${height / 2 + 120}"
        font-family="Georgia, serif"
        font-size="32"
        font-style="italic"
        text-anchor="middle"
        fill="#93c5fd"
        opacity="0.9"
      >
        ${reference}
      </text>
      
      <!-- Decorative footer -->
      <text
        x="${width / 2}"
        y="${height - 40}"
        font-family="Arial, sans-serif"
        font-size="18"
        text-anchor="middle"
        fill="${adjustColor(textColor, -30)}"
        opacity="0.7"
      >
        Christian Study Guide
      </text>
    </svg>
  `;

  // Convert SVG to PNG
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return buffer;
}

function wrapText(text: string, maxChars: number): string {
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
  return lines.join('</tspan><tspan x="600" dy="60">');
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return (
    "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).substring(1)
  );
}
