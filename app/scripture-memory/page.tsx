"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getMemoryReviewQueue,
  getMemoryVerses,
  saveMemoryVerses,
} from "@/lib/client-features";

interface MemoryVerse {
  id: string;
  reference: string;
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  mastered: boolean;
  lastReviewed: string;
  reviewCount: number;
}

const verseCollections = [
  {
    name: "Faith & Trust",
    verses: [
      {
        reference: "Proverbs 3:5-6",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        category: "Faith & Trust",
        difficulty: "Medium" as const,
      },
      {
        reference: "Hebrews 11:1",
        text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
        category: "Faith & Trust",
        difficulty: "Easy" as const,
      },
      {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
        category: "Faith & Trust",
        difficulty: "Medium" as const,
      },
    ],
  },
  {
    name: "Love & Relationships",
    verses: [
      {
        reference: "John 3:16",
        text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        category: "Love & Relationships",
        difficulty: "Easy" as const,
      },
      {
        reference: "1 Corinthians 13:4-7",
        text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
        category: "Love & Relationships",
        difficulty: "Hard" as const,
      },
      {
        reference: "Ephesians 5:25",
        text: "Husbands, love your wives, just as Christ loved the church and gave himself up for her.",
        category: "Love & Relationships",
        difficulty: "Medium" as const,
      },
    ],
  },
  {
    name: "Prayer & Worship",
    verses: [
      {
        reference: "Philippians 4:6-7",
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
        category: "Prayer & Worship",
        difficulty: "Medium" as const,
      },
      {
        reference: "1 Thessalonians 5:17",
        text: "Pray without ceasing.",
        category: "Prayer & Worship",
        difficulty: "Easy" as const,
      },
      {
        reference: "Psalm 100:4",
        text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
        category: "Prayer & Worship",
        difficulty: "Easy" as const,
      },
    ],
  },
  {
    name: "Strength & Encouragement",
    verses: [
      {
        reference: "Philippians 4:13",
        text: "I can do all things through Christ who strengthens me.",
        category: "Strength & Encouragement",
        difficulty: "Easy" as const,
      },
      {
        reference: "Isaiah 40:31",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        category: "Strength & Encouragement",
        difficulty: "Medium" as const,
      },
      {
        reference: "Joshua 1:9",
        text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        category: "Strength & Encouragement",
        difficulty: "Medium" as const,
      },
    ],
  },
];

function VerseCard({
  verse,
  onMarkMastered,
  onReview,
}: {
  verse: MemoryVerse;
  onMarkMastered: (id: string) => void;
  onReview: (id: string) => void;
}) {
  const [showText, setShowText] = useState(false);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                verse.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : verse.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {verse.difficulty}
            </span>
            {verse.mastered && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                Mastered
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-blue-600">
            {verse.reference}
          </h3>
        </div>
        <div className="text-sm text-slate-500">
          Reviewed {verse.reviewCount} times
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowText(!showText)}
          className="mb-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium transition hover:bg-slate-200"
        >
          {showText ? "Hide Verse" : "Show Verse"}
        </button>
        {showText && (
          <p className="text-slate-700 italic">&ldquo;{verse.text}&rdquo;</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onReview(verse.id)}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          I Reviewed This
        </button>
        {!verse.mastered && (
          <button
            onClick={() => onMarkMastered(verse.id)}
            className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Mark as Mastered
          </button>
        )}
      </div>
    </div>
  );
}

function AddVerseForm({
  onAddVerse,
}: {
  onAddVerse: (
    verse: Omit<
      MemoryVerse,
      "id" | "mastered" | "lastReviewed" | "reviewCount"
    >,
  ) => void;
}) {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Faith & Trust");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim() && text.trim()) {
      onAddVerse({
        reference: reference.trim(),
        text: text.trim(),
        category,
        difficulty,
      });
      setReference("");
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-md"
    >
      <h3 className="mb-4 text-xl font-bold">Add Custom Verse</h3>
      <div className="mb-4">
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Reference (e.g., John 3:16)"
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Verse text..."
          rows={3}
          className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
        >
          <option value="Faith & Trust">Faith & Trust</option>
          <option value="Love & Relationships">Love & Relationships</option>
          <option value="Prayer & Worship">Prayer & Worship</option>
          <option value="Strength & Encouragement">
            Strength & Encouragement
          </option>
          <option value="Other">Other</option>
        </select>
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")
          }
          className="rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Add Verse
      </button>
    </form>
  );
}

