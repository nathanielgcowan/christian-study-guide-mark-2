import Link from "next/link";
import HomeVerseLookup from "@/components/HomeVerseLookup";
import {
  ArrowRight,
  BellRing,
  BookHeart,
  BookMarked,
  BookOpenText,
  Compass,
  Flame,
  Globe,
  HeartHandshake,
  ImagePlus,
  Layers3,
  MapPinned,
  NotebookPen,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

const platformStats = [
  { value: "20+", label: "major study surfaces across Bible reading, prayer, memory, search, and community" },
  { value: "1", label: "connected platform for Scripture, context, journaling, reminders, and discovery" },
  { value: "Daily", label: "return loops built around reading, prayer, notes, memory, and dashboard follow-up" },
];

const pillars = [
  {
    title: "Read Scripture in context",
    description:
      "Open the Bible reader, move by book and chapter, compare verses, study a passage deeply, and stay anchored in the text instead of bouncing between disconnected tools.",
    icon: BookOpenText,
  },
  {
    title: "Build a real spiritual rhythm",
    description:
      "Reading plans, devotionals, prayer tracking, notifications, memory review, and a personal dashboard help daily habits become steadier and easier to keep.",
    icon: Compass,
  },
  {
    title: "Keep what matters close",
    description:
      "Bookmarks, notes, study collections, recent passages, verse images, and prayer follow-up give users a persistent study workspace instead of a one-time visit.",
    icon: NotebookPen,
  },
  {
    title: "Explore the whole study ecosystem",
    description:
      "Atlas tools, character profiles, timeline context, dictionary entries, search, blog content, apologetics, groups, and resources all connect back into Scripture study.",
    icon: Layers3,
  },
];

const featureSections = [
  {
    eyebrow: "Bible & Study",
    title: "Everything needed to move from reading into understanding",
    features: [
      {
        name: "Bible Reader",
        description: "Read full chapters, navigate book by book, switch translations, and jump directly into study.",
        href: "/bible",
      },
      {
        name: "Passage Workspace",
        description: "Study a reference with prompts, notes, related passages, original-language helps, and study actions.",
        href: "/passage/John%203%3A16",
      },
      {
        name: "Verse Comparison",
        description: "Compare translations side by side when a passage deserves slower attention.",
        href: "/verse-comparison",
      },
      {
        name: "Smart Search",
        description: "Search Scripture, notes, bookmarks, dictionary terms, maps, blog content, and resources from one place.",
        href: "/search",
      },
    ],
  },
  {
    eyebrow: "Rhythms & Growth",
    title: "Features designed for steady return, not one-time browsing",
    features: [
      {
        name: "Personal Dashboard",
        description: "A command center with verse of the day, memory review, recent passages, collections, notes, plans, and prayer follow-up.",
        href: "/dashboard",
      },
      {
        name: "Reading Plans",
        description: "Follow guided plans or move into a more customized reading path.",
        href: "/reading-plans",
      },
      {
        name: "Scripture Memory",
        description: "Review verses with a queue that keeps the next passages due for repetition in view.",
        href: "/scripture-memory",
      },
      {
        name: "Devotionals & Prayer",
        description: "Use daily devotionals, prayer journaling, prayer requests, and reminders as part of the same flow.",
        href: "/devotionals",
      },
    ],
  },
  {
    eyebrow: "Context & Discovery",
    title: "Go wider without losing the center of Scripture",
    features: [
      {
        name: "Bible Atlas",
        description: "Explore places, connected characters, and curated journeys through the biblical story.",
        href: "/maps",
      },
      {
        name: "Bible Characters",
        description: "Study key people with summaries, themes, places, and major references.",
        href: "/characters",
      },
      {
        name: "Timeline & Dictionary",
        description: "Use storyline placement and key theological terms to understand passages more clearly.",
        href: "/timeline",
      },
      {
        name: "Blog, Resources, and Apologetics",
        description: "Expand into longer-form teaching, study resources, and worldview content from the same platform.",
        href: "/resources",
      },
    ],
  },
];

const workflowCards = [
  {
    title: "Start with Scripture",
    body: "Open a chapter, search a topic, or jump straight into a known reference.",
    icon: BookHeart,
  },
  {
    title: "Capture your response",
    body: "Save notes, bookmarks, prayer requests, study sessions, and memorable verses while the passage is still fresh.",
    icon: BookMarked,
  },
  {
    title: "Revisit with momentum",
    body: "Come back through the dashboard, collections, reading plans, and memory queue instead of starting from zero every time.",
    icon: Flame,
  },
];

const ecosystemCards = [
  {
    title: "Prayer and care",
    description: "Prayer requests, answered-prayer follow-up, journaling, and calmer reminder flows.",
    href: "/user/prayer-requests",
    icon: HeartHandshake,
  },
  {
    title: "Creative sharing",
    description: "Verse image creation, saved images, and share-ready Scripture content.",
    href: "/user/verse-generator",
    icon: ImagePlus,
  },
  {
    title: "Community and groups",
    description: "Small-group spaces, shared study direction, and community-oriented spiritual rhythms.",
    href: "/groups",
    icon: UsersRound,
  },
  {
    title: "Reminders and onboarding",
    description: "Personalized setup, preferences, and notifications that support consistency without noise.",
    href: "/onboarding",
    icon: BellRing,
  },
  {
    title: "Maps and journeys",
    description: "Atlas explorer filters, route-style journeys, and location pages tied into passages and characters.",
    href: "/maps",
    icon: MapPinned,
  },
  {
    title: "Platform-wide discovery",
    description: "Search, site map, About page, privacy, terms, and clear routes into every part of the product.",
    href: "/site-map",
    icon: Globe,
  },
];

export default function Home() {
  return (
    <main id="main-content" className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">A complete Christian study platform</p>
          <h1>
            Read Scripture, build habits, and explore every major study tool in
            one connected website.
          </h1>
          <p className="hero-body">
            Christian Study Guide brings Bible reading, passage study, prayer,
            memorization, atlas context, character profiles, search, notes,
            reminders, and community features into a single experience designed
            for daily spiritual growth.
          </p>
          <HomeVerseLookup />
          <div className="hero-actions">
            <Link href="/bible" className="button-primary">
              Open Bible reader
              <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="button-secondary">
              View dashboard
            </Link>
          </div>
          <ul className="hero-rhythms" aria-label="Platform highlights">
            <li>Read full chapters, compare verses, and study passages deeply.</li>
            <li>Track prayer, notes, bookmarks, collections, and memory work.</li>
            <li>Discover maps, characters, timelines, dictionary terms, groups, and resources.</li>
          </ul>
        </div>

        <div className="hero-stage">
          <div className="hero-stage-card hero-stage-card-primary">
            <div className="stage-label">
              <Sparkles size={16} />
              Platform snapshot
            </div>
            <h2>One place for reading, context, and follow-through.</h2>
            <p>
              Move from John 15 into notes, prayer prompts, verse memory, atlas
              context, and a dashboard that keeps the next step visible.
            </p>
            <div className="stage-grid">
              <div>
                <span>Reading</span>
                <strong>Bible + passage study</strong>
              </div>
              <div>
                <span>Context</span>
                <strong>Atlas, characters, dictionary</strong>
              </div>
              <div>
                <span>Rhythm</span>
                <strong>Plans, memory, devotionals</strong>
              </div>
              <div>
                <span>Return</span>
                <strong>Dashboard, collections, search</strong>
              </div>
            </div>
          </div>

          <div className="hero-stage-card hero-stage-card-quote">
            <div className="stage-label">
              <Search size={16} />
              Discover everything
            </div>
            <p className="quote">
              Search Scripture, notes, bookmarks, maps, dictionary entries, and
              teaching content from one surface.
            </p>
            <span>Built for study, not just browsing</span>
          </div>
        </div>
      </section>

      <section className="section-block stats-band">
        {platformStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Why this platform works</p>
          <h2>A study experience built around Scripture and what helps people return.</h2>
          <p>
            The website is designed to reduce fragmentation. Instead of scattering
            reading, notes, prayer, context, and follow-up across unrelated tools,
            it keeps them near each other in one calmer environment.
          </p>
        </div>
        <div className="feature-grid">
          {pillars.map(({ title, description, icon: Icon }) => (
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

      {featureSections.map((section) => (
        <section key={section.title} className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{section.eyebrow}</p>
            <h2>{section.title}</h2>
          </div>
          <div className="feature-grid">
            {section.features.map((feature) => (
              <article key={feature.name} className="feature-card">
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                <Link href={feature.href} className="button-secondary">
                  Open feature
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="section-block pathways">
        <div className="section-heading">
          <p className="eyebrow">How people move through it</p>
          <h2>A simple workflow from reading to response to return.</h2>
        </div>
        <div className="pathway-list">
          {workflowCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="pathway-card">
                <p className="pathway-eyebrow">
                  <Icon size={16} />
                  Study flow
                </p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">The wider ecosystem</p>
          <h2>More than a reader, less fragmented than a tool bundle.</h2>
          <p>
            The platform now reaches beyond Bible reading into reminders,
            creativity, community, discovery, legal trust pages, and structured
            paths for onboarding and return visits.
          </p>
        </div>
        <div className="feature-grid">
          {ecosystemCards.map(({ title, description, href, icon: Icon }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link href={href} className="button-secondary">
                Explore
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block cta-panel">
        <div>
          <p className="eyebrow">Start anywhere</p>
          <h2>Enter through the feature that matches your spiritual rhythm right now.</h2>
          <p>
            Open the Bible reader for chapter reading, the dashboard for your
            personal study center, the atlas for context, or the search page to
            find anything across the site.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/bible" className="button-primary">
            Read Scripture
          </Link>
          <Link href="/search" className="button-secondary">
            Search the site
          </Link>
          <Link href="/maps" className="button-secondary">
            Explore the atlas
          </Link>
        </div>
      </section>

      <section className="section-block section-block-last">
        <div className="closing-note">
          <Flame size={18} />
          <p>
            Christian Study Guide is now positioned like a full product, with a
            marketing front door that reflects the breadth of the platform behind it.
          </p>
        </div>
      </section>
    </main>
  );
}
