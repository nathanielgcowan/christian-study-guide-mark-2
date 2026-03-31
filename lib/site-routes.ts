export interface SiteRouteItem {
  href: string;
  label: string;
  description: string;
}

export interface SiteRouteSection {
  title: string;
  routes: SiteRouteItem[];
}

export const blogSlugs = [
  "understanding-the-gospel",
  "prayer-power-of-faith",
  "faith-overcoming-doubt",
  "bible-study-methods",
  "holy-spirit-role",
  "forgiveness-freedom",
  "worship-heart",
  "christian-community",
  "spiritual-disciplines",
  "sharing-faith",
  "gods-love-unconditional",
];

export const publicStaticRoutes = [
  "",
  "/accessibility",
  "/ai-assistant",
  "/apologetics",
  "/audio",
  "/bible",
  "/blog",
  "/characters",
  "/church-events",
  "/dictionary",
  "/dashboard",
  "/devotionals",
  "/devotionals/daily",
  "/gamification",
  "/groups",
  "/images",
  "/journal",
  "/maps",
  "/mobile",
  "/notifications",
  "/onboarding",
  "/prayer-journal",
  "/reading-plans",
  "/reading-plans/custom",
  "/resources",
  "/scripture-memory",
  "/search",
  "/site-map",
  "/social",
  "/timeline",
  "/user/verse-generator",
  "/verse-comparison",
];