export default function ScriptureMemory() {
  const [verses, setVerses] = useState<MemoryVerse[]>(() => {
    if (typeof window !== "undefined") {
      const saved = getMemoryVerses();
      if (saved.length > 0) {
        return saved as MemoryVerse[];
      }
    }

    const defaultVerses: MemoryVerse[] = [];
    verseCollections.forEach((collection) => {
      collection.verses.forEach((verse) => {
        defaultVerses.push({
          ...verse,
          id: `${verse.reference.replace(/\s+/g, "-").toLowerCase()}`,
          mastered: false,
          lastReviewed: "",
          reviewCount: 0,
        });
      });
    });
    return defaultVerses;
  });
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [filter, setFilter] = useState<string>("all");

  // Save verses to localStorage whenever they change
  useEffect(() => {
    saveMemoryVerses(verses);
  }, [verses]);

  const reviewQueue = useMemo(() => getMemoryReviewQueue(verses), [verses]);
  const dueVerses = useMemo(
    () => reviewQueue.filter((verse) => verse.due).slice(0, 3),
    [reviewQueue],
  );

  const addVerse = (
    verseData: Omit<
      MemoryVerse,
      "id" | "mastered" | "lastReviewed" | "reviewCount"
    >,
  ) => {
    const newVerse: MemoryVerse = {
      ...verseData,
      id: Date.now().toString(),
      mastered: false,
      lastReviewed: new Date().toISOString().split("T")[0],
      reviewCount: 0,
    };
    setVerses([...verses, newVerse]);
  };

  const markMastered = (id: string) => {
    setVerses(
      verses.map((verse) =>
        verse.id === id
          ? {
              ...verse,
              mastered: true,
              lastReviewed: new Date().toISOString().split("T")[0],
            }
          : verse,
      ),
    );
  };

  const reviewVerse = (id: string) => {
    setVerses(
      verses.map((verse) =>
        verse.id === id
          ? {
              ...verse,
              lastReviewed: new Date().toISOString().split("T")[0],
              reviewCount: verse.reviewCount + 1,
            }
          : verse,
      ),
    );
  };

  const filteredVerses = verses.filter((verse) => {
    const matchesCollection =
      selectedCollection === "all" || verse.category === selectedCollection;
    const matchesFilter =
      filter === "all" ||
      (filter === "mastered" && verse.mastered) ||
      (filter === "unmastered" && !verse.mastered) ||
      (filter === "due" && !verse.mastered && verse.reviewCount < 3);

    return matchesCollection && matchesFilter;
  });

  const stats = {
    total: verses.length,
    mastered: verses.filter((v) => v.mastered).length,
    inProgress: verses.filter((v) => !v.mastered && v.reviewCount > 0).length,
    notStarted: verses.filter((v) => v.reviewCount === 0).length,
    due: reviewQueue.filter((v) => v.due).length,
  };

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Scripture memory</p>
        <h1>Memory work that feels more focused and less like a noisy tracker.</h1>
        <p className="content-lead">
          Hide God&apos;s Word in your heart through regular memorization and
          review, with a calmer frame around the practice.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Review queue</p>
            <h2>What is ready to revisit today</h2>
          </div>
          {dueVerses.length > 0 ? (
            <div className="content-stack">
              {dueVerses.map((verse) => (
                <article key={verse.id} className="content-card-note">
                  <strong>{verse.reference}</strong>
                  <p>{verse.text}</p>
                  <p>
                    {verse.category} · reviewed {verse.reviewCount} time
                    {verse.reviewCount === 1 ? "" : "s"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="content-card-note">
              Nothing is due right now. Keep adding verses and the review queue
              will pace the repetition for you.
            </div>
          )}
          <div className="content-actions">
            <button
              type="button"
              onClick={() => setFilter("due")}
              className="button-primary"
            >
              Review due verses
            </button>
            <Link href="/dashboard" className="button-secondary">
              Open dashboard
            </Link>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Rhythm</p>
            <h2>How the queue is pacing your memory work</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>{stats.due} verses are due for review</strong>
              <p>
                Verses become due based on how often you have reviewed them, so
                repetition stays steady instead of random.
              </p>
            </div>
            <div className="content-card-note">
              <strong>{stats.inProgress} verses are actively in progress</strong>
              <p>
                Keep returning to a smaller set each day and let mastery build
                through repetition.
              </p>
            </div>
          </div>
        </section>
      </section>

      {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-slate-600">Total Verses</div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-green-600">
              {stats.mastered}
            </div>
            <div className="text-slate-600">Mastered</div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.inProgress}
            </div>
            <div className="text-slate-600">In Progress</div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-slate-600">
              {stats.notStarted}
            </div>
            <div className="text-slate-600">Not Started</div>
          </div>
          <div className="rounded-3xl bg-white p-6 text-center shadow-md">
            <div className="text-2xl font-bold text-amber-600">
              {stats.due}
            </div>
            <div className="text-slate-600">Due Today</div>
          </div>
        </div>

        {/* Add Custom Verse */}
        <div className="mb-8">
          <AddVerseForm onAddVerse={addVerse} />
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Faith & Trust">Faith & Trust</option>
                <option value="Love & Relationships">
                  Love & Relationships
                </option>
                <option value="Prayer & Worship">Prayer & Worship</option>
                <option value="Strength & Encouragement">
                  Strength & Encouragement
                </option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                aria-label="Show all verses"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Verses
              </button>
              <button
                onClick={() => setFilter("unmastered")}
                aria-label="Show learning verses"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "unmastered"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Learning
              </button>
              <button
                onClick={() => setFilter("mastered")}
                aria-label="Show mastered verses"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "mastered"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Mastered
              </button>
              <button
                onClick={() => setFilter("due")}
                aria-label="Show verses needing review"
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  filter === "due"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Need Review
              </button>
            </div>
          </div>
        </div>

        {/* Verses */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVerses.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              onMarkMastered={markMastered}
              onReview={reviewVerse}
            />
          ))}
        </div>

        {filteredVerses.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-md">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="mb-2 text-xl font-bold">No verses found</h3>
            <p className="text-slate-600">
              Try adjusting your filters or add some custom verses above.
            </p>
          </div>
        )}
    </main>
  );
}
