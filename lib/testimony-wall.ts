export interface TestimonyEntry {
  id: string;
  sourcePrayerRequestId?: string;
  title: string;
  type: "answered-prayer" | "growth-story";
  author: string;
  timeframe: string;
  summary: string;
  story: string;
  scripture: string;
  createdAt?: string;
  nextStep: {
    label: string;
    href: string;
  };
}

export const testimonyEntries: TestimonyEntry[] = [
  {
    id: "testimony-open-doors",
    title: "God opened a door after months of uncertainty",
    type: "answered-prayer",
    author: "Leah",
    timeframe: "Shared this month",
    summary:
      "After a long season of waiting and repeated closed doors, a clear work opportunity finally came through.",
    story:
      "For several months, Leah prayed for wisdom, peace, and provision while navigating unemployment. She asked close friends to pray specifically that God would provide the right role and guard her from panic. After a difficult stretch of silence, an unexpected opportunity opened through a prior connection. The answer did not arrive on her preferred timeline, but it came with unusual clarity and peace. Her testimony is less about a fast fix and more about learning that God was not absent in the waiting.",
    scripture: "Philippians 4:6-7",
    nextStep: {
      label: "Share a prayer request",
      href: "/user/prayer-requests",
    },
  },
  {
    id: "testimony-slower-heart",
    title: "Scripture helped reshape an anxious week",
    type: "growth-story",
    author: "Marcus",
    timeframe: "Shared this week",
    summary:
      "A recurring cycle of anxiety began to change through a steadier rhythm of prayer and repeated Scripture meditation.",
    story:
      "Marcus noticed that his stress responses were becoming almost automatic. Instead of trying to overpower them with willpower, he started returning every morning to a short passage, one written prayer, and one honest request. Over time, the change was not dramatic all at once, but real: he became slower to spiral, quicker to pray, and more aware of God's nearness in the middle of pressure. The growth was quiet, but unmistakable.",
    scripture: "Isaiah 26:3",
    nextStep: {
      label: "Start a topic plan",
      href: "/reading-plans/topics/anxiety-and-peace",
    },
  },
  {
    id: "testimony-family-prayer",
    title: "A family prayer rhythm became consistent again",
    type: "answered-prayer",
    author: "Naomi",
    timeframe: "Shared this season",
    summary:
      "What started as a simple prayer for consistency turned into a renewed family habit of reading and praying together.",
    story:
      "Naomi had been praying that faith would feel more visible in everyday family life, not only at church. She and her household started with one short reading and one prayer at dinner a few nights a week. At first it felt fragile and easy to skip, but over time it became part of the normal rhythm of the home. The answered prayer was not just that everyone participated, but that the atmosphere of the home itself felt steadier and more open to spiritual conversations.",
    scripture: "Deuteronomy 6:6-7",
    nextStep: {
      label: "Open daily devotional",
      href: "/devotionals/daily",
    },
  },
  {
    id: "testimony-forgiveness-step",
    title: "One act of forgiveness changed the tone of a relationship",
    type: "growth-story",
    author: "Sarah",
    timeframe: "Shared recently",
    summary:
      "A season of resentment began to loosen when grace became more than a concept and turned into one concrete act of obedience.",
    story:
      "Sarah had been carrying hurt from a relationship that felt difficult to repair. Through consistent prayer and Scripture, she realized that she had been waiting to feel ready before obeying. The turning point came when she chose one small step of humble reconciliation. Not every problem disappeared, but the grip of bitterness weakened. Her story is a reminder that growth often looks like ordinary obedience practiced before the emotions fully catch up.",
    scripture: "Ephesians 4:31-32",
    nextStep: {
      label: "Study forgiveness",
      href: "/topics/forgiveness",
    },
  },
];

export function getTestimonyEntries() {
  return [...testimonyEntries];
}
