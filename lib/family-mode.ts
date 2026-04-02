export interface FamilyPlanDay {
  day: number;
  reading: string;
  parentPrompt: string;
  childPrompt: string;
  prayerFocus: string;
}

export interface FamilyPlan {
  id: string;
  title: string;
  summary: string;
  cadence: string;
  durationDays: number;
  days: FamilyPlanDay[];
}

export interface FamilyMemoryVerse {
  id: string;
  reference: string;
  text: string;
  parentCue: string;
  childCue: string;
}

export const familyPlans: FamilyPlan[] = [
  {
    id: "family-gospel-rhythm",
    title: "Family Gospel Rhythm",
    summary:
      "A gentle 5-day household reading plan that helps parents and children talk about Jesus together.",
    cadence: "5 days",
    durationDays: 5,
    days: [
      {
        day: 1,
        reading: "John 1",
        parentPrompt: "What does this chapter show about who Jesus is before He begins His ministry?",
        childPrompt: "What do you notice about Jesus in this story?",
        prayerFocus: "Thank God for sending Jesus and ask for clear eyes to see Him.",
      },
      {
        day: 2,
        reading: "Mark 4",
        parentPrompt: "How does Jesus reveal both authority and care in this chapter?",
        childPrompt: "What part of the story would have made you feel safe or surprised?",
        prayerFocus: "Pray for trust when life feels noisy or uncertain.",
      },
      {
        day: 3,
        reading: "Luke 15",
        parentPrompt: "How does the Father's welcome shape the tone of discipleship at home?",
        childPrompt: "What does this story teach about coming back to God?",
        prayerFocus: "Thank God for mercy and ask for humble hearts that return quickly.",
      },
      {
        day: 4,
        reading: "John 13",
        parentPrompt: "How can servant-hearted love become visible in the household this week?",
        childPrompt: "How can you show love at home today?",
        prayerFocus: "Ask for a home marked by love, service, and patience.",
      },
      {
        day: 5,
        reading: "Matthew 28",
        parentPrompt: "What does it look like to disciple your household with steadiness instead of pressure?",
        childPrompt: "What do you want to remember about following Jesus?",
        prayerFocus: "Pray for courage to keep walking with Jesus together.",
      },
    ],
  },
  {
    id: "psalms-at-home",
    title: "Psalms at Home",
    summary:
      "A 4-day family rhythm for prayer, worship, and honest conversation through the Psalms.",
    cadence: "4 days",
    durationDays: 4,
    days: [
      {
        day: 1,
        reading: "Psalm 23",
        parentPrompt: "How does this Psalm calm the tone of the home and teach trust?",
        childPrompt: "What does it mean that God is like a shepherd?",
        prayerFocus: "Ask God to lead your family with peace and care.",
      },
      {
        day: 2,
        reading: "Psalm 27",
        parentPrompt: "What fears need to be brought honestly to God as a household?",
        childPrompt: "What should we ask God for when we feel afraid?",
        prayerFocus: "Pray for courage and confidence in God’s nearness.",
      },
      {
        day: 3,
        reading: "Psalm 100",
        parentPrompt: "How can gratitude become more visible in your everyday routines?",
        childPrompt: "What are three things you can thank God for today?",
        prayerFocus: "Thank God together for simple mercies and daily care.",
      },
      {
        day: 4,
        reading: "Psalm 121",
        parentPrompt: "How does this Psalm steady anxious hearts in the family?",
        childPrompt: "Who helps us and watches over us?",
        prayerFocus: "Ask God to watch over each member of the household.",
      },
    ],
  },
];

export const familyMemoryVerses: FamilyMemoryVerse[] = [
  {
    id: "family-joshua-1-9",
    reference: "Joshua 1:9",
    text: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.",
    parentCue: "Talk about courage in daily pressures and how God's presence steadies the home.",
    childCue: "Repeat the words 'strong and courageous' together and connect them to school, friends, or bedtime fears.",
  },
  {
    id: "family-psalm-119-105",
    reference: "Psalm 119:105",
    text: "Your word is a lamp to my feet and a light to my path.",
    parentCue: "Use this verse to frame why your family keeps returning to Scripture.",
    childCue: "Ask what it means for God's Word to be like a flashlight for life.",
  },
  {
    id: "family-ephesians-4-32",
    reference: "Ephesians 4:32",
    text: "Be kind to one another, tenderhearted, forgiving each other, just as God also in Christ forgave you.",
    parentCue: "Connect family correction and reconciliation to the grace you've received in Christ.",
    childCue: "Practice saying one kind thing and one forgiving thing this week.",
  },
];
