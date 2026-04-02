import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export type ChurchSpeaker = {
  id: string;
  name: string;
  role: string;
  church: string;
};

export type ChurchEvent = {
  id: string;
  title: string;
  church: string;
  eventType: string;
  date: string;
  speakerId: string;
  primaryPassage: string;
  supportingPassages: string[];
  summary: string;
};

export type ChurchProfile = {
  slug: string;
  name: string;
  city: string;
  state: string;
  tagline: string;
  summary: string;
  branding: {
    logoText: string;
    accent: string;
    accentSoft: string;
    surface: string;
    heroGradient: string;
  };
  announcements: Array<{
    id: string;
    label: string;
    title: string;
    body: string;
    href: string;
    cta: string;
  }>;
  ministryFocus: string[];
  weeklyRhythms: string[];
  featuredResources: Array<{
    label: string;
    href: string;
    description: string;
    ministryTag: string;
  }>;
  groupSlugs: string[];
};

export const churchSpeakers: ChurchSpeaker[] = [
  {
    id: "speaker-nathaniel-cowan",
    name: "Nathaniel Cowan",
    role: "Teaching Pastor",
    church: "Grace Fellowship",
  },
  {
    id: "speaker-sarah-james",
    name: "Sarah James",
    role: "Discipleship Director",
    church: "Grace Fellowship",
  },
  {
    id: "speaker-marcus-hill",
    name: "Marcus Hill",
    role: "Young Adults Pastor",
    church: "Hope City Church",
  },
];

export const churchEvents: ChurchEvent[] = [
  {
    id: "event-easter-living-hope",
    title: "Living Hope",
    church: "Grace Fellowship",
    eventType: "Easter Sunday",
    date: "2026-04-05",
    speakerId: "speaker-nathaniel-cowan",
    primaryPassage: "1 Peter 1:3-9",
    supportingPassages: ["John 20", "Romans 8:11"],
    summary: "A resurrection-centered message on hope, new birth, and present endurance.",
  },
  {
    id: "event-prayer-night-abide",
    title: "Abide In Me",
    church: "Grace Fellowship",
    eventType: "Prayer Night",
    date: "2026-04-08",
    speakerId: "speaker-sarah-james",
    primaryPassage: "John 15:1-11",
    supportingPassages: ["Psalm 27:4", "Galatians 5:22-23"],
    summary: "A guided prayer gathering around abiding in Christ and lasting spiritual fruit.",
  },
  {
    id: "event-young-adults-fearless",
    title: "Fearless Faith",
    church: "Hope City Church",
    eventType: "Young Adults Gathering",
    date: "2026-04-12",
    speakerId: "speaker-marcus-hill",
    primaryPassage: "Daniel 3",
    supportingPassages: ["Hebrews 11:32-34", "Romans 12:1-2"],
    summary: "A discipleship message on courage, conviction, and witness under pressure.",
  },
];

