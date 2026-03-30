export interface Devotional {
  id: string;
  date: string;
  title: string;
  verse: {
    text: string;
    reference: string;
  };
  content: string;
  reflection: string[];
  prayer: string;
}

export const devotionals: Devotional[] = [
  {
    id: "faith-in-action",
    date: "2026-03-28",
    title: "Faith in Action",
    verse: {
      text: "Now faith is confidence in what we hope for and assurance about what we do not see.",
      reference: "Hebrews 11:1",
    },
    content: `
Faith is not just intellectual assent to certain truths—it's a living, active trust in God that affects every area of our lives. The Bible tells us that "without faith it is impossible to please God" (Hebrews 11:6), because faith demonstrates our trust in His character and promises.

True faith moves us to action. When we believe God's promises, we step out in obedience, even when the path ahead seems uncertain. Abraham demonstrated this when he left his homeland for an unknown destination, trusting God's guidance. Noah built an ark in faith, even when it seemed foolish to others.

Today, consider where God is calling you to step out in faith. Is there an area of your life where you're holding back because of fear or uncertainty? Remember that God's faithfulness has been proven throughout history, and He will be faithful to you as well.
    `,
    reflection: [
      "What is one area of your life where God is calling you to step out in faith?",
      "How has God proven His faithfulness to you in the past?",
      "What fears are holding you back from obeying God's leading?",
    ],
    prayer:
      "Lord, increase my faith. Help me to trust You completely and step out in obedience to Your calling. Remove the fears that hold me back and fill me with confidence in Your promises. Amen.",
  },
  {
    id: "gods-love",
    date: "2026-03-29",
    title: "The Depth of God's Love",
    verse: {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16",
    },
    content: `
God's love is not like human love. It's not based on our performance, appearance, or worthiness. God's love is unconditional, sacrificial, and eternal. He loved us while we were still sinners, rebelling against Him (Romans 5:8).

This love moved God to send His only Son to die for our sins, offering us forgiveness and reconciliation. Jesus demonstrated this love by laying down His life for us, His friends (John 15:13).

Understanding God's love changes everything. It frees us from the need to earn His approval and allows us to love others with the same selfless love we've received. When we grasp how deeply God loves us, we find security, purpose, and joy.
    `,
    reflection: [
      "How does knowing God's unconditional love change your daily life?",
      "In what ways do you struggle to accept God's love for you?",
      "How can you extend God's love to others today?",
    ],
    prayer:
      "Father, thank You for Your incredible love. Help me to fully accept and embrace Your love for me. Teach me to love others with the same selfless love You've shown me. Amen.",
  },
  {
    id: "prayer-life",
    date: "2026-03-30",
    title: "Developing a Prayer Life",
    verse: {
      text: "Pray without ceasing.",
      reference: "1 Thessalonians 5:17",
    },
    content: `
Prayer is our direct line of communication with God. It's not about using fancy words or following a specific formula—it's about having an honest conversation with our Heavenly Father. Jesus modeled this for us, often withdrawing to pray and teaching His disciples to pray.

A consistent prayer life develops our relationship with God, aligns our will with His, and invites His power into our circumstances. It includes adoration (praising God), confession (admitting sin), thanksgiving (expressing gratitude), and supplication (making requests).

Start small if you need to. Set aside a specific time each day, find a quiet place, and begin with simple prayers. God delights in hearing from His children, no matter how simple or eloquent our words.
    `,
    reflection: [
      "What does your current prayer life look like?",
      "What barriers keep you from praying more consistently?",
      "How can you make prayer a more natural part of your day?",
    ],
    prayer:
      "Lord, teach me to pray. Help me to develop a consistent prayer life and to experience the joy of communicating with You. Draw me closer to Your heart. Amen.",
  },
  {
    id: "holy-spirit",
    date: "2026-03-31",
    title: "The Holy Spirit's Work in Us",
    verse: {
      text: "And I will ask the Father, and he will give you another advocate to help you and be with you forever.",
      reference: "John 14:16",
    },
    content: `
The Holy Spirit is not just a theological concept—He's a Person who lives within every believer. Jesus promised that after His departure, the Father would send the Holy Spirit to be our Helper, Teacher, and Guide.

The Spirit convicts us of sin, leads us to salvation, indwells us at conversion, and empowers us for service. He produces spiritual fruit in our lives (love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control) and distributes spiritual gifts for building up the church.

Learning to walk in the Spirit means yielding to His leading, obeying His promptings, and allowing Him to transform us into Christ's image. The Spirit's presence is God's guarantee that we belong to Him and that He will complete the work He began in us.
    `,
    reflection: [
      "How have you experienced the Holy Spirit's work in your life?",
      "What spiritual fruit is the Holy Spirit developing in you right now?",
      "How can you be more sensitive to the Spirit's leading?",
    ],
    prayer:
      "Holy Spirit, fill me afresh today. Help me to be aware of Your presence and responsive to Your leading. Produce Your fruit in my life and use me for Your purposes. Amen.",
  },
  {
    id: "gods-word",
    date: "2026-04-01",
    title: "The Power of God's Word",
    verse: {
      text: "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.",
      reference: "Hebrews 4:12",
    },
    content: `
The Bible is not just an ancient book—it's living and active, sharper than any two-edged sword. God's Word has the power to penetrate our deepest thoughts and motivations, revealing truth and bringing transformation.

Regular engagement with Scripture changes us. It renews our minds (Romans 12:2), guides our decisions, strengthens our faith, and equips us for every good work (2 Timothy 3:16-17). The psalmist described God's Word as a lamp to guide our feet and a light for our path (Psalm 119:105).

Make Bible reading a daily habit. Approach it with an open heart, asking the Holy Spirit to illuminate the truth and apply it to your life. God's Word is your spiritual nourishment—don't neglect it.
    `,
    reflection: [
      "How has God's Word impacted your life recently?",
      "What is your current Bible reading habit?",
      "How can you make Scripture study more meaningful?",
    ],
    prayer:
      "Lord, help me to love Your Word and apply it to my life. Open my eyes to see wonderful things in Your law. Let Your Word be a lamp to my feet and a light to my path. Amen.",
  },
];

export function getDevotionalByDate(date: string) {
  return devotionals.find((entry) => entry.date === date) ?? null;
}

export function getLatestDevotional() {
  return [...devotionals].sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

export function getDailyDevotional(date: string) {
  const exact = getDevotionalByDate(date);
  if (exact) {
    return exact;
  }

  const eligible = [...devotionals]
    .filter((entry) => entry.date <= date)
    .sort((a, b) => b.date.localeCompare(a.date));

  return eligible[0] ?? getLatestDevotional();
}
