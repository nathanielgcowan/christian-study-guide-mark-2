"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUserTestimonies, TestimonyRecord } from "@/lib/client-features";
import { TestimonyEntry } from "@/lib/testimony-wall";

function formatCreatedTimeframe(createdAt?: string, fallback?: string) {
  if (!createdAt) return fallback ?? "Shared recently";
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return fallback ?? "Shared recently";
  return "Shared recently";
}

export default function TestimoniesClient({
  featuredEntries,
}: {
  featuredEntries: TestimonyEntry[];
}) {
  const [userEntries, setUserEntries] = useState<TestimonyRecord[]>([]);
  const [createdStatus, setCreatedStatus] = useState(false);

  useEffect(() => {
    setUserEntries(getUserTestimonies());
    setCreatedStatus(typeof window !== "undefined" && window.location.search.includes("created=1"));
  }, []);

  const testimonies = useMemo<TestimonyEntry[]>(
    () => [
      ...userEntries.map((entry) => ({
        ...entry,
        timeframe: formatCreatedTimeframe(entry.createdAt, entry.timeframe),
      })),
      ...featuredEntries,
    ],
    [featuredEntries, userEntries],
  );

  const answeredPrayerCount = testimonies.filter(
    (entry) => entry.type === "answered-prayer",
  ).length;
  const growthStoryCount = testimonies.filter(
    (entry) => entry.type === "growth-story",
  ).length;

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Testimony wall</p>
        <h1>Read answered prayers and stories of steady growth.</h1>
        <p className="content-lead">
          This wall is designed to make God&apos;s faithfulness visible through
          shared prayer updates, practical stories of change, and quiet
          reminders that growth often happens over time.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{answeredPrayerCount} answered prayers</span>
          <span className="content-chip">{growthStoryCount} growth stories</span>
        </div>
        <div className="content-actions">
          <Link href="/testimonies/new" className="button-primary">
            Share your testimony
          </Link>
          <Link href="/user/prayer-requests" className="button-secondary">
            Open prayer requests
          </Link>
        </div>
      </section>

      {createdStatus ? (
        <p className="share-status">
          Your testimony was added to the wall. Thank you for making answered prayer visible.
        </p>
      ) : null}

      <section className="content-grid-three">
        <article className="content-card">
          <h2 className="content-card-title">Why this matters</h2>
          <p>
            Testimonies help prayer requests move beyond a list of burdens and
            become a record of God&apos;s faithfulness over time.
          </p>
        </article>
        <article className="content-card">
          <h2 className="content-card-title">Answered prayer</h2>
          <p>
            Look back at specific requests, clearer provision, and the ways God
            met people in waiting, not only in quick outcomes.
          </p>
        </article>
        <article className="content-card">
          <h2 className="content-card-title">Growth stories</h2>
          <p>
            Not every testimony is dramatic. Some are about obedience,
            consistency, healing, and small visible change over time.
          </p>
        </article>
      </section>

      <section className="content-stack">
        {testimonies.map((entry) => (
          <article key={entry.id} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">
                {entry.type === "answered-prayer" ? "Answered prayer" : "Growth story"}
              </span>
              <span className="content-card-meta">{entry.author}</span>
              <span className="content-card-meta">{entry.timeframe}</span>
            </div>
            <h2 className="content-card-title">{entry.title}</h2>
            <p>{entry.summary}</p>
            <div className="content-card-note">
              <strong>Story</strong>
              <p>{entry.story}</p>
            </div>
            <div className="content-card-note">
              <strong>Scripture anchor</strong>
              <p>{entry.scripture}</p>
            </div>
            <div className="content-actions">
              <Link
                href={`/passage/${encodeURIComponent(entry.scripture)}`}
                className="button-secondary"
              >
                Study passage
              </Link>
              <Link href={entry.nextStep.href} className="button-primary">
                {entry.nextStep.label}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Add your own</p>
            <h2>Submit a testimony directly or start from prayer follow-up</h2>
          </div>
          <p>
            Share an answered prayer, a story of growth, or start with one of your
            saved prayer updates and turn it into a testimony someone else can read.
          </p>
          <div className="content-actions">
            <Link href="/testimonies/new" className="button-primary">
              Write a testimony
            </Link>
            <Link href="/user/prayer-requests" className="button-primary">
              Open prayer requests
            </Link>
            <Link href="/prayer-journal" className="button-secondary">
              Prayer journal
            </Link>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Community follow-up</p>
            <h2>Keep shared encouragement grounded</h2>
          </div>
          <p>
            Bring testimonies into groups, devotionals, and discussion rhythms
            so community encouragement stays connected to Scripture and prayer.
          </p>
          <div className="content-actions">
            <Link href="/groups" className="button-secondary">
              Explore groups
            </Link>
            <Link href="/social" className="button-secondary">
              Community overview
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
