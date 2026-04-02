"use client";

import { useState } from "react";
import Link from "next/link";
import { devotionals, Devotional } from "@/lib/devotionals";

import dynamic from "next/dynamic";
const SocialShare = dynamic(() => import("../../components/SocialShare"), {
  ssr: false,
});

function DevotionalCard({
  devotional,
  isToday = false,
}: {
  devotional: Devotional;
  isToday?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(isToday);

  return (
    <article
      className={`devotional-card ${isToday ? "devotional-card-featured" : ""}`}
    >
      {isToday && (
        <div className="devotional-pill">
          Today&apos;s Devotional
        </div>
      )}

      <div className="devotional-card-header">
        <div className="devotional-date">
          {new Date(devotional.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h2>{devotional.title}</h2>

        <div className="devotional-verse-block">
          <blockquote className="devotional-verse">
            &ldquo;{devotional.verse.text}&rdquo;
          </blockquote>
          <cite className="devotional-citation">
            — {devotional.verse.reference}
          </cite>
          <div className="devotional-share">
            <SocialShare
              text={`Read today's devotional: ${devotional.title}`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="devotional-content">
          <section className="devotional-section">
            <h3>Devotional</h3>
            <div className="devotional-prose">
              {devotional.content
                .split("\n")
                .map(
                  (paragraph, index) =>
                    paragraph.trim() && <p key={index}>{paragraph.trim()}</p>,
                )}
            </div>
          </section>

          <section className="devotional-section">
            <h3>Reflection Questions</h3>
            <ul className="devotional-reflection-list">
              {devotional.reflection.map((question, index) => (
                <li key={index}>
                  <span className="devotional-reflection-mark">{index + 1}</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="devotional-section">
            <h3>Prayer</h3>
            <div className="devotional-prayer">{devotional.prayer}</div>
          </section>
        </div>
      )}

      <div className="devotional-actions">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="button-primary"
        >
          {isExpanded ? "Collapse" : "Read Devotional"}
        </button>
      </div>
    </article>
  );
}

export default function Devotionals() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const todayDevotional = devotionals.find((d) => d.date === selectedDate);
  const otherDevotionals = devotionals.filter((d) => d.date !== selectedDate);

  return (
    <main id="main-content" className="page-shell devotional-shell">
      <section className="devotional-hero">
        <p className="eyebrow">Daily reading and reflection</p>
        <h1>Daily devotionals designed to be easier to read slowly.</h1>
        <p className="devotional-lead">
            Start your day with Scripture, reflection, and prayer to grow in
            your relationship with God.
        </p>

        <div className="devotional-toolbar">
          <div className="devotional-picker">
            <label htmlFor="devotional-date" className="minimal-label">
              Select a date
            </label>
            <input
              id="devotional-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="minimal-input"
            />
          </div>

          <div className="devotional-toolbar-actions">
            <Link href="/reading-plans" className="button-secondary">
              Reading plans
            </Link>
            <Link href="/prayer-journal" className="button-secondary">
              Prayer journal
            </Link>
          </div>
        </div>
      </section>

      {todayDevotional ? (
        <section className="devotional-stack">
          <DevotionalCard devotional={todayDevotional} isToday={true} />
        </section>
      ) : (
        <section className="devotional-empty">
          <div className="devotional-empty-mark">Read</div>
          <h2>No devotional for this date</h2>
          <p>
            Check back later for new devotionals, or select a different date.
          </p>
        </section>
      )}

      {otherDevotionals.length > 0 && (
        <section className="devotional-list-section">
          <div className="section-heading">
            <p className="eyebrow">Archive</p>
            <h2>Recent devotionals</h2>
            <p>
              Browse past entries in the same reading-focused format, with
              space for Scripture, reflection, and prayer.
            </p>
          </div>
          <div className="devotional-stack">
            {otherDevotionals.map((devotional) => (
              <DevotionalCard key={devotional.id} devotional={devotional} />
            ))}
          </div>
        </section>
      )}

      <section className="devotional-subscribe">
        <div>
          <p className="eyebrow">Keep the rhythm going</p>
          <h2>Get daily devotionals by email</h2>
          <p>
            Subscribe to receive these devotionals directly in your inbox each
            morning.
          </p>
        </div>
        <div className="devotional-subscribe-form">
          <label htmlFor="devotional-email" className="sr-only">
            Email address
          </label>
          <input
            id="devotional-email"
            type="email"
            placeholder="Enter your email"
            className="minimal-input"
          />
          <button className="button-primary">Subscribe</button>
        </div>
      </section>
    </main>
  );
}
