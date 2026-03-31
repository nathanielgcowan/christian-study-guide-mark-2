"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SavedVerseImage,
  VERSE_IMAGE_GALLERY_KEY,
} from "@/lib/verse-gallery";

const presets = [
  {
    name: "Ink",
    bg: "#111111",
    text: "#f7f5ef",
  },
  {
    name: "Stone",
    bg: "#2a2a28",
    text: "#f1eee7",
  },
  {
    name: "Forest",
    bg: "#1d3a31",
    text: "#f0f6ee",
  },
  {
    name: "Midnight",
    bg: "#1c2333",
    text: "#eef2ff",
  },
];

const artworkThemes = [
  { id: "minimal", name: "Minimal" },
  { id: "desert", name: "Desert" },
  { id: "cross", name: "Cross" },
  { id: "shepherd", name: "Shepherd" },
  { id: "dove", name: "Dove" },
  { id: "mountain", name: "Mountain" },
  { id: "garden", name: "Garden" },
  { id: "sea", name: "Sea" },
] as const;

const imageLayouts = [
  {
    id: "classic",
    name: "Classic card",
    detail: "Balanced verse card with artwork supporting the text.",
  },
  {
    id: "poster",
    name: "Poster scene",
    detail: "Picture-first composition with the verse anchored in a lower panel.",
  },
  {
    id: "immersive",
    name: "Immersive split",
    detail: "Editorial side panel with more room for the biblical scene itself.",
  },
] as const;

const sceneMoods = [
  {
    id: "daybreak",
    name: "Daybreak",
    detail: "Misty early light and a softer, calmer scene.",
  },
  {
    id: "golden",
    name: "Golden hour",
    detail: "Warmer light with a richer cinematic glow.",
  },
  {
    id: "midnight",
    name: "Midnight",
    detail: "Darker contrast, quieter skies, and deeper atmosphere.",
  },
] as const;

