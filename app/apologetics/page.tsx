const featuredArticles = [
  "Is There Evidence for the Resurrection?",
  "How Can We Trust the Bible?",
  "Does Science Contradict Christianity?",
];

const recommendedResources = [
  {
    title: "Reasonable Faith",
    url: "https://www.reasonablefaith.org/",
    note: "Philosophy, theology, and arguments for Christian belief.",
  },
  {
    title: "Cross Examined",
    url: "https://www.crossexamined.org/",
    note: "Accessible apologetics conversations and practical engagement.",
  },
  {
    title: "RZIM",
    url: "https://www.rzim.org/",
    note: "Archived apologetics material and talks from a global ministry.",
  },
];

const faqs = [
  {
    question: "What is apologetics?",
    answer:
      "Apologetics is the reasoned defense of the Christian faith. It helps believers answer objections with truth, evidence, humility, and care.",
  },
  {
    question: "Can faith and science coexist?",
    answer:
      "Yes. Many Christians see scientific discovery as one way of exploring the order and complexity of God's creation rather than something that cancels belief.",
  },
  {
    question: "How do I answer tough questions from skeptics?",
    answer:
      "Start by listening well. Understand the real question, answer honestly, and remember that calm character matters as much as having information.",
  },
];

export default function ApologeticsPage() {
  return (
    <main id="main-content" className="page-shell content-shell-narrow content-stack">
      <section className="content-hero">
        <p className="eyebrow">Thoughtful answers</p>
        <h1>Apologetics that feels steady, clear, and easier to engage.</h1>
        <p className="content-lead">
          A simpler starting place for exploring evidence, common questions, and
          recommended apologetics resources without the page feeling crowded.
        </p>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Featured topics</p>
          <h2>Questions people regularly bring to faith conversations.</h2>
        </div>
        <div className="content-stack">
          {featuredArticles.map((article) => (
            <article key={article} className="content-card">
              <h3 className="content-card-title">{article}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Recommended resources</p>
          <h2>Places to keep exploring</h2>
        </div>
        <div className="content-stack">
          {recommendedResources.map((resource) => (
            <article key={resource.title} className="content-card">
              <h3 className="content-card-title">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {resource.title}
                </a>
              </h3>
              <p>{resource.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Frequently asked</p>
          <h2>A calmer FAQ format for common objections and starting points.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
