"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PrayerItem {
  id: string;
  author: string;
  text: string;
  status: "active" | "answered";
  createdAt: string;
}

interface Group {
  slug: string;
  title: string;
  focus: string;
  cadence: string;
  description: string;
  members: number;
  nextStep: string;
  prayerItems: PrayerItem[];
}

export default function GroupDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [group, setGroup] = useState<Group | null>(null);
  const [author, setAuthor] = useState("");
  const [prayerText, setPrayerText] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/groups/${slug}`);
      if (!response.ok) return;
      const data = (await response.json()) as { group: Group };
      setGroup(data.group);
    }

    void load();
  }, [slug]);

  async function addPrayer() {
    if (!author.trim() || !prayerText.trim()) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "add-prayer",
        author: author.trim(),
        text: prayerText.trim(),
      }),
    });

    if (!response.ok || !group) return;
    const data = (await response.json()) as { prayerItem: PrayerItem };
    setGroup({
      ...group,
      prayerItems: [data.prayerItem, ...group.prayerItems],
    });
    setAuthor("");
    setPrayerText("");
  }

  async function markAnswered(prayerId: string) {
    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "update-status",
        prayerId,
        status: "answered",
      }),
    });

    if (!response.ok || !group) return;

    setGroup({
      ...group,
      prayerItems: group.prayerItems.map((item) =>
        item.id === prayerId ? { ...item, status: "answered" } : item,
      ),
    });
  }

  if (!group) {
    return (
      <main className="page-shell content-shell-narrow">
        <section className="content-card">
          <h2>Loading group...</h2>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Group detail</p>
        <h1>{group.title}</h1>
        <p className="content-lead">{group.description}</p>
        <div className="content-chip-row">
          <span className="content-chip">{group.focus}</span>
          <span className="content-chip">{group.cadence}</span>
          <span className="content-chip">{group.members} members</span>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Group rhythm</p>
            <h2>What happens next</h2>
          </div>
          <div className="content-card-note">
            <strong>Next step</strong>
            <p>{group.nextStep}</p>
          </div>
          <div className="content-actions">
            <Link href="/reading-plans" className="button-secondary">
              Reading plans
            </Link>
            <Link href={`/passage/${encodeURIComponent(group.focus)}`} className="button-secondary">
              Passage workspace
            </Link>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Add prayer</p>
            <h2>Post an update for the group</h2>
          </div>
          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label">Name</label>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="minimal-input"
              />
            </div>
            <div>
              <label className="minimal-label">Prayer request</label>
              <textarea
                value={prayerText}
                onChange={(event) => setPrayerText(event.target.value)}
                className="minimal-textarea"
                rows={4}
              />
            </div>
            <button type="button" className="button-primary" onClick={() => void addPrayer()}>
              Add prayer request
            </button>
          </div>
        </section>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Prayer feed</p>
          <h2>Requests and answered prayer</h2>
        </div>
        <div className="content-stack">
          {group.prayerItems.map((item) => (
            <div key={item.id} className="content-card-note">
              <strong>
                {item.author} · {item.status}
              </strong>
              <p>{item.text}</p>
              {item.status === "active" ? (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => void markAnswered(item.id)}
                >
                  Mark answered
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
