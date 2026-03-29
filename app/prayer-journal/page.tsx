"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Christian Study Guide
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Blog
            </Link>
            <Link
              href="/prayer-journal"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Prayer Journal
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

interface PrayerEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: string;
  answered: boolean;
  answeredDate?: string;
}

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
}: {
  onAddEntry: (entry: Omit<PrayerEntry, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddEntry({
        date: new Date().toISOString().split("T")[0],
        title: title.trim(),
        content: content.trim(),
        category,
        answered: false,
      });
      setTitle("");
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-md"
    >
      <h3 className="mb-4 text-xl font-bold">Add New Prayer</h3>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Prayer title..."
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your prayer here..."
          rows={6}
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
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
    <div
      className={`rounded-3xl p-6 shadow-md ${entry.answered ? "bg-green-50 border border-green-200" : "bg-white"}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-semibold">{entry.title}</h4>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>📅 {new Date(entry.date).toLocaleDateString()}</span>
            <span>🏷️ {entry.category}</span>
            {entry.answered && entry.answeredDate && (
              <span className="text-green-600">
                ✅ Answered {new Date(entry.answeredDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {!entry.answered && (
          <button
            onClick={() => onMarkAnswered(entry.id)}
            className="rounded-xl bg-green-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Mark Answered
          </button>
        )}
      </div>
      <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
    </div>
  );
}

export default function PrayerJournal() {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("prayerJournal");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("prayerJournal", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entryData: Omit<PrayerEntry, "id">) => {
    const newEntry: PrayerEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    setEntries([newEntry, ...entries]);
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
    answered: entries.filter((e) => e.answered).length,
    unanswered: entries.filter((e) => !e.answered).length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Prayer Journal
          </h1>
          <p className="text-lg text-slate-600">
            Record your prayers, track answers, and grow in your prayer life.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-slate-600">Total Prayers</div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-green-600">
              {stats.answered}
            </div>
            <div className="text-slate-600">Answered</div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-orange-600">
              {stats.unanswered}
            </div>
            <div className="text-slate-600">Awaiting Answer</div>
          </div>
        </div>

        {/* Add New Prayer */}
        <div className="mb-8">
          <PrayerEntryForm onAddEntry={addEntry} />
        </div>

        {/* Filters and Search */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                aria-label="Show all prayers"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Prayers
              </button>
              <button
                onClick={() => setFilter("unanswered")}
                aria-label="Show unanswered prayers"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "unanswered"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Unanswered
              </button>
              <button
                onClick={() => setFilter("answered")}
                aria-label="Show answered prayers"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "answered"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Answered
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`rounded-xl px-4 py-2 font-medium transition ${
                    filter === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prayers..."
              className="rounded-2xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Prayer Entries */}
        <div className="space-y-6">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <PrayerEntryCard
                key={entry.id}
                entry={entry}
                onMarkAnswered={markAnswered}
              />
            ))
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center shadow-md">
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="mb-2 text-xl font-bold">No prayers found</h3>
              <p className="text-slate-600">
                {entries.length === 0
                  ? "Start your prayer journey by adding your first prayer above."
                  : "Try adjusting your filters or search terms."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
