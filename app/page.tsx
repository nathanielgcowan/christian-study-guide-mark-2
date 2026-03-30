import Link from "next/link";
import {
  ArrowRight,
  BookHeart,
  BookOpenText,
  BellRing,
  Compass,
  Flame,
  Layers3,
  NotebookPen,
  Sparkles,
  UsersRound,
  WandSparkles,
  ShieldCheck,
} from "lucide-react";

const featureCards = [
  {
    title: "Scripture-first reading",
    description:
      "Move from a daily passage into context, cross references, and reflection prompts without leaving the flow of study.",
    icon: BookOpenText,
  },
  {
    title: "Guided spiritual rhythms",
    description:
      "Blend reading plans, prayer habits, memorization, and devotionals into a weekly pattern that feels sustainable.",
    icon: Compass,
  },
  {
    title: "Personal study workspace",
    description:
      "Keep prayer notes, saved verses, bookmarks, and insights close so growth does not disappear between sessions.",
    icon: NotebookPen,
  },
  {
    title: "Built for depth",
    description:
      "Browse theology, apologetics, maps, topical studies, and practical resources from one calm study environment.",
    icon: Layers3,
  },
];

const rhythms = [
  "Start with a daily reading path and verse comparison.",
  "Capture prayer requests, insights, and memory verses in one place.",
  "Explore deeper context with topical studies, maps, and devotionals.",
];

const pathways = [
  {
    eyebrow: "For daily consistency",
    title: "A home base for Scripture, prayer, and reflection",
    copy:
      "The homepage now acts like a study desk instead of a link directory. Clear entry points help readers know where to begin, what to do next, and how to stay anchored in the Word.",
  },
  {
    eyebrow: "For deeper learning",
    title: "Tools that support growth without overwhelming the page",
    copy:
      "Sections are grouped around real study goals: understand the passage, build a rhythm, and revisit what matters. The design leaves room to breathe while still surfacing a broad set of tools.",
  },
  {
    eyebrow: "For return visits",
    title: "A brand that feels thoughtful instead of generic",
    copy:
      "Warm tones, editorial typography, layered surfaces, and gentle motion give the site a distinct identity that feels more like a crafted ministry product than a starter template.",
  },
];

const stats = [
  { value: "40+", label: "entry points for study, prayer, reading, and discovery" },
  { value: "1", label: "shared design language across the landing experience" },
  { value: "100%", label: "mobile-friendly rebuild with accessible contrast and spacing" },
];

const expansionCards = [
  {
    title: "Personal onboarding",
    description:
      "Set your translation, focus goal, reminder flow, and dashboard defaults in one guided setup.",
    href: "/onboarding",
    icon: WandSparkles,
  },
  {
    title: "Groups and prayer circles",
    description:
      "Move from solo study into shared reading, prayer follow-up, and calmer community spaces.",
    href: "/groups",
    icon: UsersRound,
  },
  {
    title: "Reminder flow",
    description:
      "Control devotional, prayer, and newsletter reminders without turning the app into inbox noise.",
    href: "/notifications",
    icon: BellRing,
  },
  {
    title: "Passage study workspace",
    description:
      "Open a reference with comparison, notes, bookmarks, and related passages in one place.",
    href: "/passage/John%203%3A16",
    icon: BookOpenText,
  },
  {
    title: "Admin content hub",
    description:
      "Manage publishing state and featured content with the first real CMS-style admin surface.",
    href: "/admin/content",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main id="main-content" className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Rebuilt for a deeper walk through Scripture</p>
          <h1>
            A Christian study website that feels calm, intentional, and ready
            to use every day.
          </h1>
          <p className="hero-body">
            Read the Bible, follow structured rhythms, capture prayers, and
            explore richer context in a single study environment designed to
            keep attention on God&apos;s Word.
          </p>
          <div className="hero-actions">
            <Link href="/reading-plans" className="button-primary">
              Begin a reading path
              <ArrowRight size={18} />
            </Link>
            <Link href="/resources" className="button-secondary">
              Explore the library
            </Link>
          </div>
          <ul className="hero-rhythms" aria-label="Study rhythm highlights">
            {rhythms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="hero-stage">
          <div className="hero-stage-card hero-stage-card-primary">
            <div className="stage-label">
              <Sparkles size={16} />
              Today&apos;s flow
            </div>
            <h2>Read, reflect, respond.</h2>
            <p>
              Move from John 15 into guided notes, prayer prompts, and memory
              work with a layout that keeps the next faithful step visible.
            </p>
            <div className="stage-grid">
              <div>
                <span>Passage</span>
                <strong>John 15:1-17</strong>
              </div>
              <div>
                <span>Focus</span>
                <strong>Abide in Christ</strong>
              </div>
              <div>
                <span>Practice</span>
                <strong>Write one prayer</strong>
              </div>
              <div>
                <span>Review</span>
                <strong>Save a key verse</strong>
              </div>
            </div>
          </div>

          <div className="hero-stage-card hero-stage-card-quote">
            <div className="stage-label">
              <BookHeart size={16} />
              Guiding verse
            </div>
            <p className="quote">
              &ldquo;Your word is a lamp to my feet and a light to my
              path.&rdquo;
            </p>
            <span>Psalm 119:105</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">What changed</p>
          <h2>The website now leads with outcomes, not clutter.</h2>
          <p>
            The rebuild trades the old starter-page feel for a more structured
            front door, stronger typography, and a visual system that can scale
            with the rest of the app.
          </p>
        </div>
        <div className="feature-grid">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block pathways">
        <div className="section-heading">
          <p className="eyebrow">Designed around real use</p>
          <h2>Three ways the new experience supports study.</h2>
        </div>
        <div className="pathway-list">
          {pathways.map((pathway) => (
            <article key={pathway.title} className="pathway-card">
              <p className="pathway-eyebrow">{pathway.eyebrow}</p>
              <h3>{pathway.title}</h3>
              <p>{pathway.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block stats-band">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">What comes next</p>
          <h2>New product layers are starting to take shape.</h2>
          <p>
            The app is growing toward onboarding, reminders, shared study,
            saved image workflows, and a more personal dashboard.
          </p>
        </div>
        <div className="feature-grid">
          {expansionCards.map(({ title, description, href, icon: Icon }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link href={href} className="button-secondary">
                Open
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block cta-panel">
        <div>
          <p className="eyebrow">Keep exploring</p>
          <h2>Use the new front door, then dive into the rest of the platform.</h2>
          <p>
            Reading plans, devotionals, prayer tools, blogs, memory work, and
            resource pages now sit behind a much stronger first impression.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/devotionals" className="button-primary">
            Open devotionals
          </Link>
          <Link href="/images" className="button-secondary">
            Saved verse images
          </Link>
          <Link href="/prayer-journal" className="button-secondary">
            Visit prayer journal
          </Link>
        </div>
      </section>

      <section className="section-block section-block-last">
        <div className="closing-note">
          <Flame size={18} />
          <p>
            The site now has a clearer identity and a sturdier foundation for
            expanding the rest of the pages.
          </p>
        </div>
      </section>
    </main>
  );
}
