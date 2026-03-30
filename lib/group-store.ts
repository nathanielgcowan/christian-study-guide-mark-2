export interface GroupPrayerItem {
  id: string;
  author: string;
  text: string;
  status: "active" | "answered";
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  slug: string;
  title: string;
  focus: string;
  cadence: string;
  description: string;
  members: number;
  nextStep: string;
  prayerItems: GroupPrayerItem[];
}

const groups: StudyGroup[] = [
  {
    id: "group-1",
    slug: "sunday-study-circle",
    title: "Sunday Study Circle",
    focus: "Gospel of John",
    cadence: "Weekly",
    description:
      "A calmer small-group space for discussion prompts, prayer follow-up, and reading checkpoints.",
    members: 18,
    nextStep: "Read John 15 and post one observation before Sunday.",
    prayerItems: [
      {
        id: "prayer-1",
        author: "Sarah",
        text: "Pray for our group to stay consistent through the next four weeks.",
        status: "active",
        createdAt: "2026-03-25T12:00:00.000Z",
      },
      {
        id: "prayer-2",
        author: "Marcus",
        text: "Thank God for answered prayer around my family situation.",
        status: "answered",
        createdAt: "2026-03-26T18:30:00.000Z",
      },
    ],
  },
  {
    id: "group-2",
    slug: "prayer-partners",
    title: "Prayer Partners",
    focus: "Shared prayer rhythm",
    cadence: "Twice a week",
    description:
      "A compact group flow built around requests, answered prayers, and encouragement updates.",
    members: 9,
    nextStep: "Post one request and one answered prayer before Friday evening.",
    prayerItems: [
      {
        id: "prayer-3",
        author: "Naomi",
        text: "Wisdom for a hard work decision this week.",
        status: "active",
        createdAt: "2026-03-28T08:15:00.000Z",
      },
    ],
  },
  {
    id: "group-3",
    slug: "new-believers-track",
    title: "New Believers Track",
    focus: "Foundations",
    cadence: "Daily",
    description:
      "An onboarding-style group journey for Scripture basics, memory verses, and simple next steps.",
    members: 24,
    nextStep: "Finish the first foundations reading and save one memory verse.",
    prayerItems: [
      {
        id: "prayer-4",
        author: "Leah",
        text: "Confidence in reading the Bible for the first time.",
        status: "active",
        createdAt: "2026-03-27T15:45:00.000Z",
      },
    ],
  },
];

export function listGroups() {
  return groups;
}

export function findGroupBySlug(slug: string) {
  return groups.find((group) => group.slug === slug) ?? null;
}

export function createGroup(input: {
  title: string;
  focus: string;
  cadence: string;
  description: string;
}) {
  const slug = input.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const nextGroup: StudyGroup = {
    id: `group-${Date.now()}`,
    slug,
    title: input.title,
    focus: input.focus,
    cadence: input.cadence,
    description: input.description,
    members: 1,
    nextStep: "Set the first reading or prayer focus for this group.",
    prayerItems: [],
  };

  groups.unshift(nextGroup);
  return nextGroup;
}

export function addPrayerItem(
  slug: string,
  input: { author: string; text: string },
) {
  const group = findGroupBySlug(slug);
  if (!group) {
    return null;
  }

  const nextItem: GroupPrayerItem = {
    id: `prayer-${Date.now()}`,
    author: input.author,
    text: input.text,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  group.prayerItems.unshift(nextItem);
  return nextItem;
}

export function updatePrayerStatus(
  slug: string,
  prayerId: string,
  status: GroupPrayerItem["status"],
) {
  const group = findGroupBySlug(slug);
  if (!group) {
    return null;
  }

  const prayerItem = group.prayerItems.find((item) => item.id === prayerId);
  if (!prayerItem) {
    return null;
  }

  prayerItem.status = status;
  return prayerItem;
}
