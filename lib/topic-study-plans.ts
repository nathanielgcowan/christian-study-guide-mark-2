export interface TopicStudyPlanDay {
  day: number;
  title: string;
  reference: string;
  focus: string;
  reflection: string;
  prayer: string;
}

export interface TopicStudyPlan {
  slug: string;
  title: string;
  summary: string;
  description: string;
  durationLabel: string;
  days: number;
  theme: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  relatedTopicSlug?: string;
  outcomes: string[];
  daysList: TopicStudyPlanDay[];
}

export const topicStudyPlans: TopicStudyPlan[] = [
  {
    slug: "anxiety-and-peace",
    title: "Anxiety and Peace",
    summary: "A 7-day Scripture track for handing fear to God and learning steadier trust.",
    description:
      "Move through key passages on anxiety, God's care, and practiced trust with one focused reading, reflection, and prayer each day.",
    durationLabel: "7 days",
    days: 7,
    theme: "Anxiety",
    difficulty: "Beginner",
    relatedTopicSlug: "anxiety",
    outcomes: [
      "Turn recurring anxieties into specific prayers.",
      "Build a clearer theology of God's care and nearness.",
      "Finish the week with a practical plan for peace-shaped habits.",
    ],
    daysList: [
      { day: 1, title: "Bring anxiety into prayer", reference: "Philippians 4:6-7", focus: "See how prayer and thanksgiving confront anxiety.", reflection: "What worry needs to be named plainly before God today?", prayer: "Ask God to guard your heart and mind with His peace." },
      { day: 2, title: "Consider the Father's care", reference: "Matthew 6:25-34", focus: "Watch Jesus address anxious striving.", reflection: "Where are you carrying tomorrow before living faithfully today?", prayer: "Pray for daily bread trust instead of future-focused fear." },
      { day: 3, title: "Fear and trust", reference: "Psalm 56", focus: "Learn David's pattern of honesty and confidence.", reflection: "What happens when fear is met with remembered truth?", prayer: "Tell God exactly what you fear and choose trust in response." },
      { day: 4, title: "Stayed on God", reference: "Isaiah 26:3-4", focus: "Peace grows where the mind is fixed on the Lord.", reflection: "What keeps pulling your thoughts away from Godward trust?", prayer: "Ask for a steadier inner life rooted in God's unchanging character." },
      { day: 5, title: "Cast your cares", reference: "1 Peter 5:6-11", focus: "Humility and trust go together when burdens are handed over.", reflection: "What burden have you been carrying as if it all depends on you?", prayer: "Cast your care on God because He cares for you." },
      { day: 6, title: "Peace in troubled hearts", reference: "John 14:1-7", focus: "Jesus speaks peace into unsettled hearts.", reflection: "How does Christ Himself become the answer to your unrest?", prayer: "Pray for confidence in Christ's presence and promises." },
      { day: 7, title: "A practiced response", reference: "Psalm 27", focus: "End by choosing one fear-facing pattern of trust and worship.", reflection: "What concrete rhythm will help you respond biblically when anxiety rises next week?", prayer: "Ask God to make trust your reflex in anxious moments." },
    ],
  },
  {
    slug: "deeper-prayer",
    title: "Deeper Prayer",
    summary: "A 7-day guided plan for learning prayer through Scripture, worship, and persistence.",
    description:
      "This track helps readers move beyond rushed requests into biblical, honest, and persevering prayer.",
    durationLabel: "7 days",
    days: 7,
    theme: "Prayer",
    difficulty: "Beginner",
    relatedTopicSlug: "prayer",
    outcomes: [
      "Grow more fluent in praying Scripture.",
      "Recover honesty, worship, and persistence in prayer.",
      "Finish with a repeatable prayer rhythm for ordinary days.",
    ],
    daysList: [
      { day: 1, title: "Jesus teaches prayer", reference: "Matthew 6:9-13", focus: "Start with the shape of the Lord's Prayer.", reflection: "Which part of Jesus' model feels most neglected in your own praying?", prayer: "Pray slowly through each movement of the Lord's Prayer." },
      { day: 2, title: "Pour out your heart", reference: "Psalm 62", focus: "Prayer includes refuge, honesty, and trust.", reflection: "What have you been carrying without really bringing it before God?", prayer: "Pour out your heart before God with directness and trust." },
      { day: 3, title: "Ask and keep asking", reference: "Luke 11:1-13", focus: "Jesus connects prayer to confidence in the Father's goodness.", reflection: "Where have you become passive rather than persistent in prayer?", prayer: "Ask boldly, knowing the Father gives good gifts." },
      { day: 4, title: "Prayer with thanksgiving", reference: "Philippians 4:4-9", focus: "Prayer reshapes the inner life when gratitude is present.", reflection: "How does thanksgiving change the emotional tone of your requests?", prayer: "Bring requests with explicit gratitude today." },
      { day: 5, title: "The Spirit helps", reference: "Romans 8:26-27", focus: "God helps when prayer feels weak or wordless.", reflection: "Where do you feel inadequate or stuck in prayer right now?", prayer: "Ask the Spirit to help your weakness and align your desires to God's will." },
      { day: 6, title: "Watch and remain", reference: "Colossians 4:2-6", focus: "Prayerfulness and daily witness belong together.", reflection: "How might watchful prayer change the way you move through ordinary interactions?", prayer: "Pray for alertness, gratitude, and open doors for gospel conversations." },
      { day: 7, title: "Abide in Christ", reference: "John 15:1-11", focus: "Prayer grows where communion with Christ deepens.", reflection: "What simple habit would help you remain in Christ and pray more steadily?", prayer: "Ask for fruit that grows from abiding, not striving." },
    ],
  },
  {
    slug: "hope-in-grief",
    title: "Hope in Grief",
    summary: "A 7-day biblical pathway for lament, comfort, and resurrection hope.",
    description:
      "This plan helps readers grieve honestly without losing sight of God's presence, compassion, and promised hope.",
    durationLabel: "7 days",
    days: 7,
    theme: "Grief",
    difficulty: "Beginner",
    outcomes: [
      "Make room for lament instead of suppressing sorrow.",
      "See how Scripture holds grief and hope together.",
      "Find language for loss that remains anchored in God.",
    ],
    daysList: [
      { day: 1, title: "God hears lament", reference: "Psalm 13", focus: "Scripture gives words for grief that feels unanswered.", reflection: "What loss or sadness are you hesitant to say plainly before God?", prayer: "Bring your grief to God without editing it down." },
      { day: 2, title: "A man of sorrows", reference: "Isaiah 53:3-5", focus: "Christ is not distant from suffering and sorrow.", reflection: "How does Jesus' suffering change the way you think about your own grief?", prayer: "Thank Christ for drawing near as the suffering Savior." },
      { day: 3, title: "Jesus wept", reference: "John 11:17-44", focus: "Jesus enters sorrow personally even while holding resurrection power.", reflection: "What stands out about the way Jesus responds to grief in this passage?", prayer: "Ask for comfort from the One who weeps and raises the dead." },
      { day: 4, title: "New mercies in sorrow", reference: "Lamentations 3:19-26", focus: "Hope can coexist with deep affliction.", reflection: "What truth in this passage helps sorrow not become final despair?", prayer: "Pray for mercy that is new enough for today's grief." },
      { day: 5, title: "Comforted to comfort", reference: "2 Corinthians 1:3-7", focus: "God meets people in affliction and uses that comfort relationally.", reflection: "How has suffering changed the way you can now care for others?", prayer: "Ask God to bring real comfort and compassionate endurance." },
      { day: 6, title: "No separation", reference: "Romans 8:31-39", focus: "Loss is real, but it does not sever believers from Christ's love.", reflection: "What does this passage say remains true even when life feels painfully broken?", prayer: "Hold grief inside the stronger reality of God's love in Christ." },
      { day: 7, title: "Resurrection hope", reference: "1 Thessalonians 4:13-18", focus: "Christian grief is not hopeless grief.", reflection: "How does resurrection reshape the future horizon of sorrow?", prayer: "Ask God to steady your sorrow with resurrection hope." },
    ],
  },
  {
    slug: "marriage-in-grace",
    title: "Marriage in Grace",
    summary: "A 7-day study plan for covenant love, service, unity, and Christ-shaped marriage.",
    description:
      "This guided track helps husbands and wives reflect on marriage through gospel love, humility, communication, and prayer.",
    durationLabel: "7 days",
    days: 7,
    theme: "Marriage",
    difficulty: "Intermediate",
    outcomes: [
      "See marriage through the lens of covenant love and service.",
      "Identify one concrete way to love, listen, and forgive more intentionally.",
      "End with a shared prayer and next step for your relationship.",
    ],
    daysList: [
      { day: 1, title: "A covenant beginning", reference: "Genesis 2:18-25", focus: "Marriage begins with God's design for companionship and covenant union.", reflection: "What does this passage say marriage is meant to hold together?", prayer: "Thank God for His design and ask for grace to honor it." },
      { day: 2, title: "Love like Christ", reference: "Ephesians 5:21-33", focus: "Christ's love sets the tone for marital love and service.", reflection: "What part of Christlike love feels most needed in your marriage right now?", prayer: "Ask for self-giving love shaped by the gospel." },
      { day: 3, title: "Compassion and patience", reference: "Colossians 3:12-17", focus: "Marriage needs practiced kindness, patience, and forgiveness.", reflection: "Where is resentment or impatience crowding out grace?", prayer: "Pray for tenderhearted speech and a forgiving posture." },
      { day: 4, title: "Listening and restraint", reference: "James 1:19-27", focus: "Slow speech and attentive listening are deeply spiritual disciplines.", reflection: "How would being quicker to hear change the emotional climate of your relationship?", prayer: "Ask for wisdom to listen before reacting." },
      { day: 5, title: "Serve one another", reference: "Philippians 2:1-11", focus: "Humility is not weakness; it is Christlike strength.", reflection: "Where is self-protection blocking sacrificial love?", prayer: "Pray for the mind of Christ in everyday interactions." },
      { day: 6, title: "Pray together", reference: "1 Peter 3:1-9", focus: "Marriage is shaped by honor, understanding, and shared dependence on God.", reflection: "What would more intentional shared prayer change in your marriage?", prayer: "Ask God to deepen unity, honor, and spiritual partnership." },
      { day: 7, title: "Build on the rock", reference: "Matthew 7:24-27", focus: "End by grounding marriage in hearing and doing Jesus' words.", reflection: "What one concrete obedience step should define this next week?", prayer: "Ask God to make your home steadier through obedient faith." },
    ],
  },
  {
    slug: "spiritual-disciplines",
    title: "Spiritual Disciplines for Daily Formation",
    summary: "A 10-day formation plan around Scripture, prayer, worship, generosity, rest, and obedience.",
    description:
      "This plan helps readers build a sustainable rhythm of grace-shaped disciplines that move faith from intention into practice.",
    durationLabel: "10 days",
    days: 10,
    theme: "Formation",
    difficulty: "Intermediate",
    outcomes: [
      "Connect habits of grace to abiding in Christ instead of self-improvement.",
      "Practice multiple biblical disciplines across ten guided days.",
      "Leave with a simpler, repeatable formation rhythm for ordinary life.",
    ],
    daysList: [
      { day: 1, title: "Delight in the Word", reference: "Psalm 1", focus: "Formation begins with a life rooted in God's Word.", reflection: "What currently shapes your mind more consistently than Scripture?", prayer: "Ask for delight, not just discipline, in God's Word." },
      { day: 2, title: "Abide and remain", reference: "John 15:1-11", focus: "Spiritual fruit grows from connection to Christ.", reflection: "Where are you trying to force growth without abiding?", prayer: "Ask for a life that remains near Christ." },
      { day: 3, title: "Secret prayer", reference: "Matthew 6:5-18", focus: "Jesus trains His people toward hidden devotion before God.", reflection: "What would a quieter, less performative spiritual life look like?", prayer: "Pray for integrity in secret prayer and fasting." },
      { day: 4, title: "Meditate and obey", reference: "Joshua 1:1-9", focus: "Meditation in Scripture is meant to fuel courageous obedience.", reflection: "What command or promise needs more sustained attention from you?", prayer: "Ask for courage that grows from meditating on God's Word." },
      { day: 5, title: "Sabbath trust", reference: "Mark 2:23-28", focus: "Rest is an act of trust, not laziness.", reflection: "What does your resistance to rest reveal about your heart?", prayer: "Ask God to teach you restful dependence instead of ceaseless proving." },
      { day: 6, title: "Generosity and contentment", reference: "2 Corinthians 9:6-11", focus: "Open-handedness is part of spiritual maturity.", reflection: "Where could generosity loosen fear or self-protection in you?", prayer: "Pray for cheerful generosity rooted in God's provision." },
      { day: 7, title: "Confession and cleansing", reference: "1 John 1:5-10", focus: "Honest confession keeps fellowship with God fresh and unhidden.", reflection: "What would it look like to walk in the light more honestly?", prayer: "Confess sin and receive cleansing through Christ." },
      { day: 8, title: "Gathered worship", reference: "Hebrews 10:19-25", focus: "Formation is not only private; it happens with God's people.", reflection: "How can intentional gathering strengthen your faith right now?", prayer: "Ask for endurance and love that grow in community." },
      { day: 9, title: "Watch your life", reference: "1 Timothy 4:6-16", focus: "Godliness involves training, attention, and perseverance.", reflection: "Which discipline needs renewed attention in this season?", prayer: "Ask for disciplined grace rather than scattered effort." },
      { day: 10, title: "Offer your whole life", reference: "Romans 12:1-2", focus: "End by seeing all of life as worshipful surrender.", reflection: "What one ongoing rhythm will help your whole life stay responsive to God?", prayer: "Offer yourself afresh to God in worship and obedience." },
    ],
  },
];

export function getTopicStudyPlans() {
  return [...topicStudyPlans];
}

export function getTopicStudyPlanBySlug(slug: string) {
  return topicStudyPlans.find((plan) => plan.slug === slug) ?? null;
}

export function getTopicStudyPlanByTopicSlug(topicSlug: string) {
  return topicStudyPlans.find((plan) => plan.relatedTopicSlug === topicSlug) ?? null;
}