export const siteRouteSections: SiteRouteSection[] = [
  {
    title: "Main",
    routes: [
      {
        href: "/",
        label: "Home",
        description: "Landing page for the rebuilt study experience.",
      },
      {
        href: "/dashboard",
        label: "Dashboard",
        description: "Personal study overview for signed-in users.",
      },
      {
        href: "/site-map",
        label: "Site Map",
        description: "Browse every major route from one page.",
      },
      {
        href: "/search",
        label: "Search",
        description: "Search Scripture and move into study quickly.",
      },
    ],
  },
  {
    title: "Bible & Study",
    routes: [
      {
        href: "/bible",
        label: "Bible Reader",
        description: "Read by book and chapter with navigation and study handoff.",
      },
      {
        href: "/dictionary",
        label: "Biblical Dictionary",
        description: "Search key biblical words, places, and doctrines.",
      },
      {
        href: "/characters",
        label: "Bible Characters",
        description: "Browse key biblical figures with study context and references.",
      },
      {
        href: "/timeline",
        label: "Bible Timeline",
        description: "See where books and passages sit in the storyline of Scripture.",
      },
      {
        href: "/dictionary/grace",
        label: "Dictionary Entry Example",
        description: "Example dictionary term detail page.",
      },
      {
        href: "/characters/paul",
        label: "Character Profile Example",
        description: "Example character profile route.",
      },
      {
        href: "/bible/John/3",
        label: "Bible Reader Example",
        description: "Example direct chapter route for John 3.",
      },
      {
        href: "/bible/Romans",
        label: "Book Introduction Example",
        description: "Example Bible book introduction route.",
      },
      {
        href: "/passage/John%203%3A16",
        label: "Passage Study",
        description: "Deeper study workspace for a specific reference.",
      },
      {
        href: "/verse-comparison",
        label: "Verse Comparison",
        description: "Compare translations of the same verse.",
      },
      {
        href: "/reading-plans",
        label: "Reading Plans",
        description: "Structured plans for daily reading.",
      },
      {
        href: "/reading-plans/custom",
        label: "Custom Reading Plans",
        description: "Start shaping a personalized reading path.",
      },
      {
        href: "/scripture-memory",
        label: "Scripture Memory",
        description: "Memorization tools and verse practice.",
      },
      {
        href: "/journal",
        label: "Journal",
        description: "Capture study notes and reflections.",
      },
    ],
  },
  {
    title: "Prayer & Devotion",
    routes: [
      {
        href: "/devotionals",
        label: "Devotionals",
        description: "Reader-friendly devotional archive.",
      },
      {
        href: "/devotionals/daily",
        label: "Daily Devotional",
        description: "Focused daily devotional route.",
      },
      {
        href: "/prayer-journal",
        label: "Prayer Journal",
        description: "Track prayers, requests, and answered mercies.",
      },
      {
        href: "/user/prayer-requests",
        label: "Prayer Requests",
        description: "Personal prayer request management for signed-in users.",
      },
      {
        href: "/notifications",
        label: "Notifications",
        description: "Manage reminder and email preference flow.",
      },
    ],
  },
  {
    title: "Community & Media",
    routes: [
      {
        href: "/groups",
        label: "Groups",
        description: "Shared study and prayer group index.",
      },
      {
        href: "/groups/sunday-study-circle",
        label: "Group Example",
        description: "Example group detail route.",
      },
      {
        href: "/social",
        label: "Community",
        description: "Overview of prayer circles and social study direction.",
      },
      {
        href: "/audio",
        label: "Audio",
        description: "Audio-first study ideas and listening direction.",
      },
      {
        href: "/images",
        label: "Saved Verse Images",
        description: "Gallery of saved verse artwork.",
      },
      {
        href: "/user/verse-generator",
        label: "Verse Image Studio",
        description: "Create and share verse artwork.",
      },
      {
        href: "/share/verse",
        label: "Verse Share Page",
        description: "Image-sharing flow for verse artwork.",
      },
    ],
  },
  {
    title: "Library",
    routes: [
      {
        href: "/blog",
        label: "Blog",
        description: "Long-form articles and study content.",
      },
      {
        href: `/blog/${blogSlugs[0]}`,
        label: "Blog Post Example",
        description: "Example blog detail route.",
      },
      {
        href: "/resources",
        label: "Resources",
        description: "Resource library and helpful study material.",
      },
      {
        href: "/apologetics",
        label: "Apologetics",
        description: "Faith, reason, and worldview content.",
      },
      {
        href: "/maps",
        label: "Maps",
        description: "Bible world and location exploration surface.",
      },
      {
        href: "/maps/jerusalem",
        label: "Atlas Entry Example",
        description: "Example Bible atlas detail route.",
      },
      {
        href: "/church-events",
        label: "Church Events",
        description: "Event-oriented discovery page.",
      },
    ],
  },
  {
    title: "Account",
    routes: [
      {
        href: "/auth/signin",
        label: "Sign In",
        description: "Supabase sign-in page.",
      },
      {
        href: "/auth/register",
        label: "Register",
        description: "Create a new account.",
      },
      {
        href: "/auth/check-email",
        label: "Check Email",
        description: "Confirmation page after sign-up.",
      },
      {
        href: "/auth/auth-code-error",
        label: "Auth Code Error",
        description: "Fallback error page for auth callback issues.",
      },
      {
        href: "/onboarding",
        label: "Onboarding",
        description: "Set translation, goals, and reminder defaults.",
      },
      {
        href: "/user/profile",
        label: "Profile",
        description: "Profile editing and account details.",
      },
      {
        href: "/user/settings",
        label: "Settings",
        description: "Preferences and notification settings.",
      },
      {
        href: "/user/bookmarks",
        label: "Bookmarks",
        description: "Saved passages and references.",
      },
    ],
  },
  {
    title: "Admin & Product",
    routes: [
      {
        href: "/admin/analytics",
        label: "Admin Analytics",
        description: "High-level analytics dashboard.",
      },
      {
        href: "/admin/content",
        label: "Admin Content",
        description: "Editorial queue and CMS-style content controls.",
      },
      {
        href: "/ai-assistant",
        label: "AI Assistant",
        description: "AI-guided study helper surface.",
      },
      {
        href: "/mobile",
        label: "Mobile",
        description: "Mobile-oriented product direction page.",
      },
      {
        href: "/gamification",
        label: "Gamification",
        description: "Progress and motivation feature surface.",
      },
      {
        href: "/accessibility",
        label: "Accessibility",
        description: "Accessibility information and support.",
      },
    ],
  },
];
