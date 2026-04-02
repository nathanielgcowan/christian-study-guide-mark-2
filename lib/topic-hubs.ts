export interface TopicHub {
  slug: string;
  title: string;
  summary: string;
  lead: string;
  theme: string;
  keyVerses: string[];
  readingPath: string[];
  reflectionPrompts: string[];
  prayerFocus: string[];
  relatedTools: Array<{
    label: string;
    href: string;
    description: string;
  }>;
}

export const topicHubs: TopicHub[] = [
  {
    slug: "anxiety",
    title: "Anxiety and Peace",
    summary:
      "A guided study path for readers who need biblical anchors for fear, restlessness, and trust in God's care.",
    lead:
      "This topic hub gathers passages, prompts, and next steps that help move anxious thoughts toward prayer, trust, and steadier peace in Christ.",
    theme: "Peace",
    keyVerses: ["Philippians 4:6-7", "Matthew 6:25-34", "Psalm 56:3", "Isaiah 26:3"],
    readingPath: ["Philippians 4", "Matthew 6", "Psalm 27", "1 Peter 5"],
    reflectionPrompts: [
      "What specific anxiety is this passage inviting you to hand over to God?",
      "What does this text reveal about God's care, nearness, or authority?",
      "What would trust look like today in one practical step?",
    ],
    prayerFocus: [
      "Name your fear honestly before God instead of staying vague.",
      "Ask for peace that guards both mind and heart.",
      "Pray for a slower, steadier confidence in God's care.",
    ],
    relatedTools: [
      { label: "Open prayer requests", href: "/user/prayer-requests", description: "Keep concerns visible in prayer." },
      { label: "Read devotionals", href: "/devotionals", description: "Stay in short daily encouragement." },
      { label: "Start memory review", href: "/scripture-memory", description: "Carry peace-shaping verses through the week." },
    ],
  },
  {
    slug: "forgiveness",
    title: "Forgiveness and Mercy",
    summary:
      "A biblical pathway for receiving God's forgiveness and learning to extend mercy toward others.",
    lead:
      "These passages help readers slow down around grace, repentance, reconciliation, and the costly mercy reflected in the gospel.",
    theme: "Mercy",
    keyVerses: ["Ephesians 4:31-32", "Colossians 3:12-14", "Psalm 103:8-12", "Matthew 18:21-35"],
    readingPath: ["Psalm 51", "Matthew 18", "Luke 15", "Ephesians 4"],
    reflectionPrompts: [
      "Where do you need to receive grace before trying to extend it?",
      "What does this passage show about God's posture toward repentant sinners?",
      "Is there a next step toward confession, release, or reconciliation?",
    ],
    prayerFocus: [
      "Confess resentment or bitterness honestly.",
      "Thank God for mercy already shown in Christ.",
      "Ask for courage to forgive where obedience feels costly.",
    ],
    relatedTools: [
      { label: "Study a passage", href: "/passage/Ephesians%204%3A32", description: "Go deeper into a key forgiveness verse." },
      { label: "Open journal", href: "/journal", description: "Write prayers and honest observations." },
      { label: "Browse dictionary", href: "/dictionary/grace", description: "Follow the language of grace and mercy." },
    ],
  },
  {
    slug: "prayer",
    title: "Prayer and Communion with God",
    summary:
      "A topic path for readers who want to deepen prayer through Scripture, honesty, persistence, and worship.",
    lead:
      "This hub helps prayer feel more grounded in the Word by pairing key passages with reflection, follow-up, and practical next steps.",
    theme: "Prayer",
    keyVerses: ["Matthew 6:9-13", "Philippians 4:6-7", "1 Thessalonians 5:17", "Psalm 62:8"],
    readingPath: ["Matthew 6", "Psalm 63", "Luke 11", "Romans 8"],
    reflectionPrompts: [
      "How does this passage shape what prayer is and is not?",
      "What part of your prayer life feels weak, rushed, or absent right now?",
      "How can Scripture give language to what you need to say to God?",
    ],
    prayerFocus: [
      "Pray through one passage instead of only bringing requests.",
      "Ask for persistence in hidden prayer, not just public words.",
      "Bring both worship and need into the same conversation with God.",
    ],
    relatedTools: [
      { label: "Prayer journal", href: "/prayer-journal", description: "Track requests, reflections, and answers." },
      { label: "Dashboard", href: "/dashboard", description: "Keep prayer close to the rest of your study flow." },
      { label: "Daily devotional", href: "/devotionals/daily", description: "Start with a shorter guided reading." },
    ],
  },
  {
    slug: "holiness",
    title: "Holiness and Spiritual Formation",
    summary:
      "A study collection for readers who want to grow in obedience, godliness, and daily formation in Christ.",
    lead:
      "These passages help connect grace and holiness so obedience is seen as Spirit-shaped formation, not bare rule-keeping.",
    theme: "Formation",
    keyVerses: ["1 Peter 1:15-16", "Romans 12:1-2", "Galatians 5:16-25", "John 15:1-8"],
    readingPath: ["Romans 12", "Galatians 5", "John 15", "1 Peter 1"],
    reflectionPrompts: [
      "What habits or desires is this passage confronting or reshaping?",
      "How does holiness here stay connected to grace rather than self-effort alone?",
      "What obedience step should become visible in your week?",
    ],
    prayerFocus: [
      "Ask for deeper love for what pleases God.",
      "Confess where compromise has felt normal.",
      "Pray for fruit that comes from abiding in Christ.",
    ],
    relatedTools: [
      { label: "Reading plans", href: "/reading-plans", description: "Build a steadier formation rhythm." },
      { label: "Scripture memory", href: "/scripture-memory", description: "Keep shaping passages in front of you." },
      { label: "Resources", href: "/resources", description: "Find books and study material for deeper formation." },
    ],
  },
  {
    slug: "identity-in-christ",
    title: "Identity in Christ",
    summary:
      "A pathway for studying who believers are in Christ and how the gospel reshapes security, belonging, and purpose.",
    lead:
      "This hub helps readers move from vague encouragement into biblical clarity about adoption, union with Christ, and new life.",
    theme: "Identity",
    keyVerses: ["2 Corinthians 5:17", "Ephesians 1:3-14", "Romans 8:14-17", "Colossians 3:1-4"],
    readingPath: ["Ephesians 1", "Romans 8", "Colossians 3", "John 1"],
    reflectionPrompts: [
      "Which truth here most directly challenges fear, shame, or insecurity?",
      "How does union with Christ change the way you think about yourself?",
      "What daily lie is this passage helping you replace?",
    ],
    prayerFocus: [
      "Thank God for adoption and belonging in Christ.",
      "Ask for greater confidence in the gospel's verdict over your life.",
      "Pray that identity in Christ would shape your next decision or relationship.",
    ],
    relatedTools: [
      { label: "Open passage study", href: "/passage/Ephesians%201%3A3", description: "Study a key identity passage in depth." },
      { label: "Browse characters", href: "/characters", description: "Trace identity and calling through biblical lives." },
      { label: "Verse generator", href: "/user/verse-generator", description: "Turn a key verse into something visible and shareable." },
    ],
  },
];

export function getTopicHubs() {
  return [...topicHubs];
}

export function getTopicHubBySlug(slug: string) {
  return topicHubs.find((hub) => hub.slug === slug) ?? null;
}
