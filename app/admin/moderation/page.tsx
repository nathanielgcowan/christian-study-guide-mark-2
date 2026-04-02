"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ModerationStatus = "approved" | "flagged" | "hidden";
type ModerationEntry = {
  status: ModerationStatus;
  note: string;
  updatedAt: string;
  updatedBy: string;
} | null;

type ModerationPrayer = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  repliesCount: number;
  userName: string;
  moderation: ModerationEntry;
};

type ModerationTestimony = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  scripture: string;
  moderation: ModerationEntry;
};

type ModerationContent = {
  id: string;
  title: string;
  excerpt: string;
  type: string;
  status: string;
  owner: string;
  moderation: ModerationEntry;
};

export default function AdminModerationPage() {
  const [prayers, setPrayers] = useState<ModerationPrayer[]>([]);
  const [testimonies, setTestimonies] = useState<ModerationTestimony[]>([]);
  const [content, setContent] = useState<ModerationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/moderation");
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = (await response.json()) as {
        prayers: ModerationPrayer[];
        testimonies: ModerationTestimony[];
        content: ModerationContent[];
      };

      setPrayers(data.prayers);
      setTestimonies(data.testimonies);
      setContent(data.content);
      setLoading(false);
    }

    void load();
  }, []);

  const flaggedCount = useMemo(
    () =>
      [...prayers, ...testimonies, ...content].filter(
        (item) => item.moderation?.status === "flagged",
      ).length,
    [content, prayers, testimonies],
  );

  async function updateModeration(
    section: "prayers" | "testimonies" | "content",
    id: string,
    status: ModerationStatus,
  ) {
    const response = await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section,
        id,
        status,
      }),
    });

    const data = (await response.json()) as {
      moderation?: ModerationEntry;
      error?: string;
    };

    if (!response.ok || !data.moderation) {
      setStatusMessage(data.error ?? "Unable to update moderation status.");
      return;
    }

    const apply = <T extends { id: string; moderation: ModerationEntry }>(items: T[]) =>
      items.map((item) => (item.id === id ? { ...item, moderation: data.moderation ?? null } : item));

    if (section === "prayers") setPrayers((current) => apply(current));
    if (section === "testimonies") setTestimonies((current) => apply(current));
    if (section === "content") setContent((current) => apply(current));
    setStatusMessage(`Moderation updated to ${status}.`);
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Admin moderation</p>
        <h1>Review testimonies, public prayers, and community-facing content in one place.</h1>
        <p className="content-lead">
          This queue helps the team scan what is public, flag what needs attention,
          and hide what should not stay visible.
        </p>
        <div className="content-actions">
          <Link href="/admin/content" className="button-secondary">
            Editorial CMS
          </Link>
          <Link href="/admin/analytics" className="button-secondary">
            Admin analytics
          </Link>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-card">
          <h2>Public prayers</h2>
          <p>{prayers.length}</p>
        </article>
        <article className="content-card">
          <h2>Featured testimonies</h2>
          <p>{testimonies.length}</p>
        </article>
        <article className="content-card">
          <h2>Flagged items</h2>
          <p>{flaggedCount}</p>
        </article>
      </section>

      {statusMessage ? <p className="share-status">{statusMessage}</p> : null}

      {loading ? (
        <section className="content-card">
          <h2>Loading moderation queue...</h2>
        </section>
      ) : null}

      <section className="content-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Public prayers</p>
          <h2>Community prayer feed</h2>
        </div>
        {prayers.map((item) => (
          <article key={item.id} className="content-card-note">
            <div className="content-chip-row">
              <span className="content-badge">{item.userName}</span>
              <span className="content-chip">{item.repliesCount} replies</span>
              <span className="content-chip">{item.moderation?.status ?? "approved"}</span>
            </div>
            <strong>{item.title}</strong>
            <p>{item.excerpt}</p>
            <div className="content-actions">
              <button type="button" className="button-secondary" onClick={() => void updateModeration("prayers", item.id, "approved")}>
                Approve
              </button>
              <button type="button" className="button-secondary" onClick={() => void updateModeration("prayers", item.id, "flagged")}>
                Flag
              </button>
              <button type="button" className="button-secondary" onClick={() => void updateModeration("prayers", item.id, "hidden")}>
                Hide
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="content-grid-two">
        <section className="content-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">Testimony wall</p>
            <h2>Featured testimonies</h2>
          </div>
          {testimonies.map((item) => (
            <article key={item.id} className="content-card-note">
              <div className="content-chip-row">
                <span className="content-badge">{item.author}</span>
                <span className="content-chip">{item.scripture}</span>
                <span className="content-chip">{item.moderation?.status ?? "approved"}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.excerpt}</p>
              <div className="content-actions">
                <button type="button" className="button-secondary" onClick={() => void updateModeration("testimonies", item.id, "approved")}>
                  Approve
                </button>
                <button type="button" className="button-secondary" onClick={() => void updateModeration("testimonies", item.id, "flagged")}>
                  Flag
                </button>
                <button type="button" className="button-secondary" onClick={() => void updateModeration("testimonies", item.id, "hidden")}>
                  Hide
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="content-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">Community content</p>
            <h2>Editorial and public-facing entries</h2>
          </div>
          {content.map((item) => (
            <article key={item.id} className="content-card-note">
              <div className="content-chip-row">
                <span className="content-badge">{item.type}</span>
                <span className="content-chip">{item.status}</span>
                <span className="content-chip">{item.moderation?.status ?? "approved"}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.excerpt}</p>
              <div className="content-actions">
                <button type="button" className="button-secondary" onClick={() => void updateModeration("content", item.id, "approved")}>
                  Approve
                </button>
                <button type="button" className="button-secondary" onClick={() => void updateModeration("content", item.id, "flagged")}>
                  Flag
                </button>
                <button type="button" className="button-secondary" onClick={() => void updateModeration("content", item.id, "hidden")}>
                  Hide
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
