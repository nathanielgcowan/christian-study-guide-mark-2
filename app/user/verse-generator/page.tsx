"use client";

import { useState } from "react";
import Link from "next/link";

interface ShareImage {
  url: string;
  timestamp: number;
}

export default function VerseImageGeneratorPage() {
  const [verse, setVerse] = useState("For God so loved the world...");
  const [reference, setReference] = useState("John 3:16");
  const [bgColor, setBgColor] = useState("#1f2937");
  const [textColor, setTextColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

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
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedImage(url);
        setDownloaded(false);
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

  function shareImage() {
    const params = new URLSearchParams({
      verse,
      reference,
      bg: bgColor,
      text: textColor,
    });
    const shareUrl = `/share/verse?${params.toString()}`;
    window.location.href = shareUrl;
  }

  const presets = [
    {
      name: "Dark Blue",
      bg: "#1e3a8a",
      text: "#ffffff",
    },
    {
      name: "Deep Purple",
      bg: "#5b21b6",
      text: "#f3e8ff",
    },
    {
      name: "Slate",
      bg: "#1f2937",
      text: "#f1f5f9",
    },
    {
      name: "Forest",
      bg: "#15803d",
      text: "#dcfce7",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back home
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Editor */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold">
            Bible Verse Image Generator
          </h1>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Verse Text
              </label>
              <textarea
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={3}
                placeholder="Enter verse text..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Reference (e.g. John 3:16)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="John 3:16"
              />
            </div>

            <div className="pt-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                Color Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setBgColor(preset.bg);
                      setTextColor(preset.text);
                    }}
                    className="rounded-lg p-3 text-left transition hover:scale-105"
                    style={{
                      backgroundColor: preset.bg,
                      color: preset.text,
                      border:
                        bgColor === preset.bg
                          ? "2px solid white"
                          : "1px solid #e5e7eb",
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-16 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-16 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={handleGenerateImage}
                disabled={loading}
                aria-label="Generate verse image"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Image"}
              </button>
              {generatedImage && (
                <>
                  <button
                    onClick={downloadImage}
                    aria-label="Download verse image"
                    className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    Download
                  </button>
                  <button
                    onClick={shareImage}
                    aria-label="Share verse image link"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Share Link
                  </button>
                </>
              )}
            </div>

            {downloaded && (
              <p className="mt-3 text-sm text-emerald-600">
                ✓ Image downloaded!
              </p>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Preview</h2>

          {generatedImage ? (
            <div className="rounded-lg bg-slate-100 p-4">
              <img
                src={generatedImage}
                alt="Generated verse"
                className="w-full rounded-lg shadow-md"
              />
              <p className="mt-4 text-center text-sm text-slate-600">
                1200x630px (perfect for social media)
              </p>
            </div>
          ) : (
            <div
              className="flex h-64 items-center justify-center rounded-lg text-slate-400"
              style={{ backgroundColor: bgColor }}
            >
              <div className="text-center">
                <p className="mb-2 text-lg">{verse}</p>
                <p className="text-sm italic">{reference}</p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Share Tips</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✓ Instagram: 1200x630px recommended</li>
              <li>✓ Twitter: Works great for thread covers</li>
              <li>✓ Facebook: Perfect for daily posts</li>
              <li>✓ Pinterest: Save for collection</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
