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
              href="/reading-plans"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Reading Plans
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const readingPlans = [
  {
    id: "new-testament-30-days",
    title: "New Testament in 30 Days",
    description:
      "Read through the entire New Testament in one month with daily readings.",
    duration: "30 days",
    books: [
      "Matthew",
      "Mark",
      "Luke",
      "John",
      "Acts",
      "Romans",
      "1 Corinthians",
      "2 Corinthians",
      "Galatians",
      "Ephesians",
      "Philippians",
      "Colossians",
      "1 Thessalonians",
      "2 Thessalonians",
      "1 Timothy",
      "2 Timothy",
      "Titus",
      "Philemon",
      "Hebrews",
      "James",
      "1 Peter",
      "2 Peter",
      "1 John",
      "2 John",
      "3 John",
      "Jude",
      "Revelation",
    ],
    difficulty: "Beginner",
  },
  {
    id: "psalms-wisdom",
    title: "Psalms & Wisdom Literature",
    description: "Explore the poetic books and wisdom literature of the Bible.",
    duration: "21 days",
    books: ["Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Job"],
    difficulty: "Intermediate",
  },
  {
    id: "gospel-jesus",
    title: "The Life of Jesus",
    description:
      "Read the four Gospels to understand Jesus' life, teachings, and ministry.",
    duration: "14 days",
    books: ["Matthew", "Mark", "Luke", "John"],
    difficulty: "Beginner",
  },
  {
    id: "old-testament-overview",
    title: "Old Testament Overview",
    description: "A comprehensive journey through the Old Testament books.",
    duration: "90 days",
    books: [
      "Genesis",
      "Exodus",
      "Leviticus",
      "Numbers",
      "Deuteronomy",
      "Joshua",
      "Judges",
      "Ruth",
      "1 Samuel",
      "2 Samuel",
      "1 Kings",
      "2 Kings",
      "1 Chronicles",
      "2 Chronicles",
      "Ezra",
      "Nehemiah",
      "Esther",
      "Job",
      "Psalms",
      "Proverbs",
      "Ecclesiastes",
      "Song of Solomon",
      "Isaiah",
      "Jeremiah",
      "Lamentations",
      "Ezekiel",
      "Daniel",
      "Hosea",
      "Joel",
      "Amos",
      "Obadiah",
      "Jonah",
      "Micah",
      "Nahum",
      "Habakkuk",
      "Zephaniah",
      "Haggai",
      "Zechariah",
      "Malachi",
    ],
    difficulty: "Advanced",
  },
  {
    id: "epistles-paul",
    title: "Paul's Letters",
    description:
      "Study the teachings of the Apostle Paul through his epistles.",
    duration: "45 days",
    books: [
      "Romans",
      "1 Corinthians",
      "2 Corinthians",
      "Galatians",
      "Ephesians",
      "Philippians",
      "Colossians",
      "1 Thessalonians",
      "2 Thessalonians",
      "1 Timothy",
      "2 Timothy",
      "Titus",
      "Philemon",
    ],
    difficulty: "Intermediate",
  },
  {
    id: "daily-psalms",
    title: "Daily Psalms",
    description:
      "Read one Psalm each day for 30 days of worship and reflection.",
    duration: "30 days",
    books: ["Psalms"],
    difficulty: "Beginner",
  },
];

function ReadingPlanCard({ plan }: { plan: (typeof readingPlans)[0] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4">
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
            plan.difficulty === "Beginner"
              ? "bg-green-100 text-green-700"
              : plan.difficulty === "Intermediate"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {plan.difficulty}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold">{plan.title}</h3>
      <p className="mb-4 text-slate-600">{plan.description}</p>
      <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
        <span>📅 {plan.duration}</span>
        <span>📚 {plan.books.length} books</span>
      </div>
      <button className="w-full rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
        Start This Plan
      </button>
    </div>
  );
}

export default function ReadingPlans() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Bible Reading Plans
          </h1>
          <p className="text-lg text-slate-600">
            Follow structured reading plans to systematically study God's Word
            and grow in your faith.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {readingPlans.map((plan) => (
            <ReadingPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">How Reading Plans Work</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold">📖 Daily Readings</h3>
              <p className="text-slate-600">
                Each day includes specific chapters or verses to read, making it
                easy to stay on track.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                📝 Reflection Questions
              </h3>
              <p className="text-slate-600">
                Thought-provoking questions help you apply what you've learned
                to your life.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                📊 Progress Tracking
              </h3>
              <p className="text-slate-600">
                Mark days as complete and see your progress through the plan.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                🤝 Community Support
              </h3>
              <p className="text-slate-600">
                Join others following the same plan for encouragement and
                discussion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
