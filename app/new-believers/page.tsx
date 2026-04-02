import Link from "next/link";
import type { Metadata } from "next";
import { BookOpenText, HeartHandshake, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "New Believers Discipleship Program",
  description:
    "A structured discipleship path for new believers with weekly readings, prayer focus, memory verses, and simple next steps.",
};

const weeks = [
  {
    week: 1,
    title: "The Gospel and New Life in Christ",
    aim: "Understand who Jesus is, what the gospel means, and what it means to begin following Him.",
    reading: ["John 1", "John 3", "Ephesians 2", "2 Corinthians 5"],
    memoryVerse: "2 Corinthians 5:17",
    prayerFocus: "Thank God for salvation, new life, and forgiveness in Christ.",
    practice: "Write your testimony in a few simple sentences and save one key verse.",
  },
  {
    week: 2,
    title: "The Bible and Learning to Hear God",
    aim: "Build confidence in opening Scripture daily and responding to what it says.",
    reading: ["Psalm 119", "2 Timothy 3", "James 1", "Luke 24"],
    memoryVerse: "Psalm 119:105",
    prayerFocus: "Ask God for understanding, hunger for His Word, and consistency.",
    practice: "Read one chapter a day and write one observation in your journal.",
  },
  {
    week: 3,
    title: "Prayer and Communion with God",
    aim: "Learn to pray with honesty, trust, thanksgiving, and growing dependence.",
    reading: ["Matthew 6", "Luke 11", "Philippians 4", "Psalm 63"],
    memoryVerse: "Philippians 4:6-7",
    prayerFocus: "Bring worries, worship, confession, and thanksgiving to God each day.",
    practice: "Keep one prayer request and one answered prayer visible this week.",
  },
  {
    week: 4,
    title: "Church, Community, and Baptism",
    aim: "See why Christian growth is meant to happen with other believers, not in isolation.",
    reading: ["Acts 2", "Hebrews 10", "1 Corinthians 12", "Romans 6"],
    memoryVerse: "Hebrews 10:24-25",
    prayerFocus: "Pray for healthy church connection, courage, and teachable relationships.",
    practice: "Join a group, attend church intentionally, or ask about baptism.",
  },
  {
    week: 5,
    title: "Obedience, Holiness, and Daily Growth",
    aim: "Understand that following Jesus reshapes desires, habits, and practical obedience.",
    reading: ["John 15", "Romans 12", "Galatians 5", "1 Peter 1"],
    memoryVerse: "John 15:5",
    prayerFocus: "Ask for fruitfulness, repentance, and a deeper love for what pleases God.",
    practice: "Choose one habit to start or one sin pattern to confront prayerfully.",
  },
  {
    week: 6,
    title: "Witness, Mission, and Staying Steady",
    aim: "Finish by seeing that discipleship includes sharing Christ and continuing faithfully.",
    reading: ["Matthew 28", "Acts 1", "Colossians 4", "1 Thessalonians 5"],
    memoryVerse: "Matthew 28:19-20",
    prayerFocus: "Pray for boldness, steadiness, and love for people who need Christ.",
    practice: "Share one part of what God has done in your life with someone else.",
  },
];

const nextSteps = [
  {
    title: "Start with the Bible reader",
    body: "Read the weekly passages chapter by chapter and stay in the text.",
    href: "/bible",
  },
  {
    title: "Use topic studies for struggles",
    body: "Open focused pathways when anxiety, prayer, identity, or forgiveness need more attention.",
    href: "/topics",
  },
  {
    title: "Find a group",
    body: "Grow with other believers through shared prayer and discussion.",
    href: "/groups",
  },
  {
    title: "Track prayer and study",
    body: "Use your dashboard, prayer requests, and study sessions to stay consistent.",
    href: "/dashboard",
  },
];

export default function NewBelieversPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Discipleship program</p>
        <h1>A 6-week discipleship program for new believers in the faith.</h1>
        <p className="content-lead">
          This pathway gives new Christians a simple starting structure for Scripture,
          prayer, church life, obedience, and early spiritual growth without making
          the first steps feel overwhelming.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">
            <BookOpenText size={14} />
            6 guided weeks
          </span>
          <span className="content-chip">
            <HeartHandshake size={14} />
            Reading, prayer, memory, and practice
          </span>
          <span className="content-chip">
            <Sparkles size={14} />
            Built for steady foundations
          </span>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Program length</span>
          <strong>6 weeks</strong>
        </article>
        <article className="content-stat">
          <span>Weekly pattern</span>
          <strong>Read, pray, respond</strong>
        </article>
        <article className="content-stat">
          <span>Best for</span>
          <strong>New believers</strong>
        </article>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">How it works</p>
          <h2>A simpler discipleship rhythm for the first season of faith</h2>
          <p>
            Each week includes a main aim, a short reading path, one memory verse,
            a prayer focus, and one practice step. The goal is not information alone,
            but helping truth move into worship, obedience, and community.
          </p>
        </div>
      </section>

      <section className="content-stack">
        {weeks.map((entry) => (
          <article key={entry.week} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">Week {entry.week}</span>
              <span className="content-card-meta">{entry.memoryVerse}</span>
            </div>
            <h2 className="content-card-title">{entry.title}</h2>
            <p>{entry.aim}</p>
            <section className="content-grid-two">
              <div className="content-card-note">
                <strong>Reading</strong>
                <p>{entry.reading.join(" · ")}</p>
              </div>
              <div className="content-card-note">
                <strong>Prayer focus</strong>
                <p>{entry.prayerFocus}</p>
              </div>
              <div className="content-card-note">
                <strong>Memory verse</strong>
                <p>{entry.memoryVerse}</p>
              </div>
              <div className="content-card-note">
                <strong>Practice</strong>
                <p>{entry.practice}</p>
              </div>
            </section>
            <div className="content-actions">
              <Link
                href={`/passage/${encodeURIComponent(entry.reading[0])}`}
                className="button-primary"
              >
                Open first reading
              </Link>
              <Link href="/scripture-memory" className="button-secondary">
                Review memory verse
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Keep going</p>
          <h2>Use the rest of the platform around the program</h2>
        </div>
        <div className="content-grid-two">
          {nextSteps.map((step) => (
            <article key={step.title} className="content-card">
              <h3 className="content-card-title">{step.title}</h3>
              <p>{step.body}</p>
              <Link href={step.href} className="button-secondary">
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