export default function VerseImageGeneratorPage() {
  const [verse, setVerse] = useState("For God so loved the world...");
  const [reference, setReference] = useState("John 3:16");
  const [bgColor, setBgColor] = useState("#111111");
  const [textColor, setTextColor] = useState("#f7f5ef");
  const [theme, setTheme] =
    useState<(typeof artworkThemes)[number]["id"]>("minimal");
  const [layout, setLayout] =
    useState<(typeof imageLayouts)[number]["id"]>("classic");
  const [mood, setMood] =
    useState<(typeof sceneMoods)[number]["id"]>("daybreak");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  async function handleGenerateImage() {
    if (!verse.trim() || !reference.trim()) {
      alert("Please enter both verse and reference");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/verse/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verse,
          reference,
          backgroundColor: bgColor,
          textColor,
          theme,
          layout,
          mood,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedImage(url);
        setDownloaded(false);
        setShareStatus(null);
      } else {
        alert("Failed to generate image");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating image");
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `verse-${Date.now()}.png`;
    link.click();
    setDownloaded(true);
  }

  async function saveToGallery() {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
            return;
          }

          reject(new Error("Unable to convert image."));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });

      const nextItem: SavedVerseImage = {
        id: `${reference}-${Date.now()}`,
        verse,
        reference,
        theme,
        layout,
        mood,
        bgColor,
        textColor,
        imageUrl: dataUrl,
        createdAt: new Date().toISOString(),
      };

      const stored = window.localStorage.getItem(VERSE_IMAGE_GALLERY_KEY);
      const parsed = stored ? (JSON.parse(stored) as SavedVerseImage[]) : [];
      const nextGallery = [nextItem, ...parsed].slice(0, 24);

      window.localStorage.setItem(
        VERSE_IMAGE_GALLERY_KEY,
        JSON.stringify(nextGallery),
      );
      setShareStatus("Saved to your verse image gallery.");
    } catch (error) {
      console.error(error);
      setShareStatus("Unable to save this image to the gallery.");
    }
  }

  function shareImagePage() {
    const params = new URLSearchParams({
      verse,
      reference,
      bg: bgColor,
      text: textColor,
      theme,
      layout,
      mood,
    });
    window.location.href = `/share/verse?${params.toString()}`;
  }

  async function shareToInstagram() {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `verse-${reference.replace(/\s+/g, "-").toLowerCase()}.png`,
        { type: "image/png" },
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({
          title: reference,
          text: "Choose Instagram from the share sheet to post this image.",
          files: [file],
        });
        setShareStatus("Choose Instagram in the share sheet to finish posting.");
        return;
      }

      downloadImage();
      setShareStatus(
        "Instagram direct upload is not available here. The image was downloaded so you can post it in Instagram manually.",
      );
    } catch (error) {
      console.error(error);
      setShareStatus("Instagram sharing was canceled or unavailable.");
    }
  }

  async function quickShareImage() {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `verse-${reference.replace(/\s+/g, "-").toLowerCase()}.png`,
        { type: "image/png" },
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({
          title: reference,
          text: verse,
          files: [file],
        });
        setShareStatus("Image shared.");
        return;
      }

      shareImagePage();
    } catch (error) {
      console.error(error);
      setShareStatus("Sharing was canceled or unavailable.");
    }
  }

  return (
    <main id="main-content" className="page-shell content-shell verse-studio-shell">
      <section className="content-hero verse-studio-hero">
        <p className="eyebrow">Verse image studio</p>
        <h1>Create a cleaner Scripture graphic in a few focused steps.</h1>
        <p className="content-lead">
          Write the verse, choose a restrained palette, preview the result, and
          share a polished image without fighting a busy editor.
        </p>
        <div className="content-actions">
          <Link href="/" className="button-secondary">
            Back home
          </Link>
          <Link href="/images" className="button-secondary">
            Open gallery
          </Link>
          <Link href="/share/verse" className="button-secondary">
            Open share page
          </Link>
        </div>
      </section>

      <section className="verse-studio-grid">
        <section className="content-card verse-studio-panel">
          <div className="content-section-heading">
            <p className="eyebrow">Compose</p>
            <h2>Write the verse</h2>
          </div>

          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label">Verse text</label>
              <textarea
                value={verse}
                onChange={(event) => setVerse(event.target.value)}
                className="minimal-textarea verse-studio-textarea"
                rows={5}
                placeholder="Enter verse text..."
              />
            </div>

            <div>
              <label className="minimal-label">Reference</label>
              <input
                type="text"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                className="minimal-input"
                placeholder="John 3:16"
              />
            </div>
          </div>

          <div className="content-section-heading">
            <p className="eyebrow">Palette</p>
            <h2>Choose a minimal tone</h2>
          </div>

          <div className="verse-preset-grid">
            {presets.map((preset) => {
              const selected =
                preset.bg === bgColor && preset.text === textColor;

              return (
                <button
                  key={preset.name}
                  onClick={() => {
                    setBgColor(preset.bg);
                    setTextColor(preset.text);
                  }}
                  className={`verse-preset ${selected ? "verse-preset-active" : ""}`}
                  style={{
                    backgroundColor: preset.bg,
                    color: preset.text,
                  }}
                >
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="verse-color-grid">
            <div>
              <label className="minimal-label">Background</label>
              <div className="verse-color-input">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(event) => setBgColor(event.target.value)}
                  className="verse-color-swatch"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(event) => setBgColor(event.target.value)}
                  className="minimal-input"
                />
              </div>
            </div>

            <div>
              <label className="minimal-label">Text</label>
              <div className="verse-color-input">
                <input
                  type="color"
                  value={textColor}
                  onChange={(event) => setTextColor(event.target.value)}
                  className="verse-color-swatch"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(event) => setTextColor(event.target.value)}
                  className="minimal-input"
                />
              </div>
            </div>
          </div>

          <div className="content-section-heading">
            <p className="eyebrow">Artwork</p>
            <h2>Pick a biblical picture theme</h2>
          </div>

          <div className="verse-theme-grid">
            {artworkThemes.map((artworkTheme) => (
              <button
                key={artworkTheme.id}
                type="button"
                onClick={() => setTheme(artworkTheme.id)}
                className={
                  theme === artworkTheme.id ? "button-primary" : "button-secondary"
                }
              >
                {artworkTheme.name}
              </button>
            ))}
          </div>

          <div className="content-section-heading">
            <p className="eyebrow">Picture mode</p>
            <h2>Choose the composition style</h2>
          </div>

          <div className="verse-layout-grid">
            {imageLayouts.map((imageLayout) => (
              <button
                key={imageLayout.id}
                type="button"
                onClick={() => setLayout(imageLayout.id)}
                className={`verse-layout-card${layout === imageLayout.id ? " verse-layout-card-active" : ""}`}
              >
                <strong>{imageLayout.name}</strong>
                <p>{imageLayout.detail}</p>
              </button>
            ))}
          </div>

          <div className="content-section-heading">
            <p className="eyebrow">Scene mood</p>
            <h2>Set the atmosphere around the verse</h2>
          </div>

          <div className="verse-layout-grid">
            {sceneMoods.map((sceneMood) => (
              <button
                key={sceneMood.id}
                type="button"
                onClick={() => setMood(sceneMood.id)}
                className={`verse-layout-card${mood === sceneMood.id ? " verse-layout-card-active" : ""}`}
              >
                <strong>{sceneMood.name}</strong>
                <p>{sceneMood.detail}</p>
              </button>
            ))}
          </div>

          <div className="content-actions">
            <button
              onClick={() => void handleGenerateImage()}
              disabled={loading}
              className="button-primary"
            >
              {loading ? "Generating..." : "Generate image"}
            </button>
            {generatedImage ? (
              <>
                <button onClick={downloadImage} className="button-secondary">
                  Download PNG
                </button>
                <button
                  onClick={() => void quickShareImage()}
                  className="button-secondary"
                >
                  Share image
                </button>
                <button
                  onClick={() => void saveToGallery()}
                  className="button-secondary"
                >
                  Save to gallery
                </button>
                <button
                  onClick={() => void shareToInstagram()}
                  className="button-secondary button-instagram"
                >
                  Instagram
                </button>
                <button onClick={shareImagePage} className="button-secondary">
                  Share page
                </button>
              </>
            ) : null}
          </div>

          {generatedImage ? (
            <a
              href={generatedImage}
              download={`verse-${reference.replace(/\s+/g, "-").toLowerCase()}.png`}
              className="button-secondary"
            >
              Save generated image
            </a>
          ) : null}

          {downloaded ? <p className="share-status">Image downloaded.</p> : null}
          {shareStatus ? <p className="share-status">{shareStatus}</p> : null}
        </section>

        <section className="content-card verse-studio-panel">
          <div className="content-section-heading">
            <p className="eyebrow">Preview</p>
            <h2>See the final social image</h2>
          </div>

          {generatedImage ? (
            <div className="share-image-preview">
              <Image
                src={generatedImage}
                alt="Generated verse"
                className="share-image-preview-media"
                width={1200}
                height={630}
                unoptimized
              />
            </div>
          ) : (
            <div
              className="verse-studio-placeholder"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <div className="verse-studio-placeholder-inner">
                <p className="verse-studio-placeholder-verse">
                  &ldquo;{verse}&rdquo;
                </p>
                <p className="verse-studio-placeholder-reference">
                  {reference}
                </p>
              </div>
            </div>
          )}

          <div className="content-card-note">
            <strong>1200 × 630 px</strong>
            <p>
              Sized for social previews, posts, and link cards with a cleaner
              presentation.
            </p>
          </div>

          <div className="content-card-note">
            <strong>Works best for:</strong>
            <p>
              Instagram captions, Facebook posts, X shares, and simple ministry
              graphics.
            </p>
          </div>

          <div className="content-card-note">
            <strong>Artwork mode:</strong>
            <p>
              Switch from a clean verse card to richer picture-style biblical
              scenes, then shape the composition and atmosphere with layout and
              scene mood controls.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
