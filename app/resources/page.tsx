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
              href="/resources"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Resources
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

const bookRecommendations = [
  {
    title: "The Pursuit of Holiness",
    author: "Jerry Bridges",
    description:
      "A practical guide to living a holy life through God's grace and the power of the Holy Spirit.",
    category: "Spiritual Growth",
    rating: 5,
    why: "Essential reading for understanding sanctification and practical holiness.",
  },
  {
    title: "Knowing God",
    author: "J.I. Packer",
    description:
      "A comprehensive exploration of God's character and attributes that will deepen your understanding of who God is.",
    category: "Theology",
    rating: 5,
    why: "One of the most influential Christian books of the 20th century.",
  },
  {
    title: "The Gospel According to Jesus",
    author: "John MacArthur",
    description:
      "An examination of what it truly means to be a disciple of Jesus Christ.",
    category: "Discipleship",
    rating: 4,
    why: "Challenges readers to move beyond superficial Christianity to true discipleship.",
  },
  {
    title: "Spiritual Disciplines for the Christian Life",
    author: "Donald S. Whitney",
    description:
      "A practical guide to essential spiritual disciplines that promote spiritual growth.",
    category: "Spiritual Disciplines",
    rating: 5,
    why: "Comprehensive and practical approach to spiritual disciplines.",
  },
  {
    title: "The Pilgrim's Progress",
    author: "John Bunyan",
    description:
      "An allegorical tale of Christian's journey from the City of Destruction to the Celestial City.",
    category: "Christian Literature",
    rating: 4,
    why: "A Christian classic that illustrates the Christian life journey.",
  },
  {
    title: "Desiring God",
    author: "John Piper",
    description:
      "Explores how God is most glorified in us when we are most satisfied in Him.",
    category: "Theology",
    rating: 4,
    why: "Introduces Christian Hedonism and the importance of delighting in God.",
  },
];

const podcasts = [
  {
    title: "The Gospel Coalition Podcast",
    host: "Various Hosts",
    description:
      "Theological discussions and cultural commentary from a Reformed perspective.",
    category: "Theology",
    episodes: "Weekly",
    recommended: true,
  },
  {
    title: "Ask Pastor John",
    host: "John Piper",
    description:
      "Answers to questions about life, faith, and the Bible from John Piper.",
    category: "Q&A",
    episodes: "Daily",
    recommended: true,
  },
  {
    title: "Grace Family Baptist Church",
    host: "Jeff Noblit",
    description:
      "Expository preaching through books of the Bible with practical application.",
    category: "Preaching",
    episodes: "Weekly",
    recommended: true,
  },
  {
    title: "Sovereign Grace Music",
    host: "Various Artists",
    description:
      "Worship music and discussions about worship and the Christian life.",
    category: "Worship",
    episodes: "Monthly",
    recommended: false,
  },
  {
    title: "Christianity Today",
    host: "Various Hosts",
    description:
      "News, analysis, and commentary on Christian culture and current events.",
    category: "News",
    episodes: "Weekly",
    recommended: false,
  },
];

const sermons = [
  {
    title: "The Attributes of God",
    speaker: "A.W. Tozer",
    series: "The Knowledge of the Holy",
    description: "A classic series exploring God's character and attributes.",
    duration: "Multiple Sessions",
    recommended: true,
  },
  {
    title: "The Sermon on the Mount",
    speaker: "John MacArthur",
    series: "Matthew Series",
    description: "Verse-by-verse exposition of Jesus' most famous teaching.",
    duration: "12 Sessions",
    recommended: true,
  },
  {
    title: "Romans: The Gospel of God",
    speaker: "R.C. Sproul",
    series: "Romans Study",
    description: "Comprehensive study of Paul's letter to the Romans.",
    duration: "28 Sessions",
    recommended: true,
  },
  {
    title: "Prayer: The Mightiest Force in the World",
    speaker: "R.A. Torrey",
    series: "Prayer Series",
    description: "Teaching on the importance and practice of prayer.",
    duration: "6 Sessions",
    recommended: false,
  },
];

