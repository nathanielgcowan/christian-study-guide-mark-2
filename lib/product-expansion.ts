export const memorizationSystems: ProductFeature[] = [
  {
    title: "Flashcards",
    detail: "Practice verses with digital flashcards and spaced repetition.",
  },
  {
    title: "Memory battles",
    detail:
      "Compete with friends or yourself to recall verses under time pressure.",
  },
  {
    title: "Progress tracking",
    detail:
      "See your streaks, review history, and mastery level for each passage.",
  },
];
export const collaborationSystems: ProductFeature[] = [
  {
    title: "Live presence",
    detail: "See who is studying, praying, or leading in real time.",
  },
  {
    title: "Shared library",
    detail: "Access group notes, highlights, and resources collaboratively.",
  },
  {
    title: "Moderation tools",
    detail: "Leaders can guide, mute, or remove participants as needed.",
  },
  {
    title: "Room types",
    detail: "Switch between open, invite-only, or church-team rooms.",
  },
];
export const familyChurchSystems: ProductFeature[] = [
  {
    title: "Shared household plans",
    detail:
      "Run one reading plan across parents, kids, and leaders with role-sensitive prompts.",
  },
  {
    title: "Parent and child progress",
    detail:
      "Track consistency separately while keeping a shared devotional rhythm.",
  },
  {
    title: "Leader dashboards",
    detail:
      "Show room engagement, plan adoption, and pastoral follow-up needs at a ministry level.",
  },
  {
    title: "Printable session guides",
    detail:
      "Export group questions, leader notes, and family devotion sheets for offline use.",
  },
];
export type ProductFeature = {
  title: string;
  detail: string;
  href?: string;
};

export type ProductPillar = {
  title: string;
  eyebrow?: string;
  detail: string;
  accent: string;
  href?: string;
};

export const growthPillars: ProductPillar[] = [
  {
    title: "Today engine",
    eyebrow: "Personalized daily flow",
    detail:
      "Give every user one reading, one reflection, one prayer prompt, one memory review, and one next step based on momentum.",
    accent: "blue",
    href: "/today",
  },
  {
    title: "Guided discipleship paths",
    eyebrow: "Structured growth tracks",
    detail:
      "Launch beginner, grief, anxiety, apologetics, leadership, marriage, and new believer tracks with checkpoints and completion moments.",
    accent: "emerald",
    href: "/reading-plans",
  },
  {
    title: "Sermon companion",
    eyebrow: "Church-ready tools",
    detail:
      "Turn a sermon text into notes, questions, prayer follow-up, and leader-ready next steps for groups and families.",
    accent: "amber",
    href: "/sermon",
  },
  {
    title: "Collaborative study rooms",
    eyebrow: "Live group discipleship",
    detail:
      "Support shared notes, leader prompts, attendance, prayer lists, and recap exports for classes, groups, and ministry teams.",
    accent: "violet",
    href: "/groups",
  },
  {
    title: "Memory and retention",
    eyebrow: "Habit-forming practice",
    detail:
      "Use spaced repetition, reminder loops, milestone celebrations, and adaptive plans to keep people engaged without shame.",
    accent: "rose",
    href: "/memorize",
  },
  {
    title: "Publishing and trust",
    eyebrow: "Operational maturity",
    detail:
      "Add AI safeguards, moderation, editorial queues, church oversight, and mobile polish so the product can scale responsibly.",
    accent: "slate",
    href: "/admin",
  },
];

export const guidedPaths: ProductFeature[] = [
  {
    title: "New believer path",
    detail:
      "Build confidence with identity in Christ, prayer, Gospel foundations, and first spiritual habits.",
  },
  {
    title: "Anxiety and peace",
    detail:
      "Pair short readings, prayer exercises, and breath-friendly reflection prompts around trust and rest.",
  },
  {
    title: "Marriage and family",
    detail:
      "Give couples and households one shared reading rhythm, one discussion question, and one weekly application.",
  },
  {
    title: "Leadership and service",
    detail:
      "Train volunteers and leaders with Scripture, reflection checkpoints, and ministry follow-through.",
  },
  {
    title: "Apologetics track",
    detail:
      "Move through hard questions with source-based answers, careful reasoning, and pastoral application.",
  },
  {
    title: "Grief and suffering",
    detail:
      "Offer a gentler pace with lament passages, testimony prompts, and hope-centered follow-up.",
  },
];

export const publishingSystems: ProductFeature[] = [
  {
    title: "Featured content curation",
    detail:
      "Choose what appears on the homepage, in campaigns, and inside themed discipleship tracks.",
  },
  {
    title: "Editorial approval queues",
    detail:
      "Review devotionals, studies, and leader resources before they go live.",
  },
  {
    title: "Seasonal campaign launches",
    detail:
      "Coordinate Lent, Advent, church initiatives, or sermon series from one publishing layer.",
  },
  {
    title: "Premium packaging",
    detail:
      "Bundle church kits, leader packs, and premium resources with clear access controls.",
  },
];
