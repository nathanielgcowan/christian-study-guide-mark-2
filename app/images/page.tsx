"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Download, ImagePlus, Trash2 } from "lucide-react";
import {
  SavedVerseImage,
  VERSE_IMAGE_GALLERY_KEY,
} from "@/lib/verse-gallery";

export default function ImagesPage() {
  const [items, setItems] = useState<SavedVerseImage[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(VERSE_IMAGE_GALLERY_KEY);
      if (!stored) {
        return [];
      }

      return JSON.parse(stored) as SavedVerseImage[];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  function persist(nextItems: SavedVerseImage[]) {
    setItems(nextItems);
    window.localStorage.setItem(
      VERSE_IMAGE_GALLERY_KEY,
      JSON.stringify(nextItems),
    );
  }

  function removeItem(id: string) {
    persist(items.filter((item) => item.id !== id));
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Saved verse images</p>
        <h1>Keep your Scripture artwork in one reusable gallery.</h1>
        <p className="content-lead">
          Save the strongest images from the generator, revisit them later, and
          reuse them for ministry posts, encouragement notes, or personal study.
        </p>
        <div className="content-actions">
          <Link href="/user/verse-generator" className="button-primary">
            <ImagePlus size={16} />
            Create a new image
          </Link>
          <Link href="/share/verse" className="button-secondary">
            Open share page
          </Link>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="content-card">
          <div className="content-card-note">
            <strong>No saved images yet</strong>
            <p>
              Generate a verse image and save it to your gallery to build a
              reusable library of Scripture artwork.
            </p>
          </div>
        </section>
      ) : (
        <section className="saved-gallery-grid">
          {items.map((item) => (
            <article key={item.id} className="content-card saved-gallery-card">
              <div className="saved-gallery-frame">
                <Image
                  src={item.imageUrl}
                  alt={`${item.reference} saved verse artwork`}
                  width={1200}
                  height={630}
                  className="saved-gallery-image"
                  unoptimized
                />
              </div>
              <div className="content-card-note">
                <strong>{item.reference}</strong>
                <p>{item.verse}</p>
              </div>
              <div className="content-chip-row">
                <span className="content-chip">Theme: {item.theme}</span>
                <span className="content-chip">
                  Saved {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="content-actions">
                <a
                  href={item.imageUrl}
                  download={`verse-${item.reference.replace(/\s+/g, "-").toLowerCase()}.png`}
                  className="button-secondary"
                >
                  <Download size={16} />
                  Download
                </a>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
