"use client";

import { useState } from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Christian Study Guide
          </Link>
          <div className="flex flex-wrap gap-4 md:gap-6">
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
              href="/reading-plans"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Reading Plans
            </Link>
            <Link
              href="/prayer-journal"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Prayer Journal
            </Link>
            <Link
              href="/devotionals"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Devotionals
            </Link>
            <Link
              href="/scripture-memory"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Memory
            </Link>
            <Link
              href="/resources"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Resources
            </Link>
            <Link
              href="/auth/register"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Register
            </Link>
            <Link
              href="/user/profile"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              My Profile
            </Link>
            <Link
              href="/user/bookmarks"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              My Bookmarks
            </Link>
            <Link
              href="/user/prayer-requests"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Prayer Requests
            </Link>
            <Link
              href="/user/verse-generator"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Share Verse
            </Link>
            <Link
              href="/admin/analytics"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Admin Analytics
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const verses = [
  {
    text: "Your word is a lamp to my feet and a light to my path.",
    reference: "Psalm 119:105",
  },
  {
    text: "Trust in the Lord with all your heart and do not lean on your own understanding.",
    reference: "Proverbs 3:5",
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
  },
];

function HeroSection({
  currentVerse,
  nextVerse,
}: {
  currentVerse: { text: string; reference: string };
  nextVerse: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Christian Study Guide
          </p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Grow in God’s Word with a simple Christian study website
          </h1>
          <p className="mb-6 max-w-xl text-lg text-slate-600">
            Read Scripture, explore study topics, reflect on verses, and keep
            track of your prayer life in one clean place.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-700">
              Start Studying
            </button>
            <button className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100">
              View Topics
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="mb-4 rounded-2xl bg-slate-100 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Verse of the Day</h2>
                <p className="mt-3 text-slate-700">“{currentVerse.text}”</p>
                <p className="mt-2 font-semibold text-blue-700">
                  {currentVerse.reference}
                </p>
              </div>
              <button
                onClick={nextVerse}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                New Verse
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-4">
            <h3 className="text-lg font-bold">Today’s Study Focus</h3>
            <ul className="mt-3 space-y-2 text-slate-700">
              <li>Read John 1</li>
              <li>Reflect on God’s grace</li>
              <li>Write one prayer request</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function FeaturesSection({
  features,
}: {
  features: { title: string; description: string }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-8 text-center text-3xl font-bold">Main Features</h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

function TopicsSection({
  topics,
  selectedTopic,
  setSelectedTopic,
}: {
  topics: string[];
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
}) {
  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(selectedTopic.toLowerCase()),
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Popular Study Topics</h2>
            <p className="text-sm text-slate-300">
              This section teaches React state. As you type, the UI updates
              instantly.
            </p>
          </div>

          <input
            type="text"
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            placeholder="Search topics"
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-300 md:max-w-xs"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium"
              >
                {topic}
              </span>
            ))
          ) : (
            <p className="text-slate-300">No topics match your search.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function PrayerJournalSection({
  prayerEntry,
  setPrayerEntry,
  savedPrayer,
  savePrayer,
}: {
  prayerEntry: string;
  setPrayerEntry: (entry: string) => void;
  savedPrayer: string;
  savePrayer: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Prayer Journal</h2>
          <p className="mb-4 text-slate-600">
            This section teaches controlled inputs in React. What you type is
            stored in state.
          </p>
          <textarea
            value={prayerEntry}
            onChange={(event) => setPrayerEntry(event.target.value)}
            placeholder="Write your prayer here"
            className="min-h-[180px] w-full rounded-2xl border border-slate-200 p-4 text-slate-700 outline-none"
          />
          <button
            onClick={savePrayer}
            className="mt-4 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Save Prayer
          </button>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Saved Prayer</h2>
          <p className="text-slate-600">
            {savedPrayer ||
              "No prayer saved yet. Type in the journal and click save."}
          </p>
        </div>
      </div>
    </section>
  );
}

function LearnReactSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">
            Why this is built with React
          </h2>
          <p className="text-slate-600">
            React lets us break the page into reusable pieces, like cards,
            buttons, and topic tags. That makes the website easier to grow
            later.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">
            Why this works well in Next.js
          </h2>
          <p className="text-slate-600">
            Next.js uses React and makes it easier to organize pages, improve
            performance, and turn a React app into a full website.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center text-slate-500">
        © 2026 Christian Study Guide. Built with Next.js and React.
      </div>
    </footer>
  );
}

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [verseIndex, setVerseIndex] = useState(0);
  const [prayerEntry, setPrayerEntry] = useState("");
  const [savedPrayer, setSavedPrayer] = useState("");
  const features = [
    {
      title: "Bible Reading Plans",
      description:
        "Follow simple daily reading plans that help you stay consistent in Scripture.",
    },
    {
      title: "Verse of the Day",
      description:
        "See a featured Bible verse to encourage reflection, prayer, and study.",
    },
    {
      title: "Study Topics",
      description:
        "Browse Christian topics like faith, prayer, grace, salvation, and spiritual growth.",
    },
    {
      title: "Prayer Journal",
      description:
        "Write down prayer requests, answered prayers, and notes from your devotional time.",
    },
  ];

  const topics = [
    "Faith",
    "Prayer",
    "Salvation",
    "Grace",
    "Forgiveness",
    "Spiritual Warfare",
  ];

  const currentVerse = verses[verseIndex];

  function nextVerse() {
    setVerseIndex((previousIndex) => (previousIndex + 1) % verses.length);
  }

  function savePrayer() {
    setSavedPrayer(prayerEntry);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <HeroSection currentVerse={currentVerse} nextVerse={nextVerse} />
      <FeaturesSection features={features} />
      <TopicsSection
        topics={topics}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />
      <PrayerJournalSection
        prayerEntry={prayerEntry}
        setPrayerEntry={setPrayerEntry}
        savedPrayer={savedPrayer}
        savePrayer={savePrayer}
      />
      <LearnReactSection />
      <Footer />
    </main>
  );
}
