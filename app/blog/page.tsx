import Link from "next/link";
import ClientSocialShare from "../../components/ClientSocialShare";

const posts = [
  {
    title: "Understanding the Gospel: The Good News of Jesus Christ",
    slug: "understanding-the-gospel",
    excerpt:
      "Explore the core message of Christianity through the life, death, and resurrection of Jesus Christ.",
    date: "March 28, 2026",
    topic: "Gospel Foundations",
  },
  {
    title: "The Power of Prayer: Connecting with God Through Faith",
    slug: "prayer-power-of-faith",
    excerpt:
      "Discover how prayer draws us into deeper dependence on God and reshapes the way we live.",
    date: "March 29, 2026",
    topic: "Prayer",
  },
  {
    title: "Faith Over Doubt: Trusting God in Uncertain Times",
    slug: "faith-overcoming-doubt",
    excerpt:
      "Learn to choose faith over fear and trust God's character when life feels uncertain.",
    date: "March 30, 2026",
    topic: "Spiritual Growth",
  },
  {
    title: "Effective Bible Study Methods for Spiritual Growth",
    slug: "bible-study-methods",
    excerpt:
      "A practical guide to study habits that help Scripture move from information to formation.",
    date: "March 31, 2026",
    topic: "Bible Study",
  },
  {
    title: "The Holy Spirit: God's Presence in Our Lives Today",
    slug: "holy-spirit-role",
    excerpt:
      "Understand the Holy Spirit's work in believers and how He empowers us for daily Christian living.",
    date: "April 1, 2026",
    topic: "Theology",
  },
  {
    title: "The Freedom of Forgiveness: Releasing the Past",
    slug: "forgiveness-freedom",
    excerpt:
      "Consider what forgiveness means biblically and why it matters for peace, healing, and obedience.",
    date: "April 2, 2026",
    topic: "Christian Living",
  },
  {
    title: "Worship from the Heart: More Than Just Music",
    slug: "worship-heart",
    excerpt:
      "Recover a fuller vision of worship as a whole-life response to the worthiness of God.",
    date: "April 3, 2026",
    topic: "Worship",
  },
  {
    title: "The Importance of Christian Community: We Need Each Other",
    slug: "christian-community",
    excerpt:
      "See why Christian growth is strengthened by fellowship, accountability, and life together in the church.",
    date: "April 4, 2026",
    topic: "Community",
  },
  {
    title: "Spiritual Disciplines: Practices That Draw Us Closer to God",
    slug: "spiritual-disciplines",
    excerpt:
      "Learn why small faithful practices create space for steady growth and deeper intimacy with God.",
    date: "April 5, 2026",
    topic: "Discipleship",
  },
  {
    title: "Sharing Your Faith: Evangelism in the Modern World",
    slug: "sharing-faith",
    excerpt:
      "Move past hesitation with practical ways to speak about Jesus naturally and faithfully.",
    date: "April 6, 2026",
    topic: "Evangelism",
  },
  {
    title: "God's Unconditional Love: Accepting What We Don't Deserve",
    slug: "gods-love-unconditional",
    excerpt:
      "Reflect on the steadiness of God's love and how receiving it changes the way we live.",
    date: "April 7, 2026",
    topic: "Grace",
  },
];

export default function Blog() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Writing for steady growth</p>
        <h1>A calmer blog designed to be read, not skimmed past.</h1>
        <p className="content-lead">
          Articles, reflections, and teaching notes on Scripture, prayer, faith,
          and Christian living, presented with a quieter rhythm and more room to
          breathe.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">Long-form reading</span>
          <span className="content-chip">Scripture-centered</span>
          <span className="content-chip">Mobile-friendly</span>
        </div>
      </section>

      <section className="content-grid-two">
        {posts.map((post) => (
          <article key={post.slug} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">{post.topic}</span>
              <span className="content-card-meta">{post.date}</span>
            </div>
            <h2 className="content-card-title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.excerpt}</p>
            <div className="content-actions">
              <Link href={`/blog/${post.slug}`} className="button-primary">
                Read article
              </Link>
              <div className="article-share">
                <ClientSocialShare
                  text={`Read this blog post: ${post.title}`}
                  url={`https://yourdomain.com/blog/${post.slug}`}
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
