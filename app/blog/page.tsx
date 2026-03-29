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
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition">
              Home
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 transition">
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
    excerpt: "Explore the core message of Christianity - the gospel of Jesus Christ, his life, death, and resurrection.",
    date: "March 28, 2026",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Christian Blog</h1>
          <p className="text-lg text-slate-600">
            Thoughts, teachings, and reflections on faith, Scripture, and Christian living.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-3xl bg-white p-8 shadow-md">
              <div className="mb-4">
                <time className="text-sm text-slate-500">{post.date}</time>
              </div>
              <h2 className="mb-3 text-2xl font-bold">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition">
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