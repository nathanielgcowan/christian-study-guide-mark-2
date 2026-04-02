export interface SiteFeatureGroup {
  eyebrow: string;
  title: string;
  description: string;
  features: Array<{
    name: string;
    description: string;
    href: string;
  }>;
}

export const siteFeatureGroups: SiteFeatureGroup[] = [
  {
    eyebrow: "Bible & Study",
    title: "Scripture reading and deeper study tools",
    description:
      "These features help readers move from opening the Bible to understanding passages in context.",
    features: [
      {
        name: "Bible Reader",
        description: "Read full chapters, move book by book, and keep your place as you go.",
        href: "/bible",
      },
      {
        name: "Passage Study",
        description: "Study a reference with notes, prompts, related passages, and original-language support.",
        href: "/passage/John%203%3A16",
      },
      {
        name: "Verse Comparison",
        description: "Compare translations side by side when a verse needs slower attention.",
        href: "/verse-comparison",
      },
      {
        name: "Smart Search",
        description: "Search Scripture, notes, bookmarks, maps, dictionary terms, and teaching content.",
        href: "/search",
      },
    ],
  },
  {
    eyebrow: "Rhythms & Growth",
    title: "Habit-building features for steady spiritual growth",
    description:
      "These surfaces are designed to help people return daily instead of treating study as a one-time event.",
    features: [
      {
        name: "Personal Dashboard",
        description: "See verse of the day, recent passages, collections, prayer follow-up, and memory review in one place.",
        href: "/dashboard",
      },
      {
        name: "Reading Plans",
        description: "Follow structured reading paths or build a more customized study rhythm.",
        href: "/reading-plans",
      },
      {
        name: "Scripture Memory",
        description: "Use a review queue to keep memory verses visible and due for repetition.",
        href: "/scripture-memory",
      },
      {
        name: "Study Sessions",
        description: "Review saved study activity and revisit what you have already read.",
        href: "/study-sessions",
      },
      {
        name: "Sermon Notes",
        description: "Capture church teaching, prayer follow-up, and action steps tied to a passage.",
        href: "/sermon-notes",
      },
    ],
  },
  {
    eyebrow: "Context & Discovery",
    title: "Features that widen understanding without leaving Scripture behind",
    description:
      "These pages help users explore people, places, history, themes, and supporting content across the platform.",
    features: [
      {
        name: "Bible Atlas",
        description: "Explore locations, connected characters, and atlas journeys through the biblical story.",
        href: "/maps",
      },
      {
        name: "Atlas Journeys",
        description: "Follow route-style biblical movements with locations and key readings in order.",
        href: "/journeys",
      },
      {
        name: "Bible Characters",
        description: "Study key figures with themes, passages, and related places.",
        href: "/characters",
      },
      {
        name: "Timeline & Dictionary",
        description: "Use storyline context and key biblical terms to understand passages more clearly.",
        href: "/timeline",
      },
      {
        name: "Topic Studies",
        description: "Open guided pathways for themes like anxiety, prayer, forgiveness, holiness, and identity in Christ.",
        href: "/topics",
      },
    ],
  },
  {
    eyebrow: "Prayer, Community, and Media",
    title: "Features that keep study connected to prayer and people",
    description:
      "These parts of the product help Scripture move into prayer, creative sharing, and shared group life.",
    features: [
      {
        name: "Prayer Journal",
        description: "Track requests, answered prayer, and spiritual reflection over time.",
        href: "/prayer-journal",
      },
      {
        name: "Prayer Requests",
        description: "Manage personal prayer requests and follow-up inside your account.",
        href: "/user/prayer-requests",
      },
      {
        name: "Groups",
        description: "Create shared study spaces with prayer feeds, leader prompts, and assigned readings.",
        href: "/groups",
      },
      {
        name: "Verse Image Tools",
        description: "Create, save, and share verse-based graphics and artwork.",
        href: "/user/verse-generator",
      },
      {
        name: "Devotionals, Blog, and Resources",
        description: "Explore daily devotionals, longer-form articles, curated books, podcasts, and apologetics content.",
        href: "/resources",
      },
    ],
  },
  {
    eyebrow: "Account & Product",
    title: "Support features that make the platform easier to trust and use",
    description:
      "These features help users personalize the experience, navigate the platform, and carry data across devices.",
    features: [
      {
        name: "Onboarding & Settings",
        description: "Set translation, goals, target minutes, reminder flow, and dashboard preferences.",
        href: "/onboarding",
      },
      {
        name: "Cross-Device Sync",
        description: "Push and restore collections, recent passages, and memory progress across browsers for signed-in users.",
        href: "/sync",
      },
      {
        name: "Collections",
        description: "Save passages into named collections for sermon prep, personal studies, and future review.",
        href: "/collections",
      },
      {
        name: "Site Map",
        description: "Browse the platform like a directory when you want a faster overview of what exists.",
        href: "/site-map",
      },
      {
        name: "About, Terms, and Privacy",
        description: "Read the platform overview and its trust-oriented site pages.",
        href: "/about",
      },
    ],
  },
];
