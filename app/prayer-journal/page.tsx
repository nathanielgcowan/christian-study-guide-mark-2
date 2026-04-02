"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PrayerEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: string;
  answered: boolean;
  answeredDate?: string;
}

type PrayerDraft = {
  title: string;
  content: string;
  category: string;
};

const PRAYER_JOURNAL_DRAFT_KEY = "csg-prayer-journal-draft";

const categories = [
  "Praise & Worship",
  "Thanksgiving",
  "Confession",
  "Petition",
  "Intercession",
  "Guidance",
  "Personal Growth",
  "Family & Friends",
  "Church & Community",
  "World & Nations",
];

function PrayerEntryForm({
  onAddEntry,
  initialDraft,
  onDraftChange,
}: {
  onAddEntry: (entry: Omit<PrayerEntry, "id">) => void;
  initialDraft: PrayerDraft | null;
  onDraftChange: (draft: PrayerDraft) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);

  useEffect(() => {
    if (!initialDraft) return;
    setTitle(initialDraft.title ?? "");
    setContent(initialDraft.content ?? "");
    setCategory(initialDraft.category ?? categories[0]);
  }, [initialDraft]);

  useEffect(() => {
    onDraftChange({ title, content, category });
  }, [category, content, onDraftChange, title]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }

    onAddEntry({
      date: new Date().toISOString().split("T")[0],
      title: title.trim(),
      content: content.trim(),
      category,
      answered: false,
    });
    setTitle("");
    setContent("");
    setCategory(categories[0]);
    onDraftChange({
      title: "",
      content: "",
      category: categories[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="prayer-journal-card prayer-journal-form">
      <h3>Add New Prayer</h3>
      <div className="prayer-journal-stack">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Prayer title..."
          className="minimal-input"
          required
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="minimal-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your prayer here..."
          rows={6}
          className="minimal-textarea prayer-journal-textarea"
          required
        />
      </div>
      <button type="submit" className="button-primary">
        Add Prayer
      </button>
    </form>
  );
}

function PrayerEntryCard({
  entry,
  onMarkAnswered,
}: {
  entry: PrayerEntry;
  onMarkAnswered: (id: string) => void;
}) {
  return (
    <article
      className={`prayer-journal-card prayer-entry-card ${entry.answered ? "prayer-entry-card-answered" : ""}`}
    >
      <div className="prayer-entry-header">
        <div>
          <h4>{entry.title}</h4>
          <div className="prayer-entry-meta">
            <span>{new Date(entry.date).toLocaleDateString()}</span>
            <span>{entry.category}</span>
            {entry.answered && entry.answeredDate ? (
              <span className="prayer-entry-answered">
                Answered {new Date(entry.answeredDate).toLocaleDateString()}
              </span>
            ) : null}
          </div>
        </div>
        {!entry.answered ? (
          <button
            type="button"
            onClick={() => onMarkAnswered(entry.id)}
            className="button-secondary"
          >
            Mark Answered
          </button>
        ) : null}
      </div>
      <p className="prayer-entry-content">{entry.content}</p>
    </article>
  );
}

export default function PrayerJournal() {
  const [entries, setEntries] = useState<PrayerEntry[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = localStorage.getItem("prayerJournal");
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as PrayerEntry[];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [draft, setDraft] = useState<PrayerDraft | null>(null);
  const [draftStatus, setDraftStatus] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("prayerJournal", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(PRAYER_JOURNAL_DRAFT_KEY);
      if (!savedDraft) return;
      const parsed = JSON.parse(savedDraft) as Partial<PrayerDraft>;
      setDraft({
        title: parsed.title ?? "",
        content: parsed.content ?? "",
        category: parsed.category ?? categories[0],
      });

      if (parsed.title || parsed.content) {
        setDraftStatus("Unfinished prayer draft restored.");
      }
    } catch {
      // Ignore malformed draft data and keep defaults.
    }
  }, []);

  function handleDraftChange(nextDraft: PrayerDraft) {
    setDraft(nextDraft);

    const hasDraft = Boolean(nextDraft.title.trim() || nextDraft.content.trim());
    if (!hasDraft) {
      localStorage.removeItem(PRAYER_JOURNAL_DRAFT_KEY);
      return;
    }

    localStorage.setItem(PRAYER_JOURNAL_DRAFT_KEY, JSON.stringify(nextDraft));
  }

  const addEntry = (entryData: Omit<PrayerEntry, "id">) => {
    const newEntry: PrayerEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    setEntries([newEntry, ...entries]);
    localStorage.removeItem(PRAYER_JOURNAL_DRAFT_KEY);
    setDraftStatus("Prayer entry saved.");
  };

  const markAnswered = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              answered: true,
              answeredDate: new Date().toISOString().split("T")[0],
            }
          : entry,
      ),
    );
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "answered" && entry.answered) ||
      (filter === "unanswered" && !entry.answered) ||
      entry.category === filter;

    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: entries.length,
    answered: entries.filter((entry) => entry.answered).length,
    unanswered: entries.filter((entry) => !entry.answered).length,
  };

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero prayer-journal-hero">
        <p className="eyebrow">Prayer journal</p>
        <h1>A quieter space for prayers, requests, and answered mercies.</h1>
        <p className="content-lead">
          Record your prayers, track answers, and return to what God has done
          with a calmer layout around the journal itself.
        </p>
        <div className="content-actions">
          <Link href="/exports" className="button-secondary">
            Export prayers and study data
          </Link>
        </div>
      </section>

      <section className="prayer-journal-stats">
        <article className="prayer-journal-stat">
          <strong>{stats.total}</strong>
          <span>Total Prayers</span>
        </article>
        <article className="prayer-journal-stat prayer-journal-stat-answered">
          <strong>{stats.answered}</strong>
          <span>Answered</span>
        </article>
        <article className="prayer-journal-stat prayer-journal-stat-waiting">
          <strong>{stats.unanswered}</strong>
          <span>Awaiting Answer</span>
        </article>
      </section>

      <section className="prayer-journal-layout">
        <div>
          <PrayerEntryForm
            onAddEntry={addEntry}
            initialDraft={draft}
            onDraftChange={handleDraftChange}
          />
          <p className="content-card-meta">Drafts auto-save in this browser while you write.</p>
          {draftStatus ? <p className="share-status">{draftStatus}</p> : null}
        </div>

        <div className="prayer-journal-stack">
          <section className="prayer-journal-card prayer-journal-toolbar">
            <div className="prayer-journal-toolbar-row">
              <div className="prayer-journal-filter-row">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`prayer-journal-filter ${filter === "all" ? "prayer-journal-filter-active" : ""}`}
                >
                  All Prayers
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("unanswered")}
                  className={`prayer-journal-filter ${filter === "unanswered" ? "prayer-journal-filter-active" : ""}`}
                >
                  Unanswered
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("answered")}
                  className={`prayer-journal-filter ${filter === "answered" ? "prayer-journal-filter-active" : ""}`}
                >
                  Answered
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFilter(category)}
                    className={`prayer-journal-filter ${filter === category ? "prayer-journal-filter-active" : ""}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search prayers..."
                className="minimal-input prayer-journal-search"
              />
            </div>
          </section>

          <section className="prayer-journal-stack">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <PrayerEntryCard
                  key={entry.id}
                  entry={entry}
                  onMarkAnswered={markAnswered}
                />
              ))
            ) : (
              <div className="prayer-journal-card prayer-journal-empty">
                <div className="prayer-journal-empty-mark">Amen</div>
                <h3>No prayers found</h3>
                <p>
                  {entries.length === 0
                    ? "Start your prayer journey by adding your first prayer above."
                    : "Try adjusting your filters or search terms."}
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
