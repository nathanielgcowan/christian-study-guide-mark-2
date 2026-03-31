"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function VerseShareClient({
  verse,
  reference,
  theme = "minimal",
  layout = "classic",
  mood = "daybreak",
}: {
  verse?: string;
  reference?: string;
  theme?: string;
  layout?: string;
  mood?: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);
  const verseText = verse || "For God so loved the world...";
  const verseReference = reference || "John 3:16";

  const imageUrl = useMemo(() => {
    const params = new URLSearchParams({
      verse: verseText,
      reference: verseReference,
      bg: "#111111",
      text: "#ffffff",
      theme,
      layout,
      mood,
    });

    return `/api/og/verse?${params.toString()}`;
  }, [layout, mood, theme, verseReference, verseText]);

  async function copyLink() {
    if (!currentUrl) return;
    await navigator.clipboard.writeText(currentUrl);
    setStatus("Share link copied.");
  }

  async function copyImageUrl() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    await navigator.clipboard.writeText(`${origin}${imageUrl}`);
    setStatus("Image URL copied.");
  }

  async function downloadImage() {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `verse-${verseReference.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.click();
    URL.revokeObjectURL(objectUrl);
    setStatus("Image downloaded.");
  }

  async function shareToInstagram() {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `verse-${verseReference.replace(/\s+/g, "-").toLowerCase()}.png`,
        { type: "image/png" },
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({
          title: verseReference,
          text: "Choose Instagram from the share sheet to post this image.",
          files: [file],
        });
        setStatus("Choose Instagram in the share sheet to finish posting.");
        return;
      }

      await downloadImage();
      setStatus(
        "Instagram direct upload is not available here. The image was downloaded so you can post it in Instagram manually.",
      );
    } catch (error) {
      console.error(error);
      setStatus("Instagram sharing was canceled or unavailable.");
    }
  }

  async function shareImage() {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `verse-${verseReference.replace(/\s+/g, "-").toLowerCase()}.png`,
        { type: "image/png" },
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({
          title: verseReference,
          text: verseText,
          files: [file],
        });
        setStatus("Image shared.");
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: verseReference,
          text: verseText,
          url: currentUrl,
        });
        setStatus("Share sheet opened.");
        return;
      }

      await copyImageUrl();
    } catch (error) {
      console.error(error);
      setStatus("Sharing was canceled or unavailable.");
    }
  }

  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">Verse image sharing</p>
        <h1>Share the verse as an image, not just a link.</h1>
        <p className="content-lead">
          Preview the generated artwork, download it, open the native share
          sheet, or copy the image URL for posting anywhere.
        </p>
      </section>

      <section className="content-card content-stack">
        <div className="share-image-preview">
          <Image
            src={imageUrl}
            alt={`${verseReference} verse share image`}
            width={1200}
            height={630}
            className="share-image-preview-media"
            unoptimized
          />
        </div>

        <div className="content-card-note">
          <strong>{verseReference}</strong>
          <p>{verseText}</p>
        </div>

        <div className="share-actions">
          <button onClick={() => void shareImage()} className="button-primary">
            Share image
          </button>
          <button
            onClick={() => void shareToInstagram()}
            className="button-secondary button-instagram"
          >
            Instagram
          </button>
          <button
            onClick={() => void downloadImage()}
            className="button-secondary"
          >
            Download PNG
          </button>
          <a
            href={imageUrl}
            download={`verse-${verseReference.replace(/\s+/g, "-").toLowerCase()}.png`}
            className="button-secondary"
          >
            Save image
          </a>
          <button onClick={() => void copyImageUrl()} className="button-secondary">
            Copy image URL
          </button>
          <button onClick={() => void copyLink()} className="button-secondary">
            Copy Link
          </button>
        </div>

        <div className="content-card-note">
          <code>{currentUrl || "Loading link..."}</code>
        </div>

        {status ? <p className="share-status">{status}</p> : null}

        <Link
          href={`/user/verse-generator?verse=${encodeURIComponent(verseText)}&&reference=${encodeURIComponent(verseReference)}`}
          className="button-secondary"
        >
          Create Another Verse
        </Link>
      </section>
    </main>
  );
}
