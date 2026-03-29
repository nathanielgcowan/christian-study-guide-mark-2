"use client";

import { useState, useEffect } from "react";
import { getPassage, BiblePassageVerse } from "../../lib/bible";
import Link from "next/link";

import dynamic from "next/dynamic";
const SocialShare = dynamic(() => import("../../components/SocialShare"), {
  ssr: false,
});

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
              href="/devotionals"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Devotionals
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

interface Devotional {
  id: string;
  date: string;
  title: string;
  verse: {
    text: string;
    reference: string;
  };
  content: string;
  reflection: string[];
  prayer: string;
}

const devotionals: Devotional[] = [
  {
    id: "faith-in-action",
    date: "2026-03-28",
    title: "Faith in Action",
    verse: {
      text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
      reference: "Hebrews 11:1",
    },
    content: `
Faith is not just intellectual assent to certain truths—it's a living, active trust in God that affects every area of our lives. The Bible tells us that "without faith it is impossible to please God" (Hebrews 11:6), because faith demonstrates our trust in His character and promises.

True faith moves us to action. When we believe God's promises, we step out in obedience, even when the path ahead seems uncertain. Abraham demonstrated this when he left his homeland for an unknown destination, trusting God's guidance. Noah built an ark in faith, even when it seemed foolish to others.

Today, consider where God is calling you to step out in faith. Is there an area of your life where you're holding back because of fear or uncertainty? Remember that God's faithfulness has been proven throughout history, and He will be faithful to you as well.
    `,
    reflection: [
      "What is one area of your life where God is calling you to step out in faith?",
      "How has God proven His faithfulness to you in the past?",
      "What fears are holding you back from obeying God's leading?",
    ],
    prayer:
      "Lord, increase my faith. Help me to trust You completely and step out in obedience to Your calling. Remove the fears that hold me back and fill me with confidence in Your promises. Amen.",
  },
  {
    id: "gods-love",
    date: "2026-03-29",
    title: "The Depth of God's Love",
    verse: {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16",
    },
    content: `
God's love is not like human love. It's not based on our performance, appearance, or worthiness. God's love is unconditional, sacrificial, and eternal. He loved us while we were still sinners, rebelling against Him (Romans 5:8).

This love moved God to send His only Son to die for our sins, offering us forgiveness and reconciliation. Jesus demonstrated this love by laying down His life for us, His friends (John 15:13).

Understanding God's love changes everything. It frees us from the need to earn His approval and allows us to love others with the same selfless love we've received. When we grasp how deeply God loves us, we find security, purpose, and joy.
    `,
    reflection: [
      "How does knowing God's unconditional love change your daily life?",
      "In what ways do you struggle to accept God's love for you?",
      "How can you extend God's love to others today?",
    ],
    prayer:
      "Father, thank You for Your incredible love. Help me to fully accept and embrace Your love for me. Teach me to love others with the same selfless love You've shown me. Amen.",
  },
  {
    id: "prayer-life",
    date: "2026-03-30",
    title: "Developing a Prayer Life",
    verse: {
      text: "Pray without ceasing.",
      reference: "1 Thessalonians 5:17",
    },
    content: `
Prayer is our direct line of communication with God. It's not about using fancy words or following a specific formula—it's about having an honest conversation with our Heavenly Father. Jesus modeled this for us, often withdrawing to pray and teaching His disciples to pray.

A consistent prayer life develops our relationship with God, aligns our will with His, and invites His power into our circumstances. It includes adoration (praising God), confession (admitting sin), thanksgiving (expressing gratitude), and supplication (making requests).

Start small if you need to. Set aside a specific time each day, find a quiet place, and begin with simple prayers. God delights in hearing from His children, no matter how simple or eloquent our words.
    `,
    reflection: [
      "What does your current prayer life look like?",
      "What barriers keep you from praying more consistently?",
      "How can you make prayer a more natural part of your day?",
    ],
    prayer:
      "Lord, teach me to pray. Help me to develop a consistent prayer life and to experience the joy of communicating with You. Draw me closer to Your heart. Amen.",
  },
  {
    id: "holy-spirit",
    date: "2026-03-31",
    title: "The Holy Spirit's Work in Us",
    verse: {
      text: "And I will ask the Father, and he will give you another advocate to help you and be with you forever.",
      reference: "John 14:16",
    },
    content: `
The Holy Spirit is not just a theological concept—He's a Person who lives within every believer. Jesus promised that after His departure, the Father would send the Holy Spirit to be our Helper, Teacher, and Guide.

The Spirit convicts us of sin, leads us to salvation, indwells us at conversion, and empowers us for service. He produces spiritual fruit in our lives (love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control) and distributes spiritual gifts for building up the church.

Learning to walk in the Spirit means yielding to His leading, obeying His promptings, and allowing Him to transform us into Christ's image. The Spirit's presence is God's guarantee that we belong to Him and that He will complete the work He began in us.
    `,
    reflection: [
      "How have you experienced the Holy Spirit's work in your life?",
      "What spiritual fruit is the Holy Spirit developing in you right now?",
      "How can you be more sensitive to the Spirit's leading?",
    ],
    prayer:
      "Holy Spirit, fill me afresh today. Help me to be aware of Your presence and responsive to Your leading. Produce Your fruit in my life and use me for Your purposes. Amen.",
  },
  {
    id: "gods-word",
    date: "2026-04-01",
    title: "The Power of God's Word",
    verse: {
      text: "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.",
      reference: "Hebrews 4:12",
    },
    content: `
The Bible is not just an ancient book—it's living and active, sharper than any two-edged sword. God's Word has the power to penetrate our deepest thoughts and motivations, revealing truth and bringing transformation.

Regular engagement with Scripture changes us. It renews our minds (Romans 12:2), guides our decisions, strengthens our faith, and equips us for every good work (2 Timothy 3:16-17). The psalmist described God's Word as a lamp to guide our feet and a light for our path (Psalm 119:105).

Make Bible reading a daily habit. Approach it with an open heart, asking the Holy Spirit to illuminate the truth and apply it to your life. God's Word is your spiritual nourishment—don't neglect it.
    `,
    reflection: [
      "How has God's Word impacted your life recently?",
      "What is your current Bible reading habit?",
      "How can you make Scripture study more meaningful?",
    ],
    prayer:
      "Lord, help me to love Your Word and apply it to my life. Open my eyes to see wonderful things in Your law. Let Your Word be a lamp to my feet and a light to my path. Amen.",
  },
];

