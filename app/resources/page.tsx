const bookRecommendations = [
  {
    title: "The Pursuit of Holiness",
    author: "Jerry Bridges",
    description:
      "A practical guide to living a holy life through grace and dependence on the Holy Spirit.",
    category: "Spiritual Growth",
    why: "A grounded introduction to sanctification that stays practical.",
  },
  {
    title: "Knowing God",
    author: "J.I. Packer",
    description:
      "A classic exploration of God's character that deepens worship and theological clarity.",
    category: "Theology",
    why: "Still one of the best books for helping readers think deeply about who God is.",
  },
  {
    title: "The Gospel According to Jesus",
    author: "John MacArthur",
    description:
      "A study of discipleship, repentance, and what it means to truly follow Christ.",
    category: "Discipleship",
    why: "Helpful for readers who want to connect belief and obedience more carefully.",
  },
  {
    title: "Spiritual Disciplines for the Christian Life",
    author: "Donald S. Whitney",
    description:
      "A guide to habits that cultivate intimacy with God and steady spiritual growth.",
    category: "Formation",
    why: "Useful for building rhythms that are both biblical and sustainable.",
  },
];

const podcasts = [
  {
    title: "The Gospel Coalition Podcast",
    host: "Various Hosts",
    description:
      "Theological discussions, cultural engagement, and church-focused conversations.",
    category: "Theology",
    cadence: "Weekly",
  },
  {
    title: "Ask Pastor John",
    host: "John Piper",
    description:
      "Short answers to practical and doctrinal questions from daily Christian life.",
    category: "Q&A",
    cadence: "Daily",
  },
  {
    title: "Grace Family Baptist Church",
    host: "Jeff Noblit",
    description:
      "Expository preaching through books of the Bible with steady pastoral application.",
    category: "Preaching",
    cadence: "Weekly",
  },
  {
    title: "Christianity Today",
    host: "Various Hosts",
    description:
      "Coverage of Christian culture, current events, and wider church conversations.",
    category: "News",
    cadence: "Weekly",
  },
];

const glossaryTerms = [
  {
    term: "Sanctification",
    definition:
      "The ongoing work of God in believers, shaping them into the image of Christ.",
    category: "Theology",
  },
  {
    term: "Justification",
    definition:
      "God's declaration that believers are righteous in His sight through faith in Jesus Christ.",
    category: "Theology",
  },
  {
    term: "Exegesis",
    definition:
      "The careful study of Scripture to understand the meaning intended by the biblical author.",
    category: "Bible Study",
  },
  {
    term: "Hermeneutics",
    definition:
      "The principles and practice of interpreting the Bible faithfully and responsibly.",
    category: "Bible Study",
  },
];

export default function Resources() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Curated library</p>
        <h1>Resources arranged more like a study shelf than a catalog.</h1>
        <p className="content-lead">
          Books, podcasts, and core terms for readers who want solid next steps
          without digging through crowded recommendation pages.
        </p>
      </section>

      <section className="content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Books</p>
          <h2>Recommended reading</h2>
          <p>
            A smaller, calmer set of book recommendations with clear reasons for
            why each one is worth your time.
          </p>
        </div>
        <div className="content-grid-two">
          {bookRecommendations.map((book) => (
            <article key={book.title} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{book.category}</span>
                <span className="content-card-meta">{book.author}</span>
              </div>
              <h3 className="content-card-title">{book.title}</h3>
              <p>{book.description}</p>
              <div className="content-card-note">{book.why}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Audio</p>
          <h2>Podcasts worth keeping in rotation</h2>
        </div>
        <div className="content-grid-two">
          {podcasts.map((podcast) => (
            <article key={podcast.title} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{podcast.category}</span>
                <span className="content-card-meta">{podcast.cadence}</span>
              </div>
              <h3 className="content-card-title">{podcast.title}</h3>
              <p>Hosted by {podcast.host}</p>
              <p>{podcast.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Glossary</p>
          <h2>Core terms explained plainly</h2>
        </div>
        <div className="content-grid-two">
          {glossaryTerms.map((term) => (
            <article key={term.term} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{term.category}</span>
              </div>
              <h3 className="content-card-title">{term.term}</h3>
              <p>{term.definition}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