export const churchProfiles: ChurchProfile[] = [
  {
    slug: "grace-fellowship",
    name: "Grace Fellowship",
    city: "Nashville",
    state: "TN",
    tagline: "A church profile built for Scripture, prayer, and everyday discipleship.",
    summary:
      "Grace Fellowship uses Christian Study Guide to keep Sunday teaching, household rhythms, prayer follow-up, and discipleship pathways connected throughout the week.",
    branding: {
      logoText: "GF",
      accent: "#855d36",
      accentSoft: "#efe2d0",
      surface: "#fbf6ef",
      heroGradient: "linear-gradient(135deg, #fbf6ef 0%, #efe2d0 55%, #d2b48c 100%)",
    },
    announcements: [
      {
        id: "gf-announcement-easter",
        label: "Featured Sunday",
        title: "Living Hope weekend is now live across the ministry workspace",
        body: "Sermon companion notes, family follow-up, and small-group reading prompts are ready for Easter week.",
        href: "/sermon-notes?event=event-easter-living-hope",
        cta: "Open Easter companion",
      },
      {
        id: "gf-announcement-family",
        label: "Family rhythm",
        title: "Household memory and dinner-table reading plan for this month",
        body: "Families can move through one shared reading rhythm and use parent-child prompts throughout the week.",
        href: "/family",
        cta: "Open family mode",
      },
    ],
    ministryFocus: [
      "Expository preaching and passage-based follow-up",
      "Prayer gatherings and discipleship rhythms",
      "Family Scripture habits and new believer care",
    ],
    weeklyRhythms: [
      "Sunday teaching with sermon companion follow-up",
      "Midweek prayer and discipleship gatherings",
      "Family reading plans and Scripture memory prompts",
    ],
    featuredResources: [
      {
        label: "Sermon companion",
        href: "/sermon-notes",
        description: "Capture teaching, linked passages, and next steps during the week.",
        ministryTag: "Sunday follow-up",
      },
      {
        label: "Family mode",
        href: "/family",
        description: "Run household reading plans and parent-child memory rhythms.",
        ministryTag: "Households",
      },
      {
        label: "New believers track",
        href: "/new-believers",
        description: "Guide newer Christians into Scripture, prayer, and church life.",
        ministryTag: "Discipleship path",
      },
    ],
    groupSlugs: ["sunday-study-circle", "new-believers-track"],
  },
  {
    slug: "hope-city-church",
    name: "Hope City Church",
    city: "Dallas",
    state: "TX",
    tagline: "A ministry space for young adults, gospel courage, and shared study.",
    summary:
      "Hope City Church uses the platform as a ministry-facing space for event follow-up, prayer support, and Scripture-centered group discussion.",
    branding: {
      logoText: "HC",
      accent: "#1d5f5b",
      accentSoft: "#d9f0ed",
      surface: "#eef8f6",
      heroGradient: "linear-gradient(135deg, #eef8f6 0%, #d9f0ed 58%, #8cc7be 100%)",
    },
    announcements: [
      {
        id: "hc-announcement-young-adults",
        label: "Young adults",
        title: "Fearless Faith follow-up is ready for this week's gathering",
        body: "Discussion prompts, reading links, and prayer follow-up around Daniel 3 are ready to share with the group.",
        href: "/church-events",
        cta: "View event flow",
      },
      {
        id: "hc-announcement-testimony",
        label: "Prayer culture",
        title: "Answered-prayer stories are being gathered into this month's testimony emphasis",
        body: "Use the testimony wall and prayer tools to keep specific thanksgiving visible in the ministry.",
        href: "/testimonies",
        cta: "Open testimony wall",
      },
    ],
    ministryFocus: [
      "Young adult discipleship and mission-minded study",
      "Shared prayer updates and testimony culture",
      "Topic-based reading plans for real-life questions",
    ],
    weeklyRhythms: [
      "Young adult gatherings tied to passage study",
      "Prayer request sharing and answered-prayer follow-up",
      "Topic plan engagement between meetings",
    ],
    featuredResources: [
      {
        label: "Groups",
        href: "/groups",
        description: "Run leader prompts, attendance, and weekly plans in one place.",
        ministryTag: "Leader workflow",
      },
      {
        label: "Topic studies",
        href: "/topics",
        description: "Guide members through anxiety, prayer, identity, and formation.",
        ministryTag: "Formation",
      },
      {
        label: "Testimony wall",
        href: "/testimonies",
        description: "Keep stories of answered prayer and growth visible to the community.",
        ministryTag: "Celebration",
      },
    ],
    groupSlugs: ["prayer-partners"],
  },
];

const DEFAULT_VISIBLE_WIDGETS = {
  bookmarks: true,
  prayerRequests: true,
  emailPreferences: true,
  studySummary: true,
};

let mutableChurchProfiles: ChurchProfile[] = churchProfiles.map((church) => ({
  ...church,
  branding: { ...church.branding },
  announcements: church.announcements.map((announcement) => ({ ...announcement })),
  featuredResources: church.featuredResources.map((resource) => ({ ...resource })),
  ministryFocus: [...church.ministryFocus],
  weeklyRhythms: [...church.weeklyRhythms],
  groupSlugs: [...church.groupSlugs],
}));

function cloneChurchProfile(church: ChurchProfile): ChurchProfile {
  return {
    ...church,
    branding: { ...church.branding },
    announcements: church.announcements.map((announcement) => ({ ...announcement })),
    featuredResources: church.featuredResources.map((resource) => ({ ...resource })),
    ministryFocus: [...church.ministryFocus],
    weeklyRhythms: [...church.weeklyRhythms],
    groupSlugs: [...church.groupSlugs],
  };
}

function createChurchConfigClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}

function getDefaultChurchProfiles() {
  return churchProfiles.map(cloneChurchProfile);
}