const glossaryTerms = [
  {
    term: "Sanctification",
    definition:
      "The process by which God progressively transforms believers into Christ's image through the work of the Holy Spirit.",
    category: "Theology",
  },
  {
    term: "Justification",
    definition:
      "God's declaration that believers are righteous in His sight through faith in Jesus Christ, not by their own works.",
    category: "Theology",
  },
  {
    term: "Regeneration",
    definition:
      "The supernatural work of the Holy Spirit that gives new life to spiritually dead sinners, enabling them to respond to God.",
    category: "Theology",
  },
  {
    term: "Propitiation",
    definition:
      "The satisfaction of God's righteous wrath against sin through Christ's sacrificial death on the cross.",
    category: "Theology",
  },
  {
    term: "Exegesis",
    definition:
      "The careful, systematic study of Scripture to discover the original meaning intended by the biblical authors.",
    category: "Bible Study",
  },
  {
    term: "Hermeneutics",
    definition:
      "The science and art of biblical interpretation, including principles for understanding Scripture correctly.",
    category: "Bible Study",
  },
  {
    term: "Soteriology",
    definition:
      "The study of salvation, including how people are saved and the nature of salvation itself.",
    category: "Theology",
  },
  {
    term: "Pneumatology",
    definition:
      "The study of the Holy Spirit, including His person, work, and gifts.",
    category: "Theology",
  },
];

function BookCard({ book }: { book: (typeof bookRecommendations)[0] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {book.category}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold">{book.title}</h3>
      <p className="mb-2 text-slate-600">by {book.author}</p>
      <p className="mb-4 text-slate-700">{book.description}</p>
      <div className="mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < book.rating ? "text-yellow-400" : "text-slate-300"}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">
          Why we recommend it:
        </p>
        <p className="text-sm text-slate-600">{book.why}</p>
      </div>
    </div>
  );
}

function PodcastCard({ podcast }: { podcast: (typeof podcasts)[0] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          {podcast.category}
        </span>
        {podcast.recommended && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Recommended
          </span>
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold">{podcast.title}</h3>
      <p className="mb-2 text-slate-600">Hosted by {podcast.host}</p>
      <p className="mb-4 text-slate-700">{podcast.description}</p>
      <div className="text-sm text-slate-500">📅 {podcast.episodes}</div>
    </div>
  );
}

function SermonCard({ sermon }: { sermon: (typeof sermons)[0] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
          Sermon Series
        </span>
        {sermon.recommended && (
          <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Recommended
          </span>
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold">{sermon.title}</h3>
      <p className="mb-2 text-slate-600">by {sermon.speaker}</p>
      <p className="mb-2 text-sm text-slate-500">{sermon.series}</p>
      <p className="mb-4 text-slate-700">{sermon.description}</p>
      <div className="text-sm text-slate-500">⏱️ {sermon.duration}</div>
    </div>
  );
}

function GlossaryCard({ term }: { term: (typeof glossaryTerms)[0] }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-4">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
          {term.category}
        </span>
      </div>
      <h3 className="mb-3 text-lg font-bold text-blue-600">{term.term}</h3>
      <p className="text-slate-700">{term.definition}</p>
    </div>
  );
}

export default function Resources() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-900">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Resource Library
          </h1>
          <p className="text-lg text-slate-600">
            Curated recommendations to deepen your faith and understanding of
            God's Word.
          </p>
        </div>

        {/* Book Recommendations */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">📚 Recommended Books</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookRecommendations.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </div>

        {/* Podcasts */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">🎧 Christian Podcasts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {podcasts.map((podcast, index) => (
              <PodcastCard key={index} podcast={podcast} />
            ))}
          </div>
        </div>

        {/* Sermons */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">🎤 Sermon Series</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sermons.map((sermon, index) => (
              <SermonCard key={index} sermon={sermon} />
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold">📖 Christian Glossary</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {glossaryTerms.map((term, index) => (
              <GlossaryCard key={index} term={term} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-3xl bg-blue-600 p-8 text-center text-white shadow-md">
          <h3 className="mb-4 text-2xl font-bold">
            Have a Resource to Suggest?
          </h3>
          <p className="mb-6 text-blue-100">
            Help us build a better resource library by suggesting books,
            podcasts, or other materials that have helped your spiritual growth.
          </p>
          <button className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
            Suggest a Resource
          </button>
        </div>
      </section>
    </main>
  );
}