function DevotionalCard({
  devotional,
  isToday = false,
}: {
  devotional: Devotional;
  isToday?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(isToday);
  const [passage, setPassage] = useState<BiblePassageVerse[] | null>(null);
  const [loadingPassage, setLoadingPassage] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoadingPassage(true);
    getPassage(devotional.verse.reference).then((result) => {
      if (!ignore) {
        setPassage(result);
        setLoadingPassage(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, [devotional.verse.reference]);

  return (
    <div
      className={`rounded-3xl p-8 shadow-md ${isToday ? "bg-blue-50 border-2 border-blue-200" : "bg-white"}`}
    >
      {isToday && (
        <div className="mb-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Today's Devotional
        </div>
      )}

      <div className="mb-6">
        <div className="mb-2 text-sm text-slate-500">
          {new Date(devotional.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h2 className="mb-4 text-2xl font-bold">{devotional.title}</h2>

        <div className="mb-6 rounded-2xl bg-slate-50 p-4">
          {loadingPassage ? (
            <div className="text-slate-400 italic">Loading passage...</div>
          ) : passage && passage.length > 0 ? (
            <blockquote className="text-lg italic text-slate-700 space-y-1">
              {passage.map((v) => (
                <span key={v.number} className="block">
                  <span className="font-bold text-blue-700 mr-1">
                    {v.number}
                  </span>
                  {v.text}
                </span>
              ))}
            </blockquote>
          ) : (
            <blockquote className="text-lg italic text-slate-700">
              "{devotional.verse.text}"
            </blockquote>
          )}
          <cite className="mt-2 block text-right font-semibold text-blue-600">
            — {devotional.verse.reference}
          </cite>
          <div className="mt-4 flex justify-end">
            <SocialShare
              text={`Read today's devotional: ${devotional.title}`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Devotional</h3>
            <div className="prose prose-lg max-w-none text-slate-700">
              {devotional.content
                .split("\n")
                .map(
                  (paragraph, index) =>
                    paragraph.trim() && <p key={index}>{paragraph.trim()}</p>,
                )}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Reflection Questions</h3>
            <ul className="space-y-2">
              {devotional.reflection.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-blue-600">💭</span>
                  <span className="text-slate-700">{question}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Prayer</h3>
            <div className="rounded-2xl bg-slate-50 p-4 italic text-slate-700">
              {devotional.prayer}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          {isExpanded ? "Collapse" : "Read Devotional"}
        </button>
      </div>
    </div>
  );
}

export default function Devotionals() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const todayDevotional = devotionals.find((d) => d.date === selectedDate);
  const otherDevotionals = devotionals.filter((d) => d.date !== selectedDate);

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Daily Devotionals
          </h1>
          <p className="text-lg text-slate-600">
            Start your day with Scripture, reflection, and prayer to grow in
            your relationship with God.
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Select Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Today's Devotional */}
        {todayDevotional ? (
          <div className="mb-12">
            <DevotionalCard devotional={todayDevotional} isToday={true} />
          </div>
        ) : (
          <div className="mb-12 rounded-3xl bg-white p-12 text-center shadow-md">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="mb-2 text-xl font-bold">
              No devotional for this date
            </h3>
            <p className="text-slate-600">
              Check back later for new devotionals, or select a different date.
            </p>
          </div>
        )}

        {/* Other Devotionals */}
        {otherDevotionals.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Recent Devotionals</h2>
            <div className="space-y-6">
              {otherDevotionals.map((devotional) => (
                <DevotionalCard key={devotional.id} devotional={devotional} />
              ))}
            </div>
          </div>
        )}

        {/* Subscription CTA */}
        <div className="mt-12 rounded-3xl bg-blue-600 p-8 text-center text-white shadow-md">
          <h3 className="mb-4 text-2xl font-bold">
            Get Daily Devotionals by Email
          </h3>
          <p className="mb-6 text-blue-100">
            Subscribe to receive these devotionals directly in your inbox each
            morning.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-2xl px-4 py-3 text-slate-900 outline-none sm:min-w-64"
            />
            <button className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