function normalizePersistedChurchProfiles(input: unknown) {
  if (!Array.isArray(input)) return null;

  const persistedBySlug = new Map(
    input
      .filter((item): item is ChurchProfile => Boolean(item) && typeof item === "object" && "slug" in item)
      .map((item) => [item.slug, item]),
  );

  return getDefaultChurchProfiles().map((church) => {
    const override = persistedBySlug.get(church.slug);
    if (!override) return church;

    return cloneChurchProfile({
      ...church,
      ...override,
      branding: {
        ...church.branding,
        ...(override.branding ?? {}),
      },
      announcements: Array.isArray(override.announcements)
        ? override.announcements.map((announcement) => ({ ...announcement }))
        : church.announcements,
      featuredResources: Array.isArray(override.featuredResources)
        ? override.featuredResources.map((resource) => ({ ...resource }))
        : church.featuredResources,
      ministryFocus: Array.isArray(override.ministryFocus)
        ? [...override.ministryFocus]
        : church.ministryFocus,
      weeklyRhythms: Array.isArray(override.weeklyRhythms)
        ? [...override.weeklyRhythms]
        : church.weeklyRhythms,
      groupSlugs: Array.isArray(override.groupSlugs)
        ? [...override.groupSlugs]
        : church.groupSlugs,
    });
  });
}

async function readPersistedChurchProfiles() {
  const supabase = createChurchConfigClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("user_command_center_preferences")
    .select("recommendation_weights,updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    return null;
  }

  for (const row of data ?? []) {
    const recommendationWeights = (row.recommendation_weights ?? {}) as {
      globalChurchProfiles?: unknown;
    };

    const normalized = normalizePersistedChurchProfiles(
      recommendationWeights.globalChurchProfiles,
    );

    if (normalized) {
      mutableChurchProfiles = normalized.map(cloneChurchProfile);
      return normalized;
    }
  }

  return null;
}

export function getSpeakerById(speakerId: string) {
  return churchSpeakers.find((speaker) => speaker.id === speakerId) ?? null;
}

export function getEventById(eventId: string) {
  return churchEvents.find((event) => event.id === eventId) ?? null;
}

export async function getChurchProfiles() {
  const persisted = await readPersistedChurchProfiles();
  if (persisted) {
    return persisted.map(cloneChurchProfile);
  }

  return mutableChurchProfiles.map(cloneChurchProfile);
}

export async function getChurchProfileBySlug(slug: string) {
  const churches = await getChurchProfiles();
  const church = churches.find((item) => item.slug === slug) ?? null;
  if (!church) return null;

  return cloneChurchProfile(church);
}

export function getChurchEvents(churchName: string) {
  return churchEvents.filter((event) => event.church === churchName);
}

export function getChurchSpeakers(churchName: string) {
  return churchSpeakers.filter((speaker) => speaker.church === churchName);
}

export function updateChurchProfile(
  slug: string,
  updates: Partial<ChurchProfile>,
) {
  const index = mutableChurchProfiles.findIndex((church) => church.slug === slug);
  if (index === -1) {
    return null;
  }

  const current = mutableChurchProfiles[index];
  const next: ChurchProfile = {
    ...current,
    ...updates,
    branding: {
      ...current.branding,
      ...(updates.branding ?? {}),
    },
    announcements: Array.isArray(updates.announcements)
      ? updates.announcements.map((announcement) => ({ ...announcement }))
      : current.announcements.map((announcement) => ({ ...announcement })),
    featuredResources: Array.isArray(updates.featuredResources)
      ? updates.featuredResources.map((resource) => ({ ...resource }))
      : current.featuredResources.map((resource) => ({ ...resource })),
    ministryFocus: Array.isArray(updates.ministryFocus)
      ? [...updates.ministryFocus]
      : [...current.ministryFocus],
    weeklyRhythms: Array.isArray(updates.weeklyRhythms)
      ? [...updates.weeklyRhythms]
      : [...current.weeklyRhythms],
    groupSlugs: Array.isArray(updates.groupSlugs)
      ? [...updates.groupSlugs]
      : [...current.groupSlugs],
  };

  mutableChurchProfiles[index] = next;
  return cloneChurchProfile(next);
}

export async function persistChurchProfiles(profiles: ChurchProfile[], userId: string) {
  const supabase = createChurchConfigClient();
  if (!supabase) {
    return { error: "Missing Supabase service role configuration." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("user_command_center_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  const existingWeights = (existing?.recommendation_weights ?? {}) as Record<string, unknown>;

  const { error } = await supabase
    .from("user_command_center_preferences")
    .upsert(
      {
        user_id: userId,
        focus_goal: existing?.focus_goal ?? "consistency",
        recommendation_weights: {
          ...existingWeights,
          globalChurchProfiles: profiles.map(cloneChurchProfile),
        },
        visible_widgets: existing?.visible_widgets ?? {
          ...DEFAULT_VISIBLE_WIDGETS,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  if (error) {
    return { error: error.message };
  }

  mutableChurchProfiles = profiles.map(cloneChurchProfile);
  return { error: null };
}
