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
          </div>
        </nav>
      </div>
    </header>
  );
}

const posts = [
  {
    title: "Understanding the Gospel: The Good News of Jesus Christ",
    slug: "understanding-the-gospel",
    excerpt:
      "Explore the core message of Christianity - the gospel of Jesus Christ, his life, death, and resurrection.",
    date: "March 28, 2026",
  },
  {
    title: "The Power of Prayer: Connecting with God Through Faith",
    slug: "prayer-power-of-faith",
    excerpt:
      "Discover how prayer connects us with God and transforms our lives through faithful communication.",
    date: "March 29, 2026",
  },
  {
    title: "Faith Over Doubt: Trusting God in Uncertain Times",
    slug: "faith-overcoming-doubt",
    excerpt:
      "Learn to choose faith over doubt and trust God's character even in difficult circumstances.",
    date: "March 30, 2026",
  },
  {
    title: "Effective Bible Study Methods for Spiritual Growth",
    slug: "bible-study-methods",
    excerpt:
      "Master proven Bible study techniques to deepen your understanding and grow spiritually.",
    date: "March 31, 2026",
  },
  {
    title: "The Holy Spirit: God's Presence in Our Lives Today",
    slug: "holy-spirit-role",
    excerpt:
      "Understand the Holy Spirit's work in believers and how He empowers us for Christian living.",
    date: "April 1, 2026",
  },
  {
    title: "The Freedom of Forgiveness: Releasing the Past",
    slug: "forgiveness-freedom",
    excerpt:
      "Experience true freedom through biblical forgiveness and release from past hurts.",
    date: "April 2, 2026",
  },
  {
    title: "Worship from the Heart: More Than Just Music",
    slug: "worship-heart",
    excerpt:
      "Discover worship as a lifestyle that honors God in every area of life, not just Sunday services.",
    date: "April 3, 2026",
  },
  {
    title: "The Importance of Christian Community: We Need Each Other",
    slug: "christian-community",
    excerpt:
      "Explore why Christian community is essential for spiritual growth and mutual support.",
    date: "April 4, 2026",
  },
  {
    title: "Spiritual Disciplines: Practices That Draw Us Closer to God",
    slug: "spiritual-disciplines",
    excerpt:
      "Learn key spiritual disciplines that cultivate intimacy with God and Christ-like character.",
    date: "April 5, 2026",
  },
  {
    title: "Sharing Your Faith: Evangelism in the Modern World",
    slug: "sharing-faith",
    excerpt:
      "Overcome fears and learn practical ways to share the gospel effectively today.",
    date: "April 6, 2026",
  },
  {
    title: "God's Unconditional Love: Accepting What We Don't Deserve",
    slug: "gods-love-unconditional",
    excerpt:
      "Experience the transformative power of God's perfect, unchanging love for you.",
    date: "April 7, 2026",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Christian Blog
          </h1>
          <p className="text-lg text-slate-600">
            Thoughts, teachings, and reflections on faith, Scripture, and
            Christian living.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-3xl bg-white p-8 shadow-md"
            >
              <div className="mb-4">
                <time className="text-sm text-slate-500">{post.date}</time>
              </div>
              <h2 className="mb-3 text-2xl font-bold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600 transition"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-slate-600 mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block rounded-2xl bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
