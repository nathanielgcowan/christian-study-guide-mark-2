export interface GroupPrayerItem {
  id: string;
  author: string;
  text: string;
  status: "active" | "answered";
  createdAt: string;
}

export interface GroupAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  status: "open" | "done";
}

export interface GroupAttendanceRecord {
  id: string;
  memberName: string;
  status: "present" | "absent" | "follow-up";
  notedAt: string;
}

export interface GroupDiscussionThreadReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface GroupDiscussionThread {
  id: string;
  author: string;
  topic: string;
  text: string;
  createdAt: string;
  replies: GroupDiscussionThreadReply[];
}

export interface GroupWeeklyPlan {
  weekLabel: string;
  focus: string;
  reading: string;
  memoryVerse: string;
  goal: string;
  meetingPlan: string[];
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
  assignedReading: string;
  leaderPrompt: string;
  discussionQuestions: string[];
  prayerItems: GroupPrayerItem[];
  leaderAssignments: GroupAssignment[];
  attendanceRecords: GroupAttendanceRecord[];
  discussionThreads: GroupDiscussionThread[];
  weeklyPlan: GroupWeeklyPlan;
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
    assignedReading: "John 15",
    leaderPrompt:
      "Keep the discussion centered on abiding in Christ and what fruitfulness looks like in ordinary obedience.",
    discussionQuestions: [
      "What does Jesus say a fruitful life depends on in this passage?",
      "Where do you see encouragement, warning, or invitation here?",
      "What should the group pray in response to this chapter?",
    ],
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
    leaderAssignments: [
      {
        id: "assignment-1",
        title: "Open in prayer",
        description: "Prepare a 3-minute opening prayer around abiding and fruitfulness.",
        dueDate: "2026-04-05",
        assignee: "Sarah",
        status: "open",
      },
      {
        id: "assignment-2",
        title: "Follow-up text",
        description: "Send the discussion recap and John 15 prompt to the group after the meeting.",
        dueDate: "2026-04-05",
        assignee: "Marcus",
        status: "done",
      },
    ],
    attendanceRecords: [
      {
        id: "attendance-1",
        memberName: "Sarah",
        status: "present",
        notedAt: "2026-03-30T18:00:00.000Z",
      },
      {
        id: "attendance-2",
        memberName: "Marcus",
        status: "follow-up",
        notedAt: "2026-03-30T18:00:00.000Z",
      },
    ],
    discussionThreads: [
      {
        id: "thread-1",
        author: "Leah",
        topic: "Abiding practically",
        text: "What does abiding in Christ look like when the week is overloaded and distracted?",
        createdAt: "2026-03-29T15:00:00.000Z",
        replies: [
          {
            id: "reply-1",
            author: "Sarah",
            text: "I’m planning to start each day with the assigned reading before checking messages.",
            createdAt: "2026-03-29T18:15:00.000Z",
          },
        ],
      },
    ],
    weeklyPlan: {
      weekLabel: "Week of April 5",
      focus: "Abide and bear fruit",
      reading: "John 15",
      memoryVerse: "John 15:5",
      goal: "Help every member name one way to remain in Christ this week.",
      meetingPlan: [
        "Welcome and opening prayer",
        "Read John 15 aloud together",
        "Work through one discussion question",
        "Pair up for prayer and one action step",
      ],
    },
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
    assignedReading: "Philippians 4",
    leaderPrompt:
      "Guide the group toward honest prayer and specific thanksgiving instead of vague updates.",
    discussionQuestions: [
      "What does this passage teach about anxiety and prayer?",
      "How can the group help one another respond in faith this week?",
      "What answered prayers should be named and celebrated?",
    ],
    prayerItems: [
      {
        id: "prayer-3",
        author: "Naomi",
        text: "Wisdom for a hard work decision this week.",
        status: "active",
        createdAt: "2026-03-28T08:15:00.000Z",
      },
    ],
    leaderAssignments: [
      {
        id: "assignment-3",
        title: "Gather updates",
        description: "Check in with each member before Friday and bring one follow-up point.",
        dueDate: "2026-04-04",
        assignee: "Naomi",
        status: "open",
      },
    ],
    attendanceRecords: [
      {
        id: "attendance-3",
        memberName: "Naomi",
        status: "present",
        notedAt: "2026-03-28T19:00:00.000Z",
      },
    ],
    discussionThreads: [
      {
        id: "thread-2",
        author: "Daniel",
        topic: "Specific thanksgiving",
        text: "How do you keep prayer updates from staying vague?",
        createdAt: "2026-03-28T20:00:00.000Z",
        replies: [],
      },
    ],
    weeklyPlan: {
      weekLabel: "Week of April 4",
      focus: "Prayer with thanksgiving",
      reading: "Philippians 4",
      memoryVerse: "Philippians 4:6-7",
      goal: "Move every update toward both specific requests and specific gratitude.",
      meetingPlan: [
        "Share one burden and one answered prayer",
        "Read Philippians 4:4-9",
        "Discuss anxiety, thanksgiving, and peace",
        "Close with paired prayer",
      ],
    },
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
    assignedReading: "John 1",
    leaderPrompt:
      "Keep the tone welcoming and clear, assuming some readers are opening the Bible seriously for the first time.",
    discussionQuestions: [
      "What stands out about Jesus in this reading?",
      "What new word, idea, or promise needs more explanation?",
      "What is one simple next step of faith after this session?",
    ],
    prayerItems: [
      {
        id: "prayer-4",
        author: "Leah",
        text: "Confidence in reading the Bible for the first time.",
        status: "active",
        createdAt: "2026-03-27T15:45:00.000Z",
      },
    ],
    leaderAssignments: [
      {
        id: "assignment-4",
        title: "Welcome follow-up",
        description: "Message new members with this week’s reading and memory verse.",
        dueDate: "2026-04-03",
        assignee: "Leah",
        status: "open",
      },
    ],
    attendanceRecords: [
      {
        id: "attendance-4",
        memberName: "Leah",
        status: "present",
        notedAt: "2026-03-27T18:00:00.000Z",
      },
    ],
    discussionThreads: [
      {
        id: "thread-3",
        author: "Jordan",
        topic: "Beginning the Bible",
        text: "What helped you not feel overwhelmed when you first started reading Scripture?",
        createdAt: "2026-03-27T19:20:00.000Z",
        replies: [],
      },
    ],
    weeklyPlan: {
      weekLabel: "Week of April 1",
      focus: "Meet Jesus in John 1",
      reading: "John 1",
      memoryVerse: "John 1:12",
      goal: "Help each new believer name who Jesus is and one step of response.",
      meetingPlan: [
        "Welcome and brief introductions",
        "Read John 1:1-18 together",
        "Explain two or three key words simply",
        "Pray for confidence and understanding",
      ],
    },
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
    assignedReading: input.focus || "John 1",
    leaderPrompt:
      "Use this space to guide the group toward Scripture, honest discussion, and practical follow-up.",
    discussionQuestions: [
      "What stands out most clearly in the reading?",
      "How should this shape prayer or obedience this week?",
      "What does the group need to remember before the next meeting?",
    ],
    prayerItems: [],
    leaderAssignments: [],
    attendanceRecords: [],
    discussionThreads: [],
    weeklyPlan: {
      weekLabel: "This week",
      focus: input.focus || "Shared study",
      reading: input.focus || "John 1",
      memoryVerse: "Psalm 119:105",
      goal: "Set one clear shared reading and one concrete next step.",
      meetingPlan: [
        "Open in prayer",
        "Read the assigned text",
        "Discuss one question",
        "Close with prayer and follow-up",
      ],
    },
  };

  groups.unshift(nextGroup);
  return nextGroup;
}

export function addPrayerItem(
  slug: string,
  input: { author: string; text: string },
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

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
  if (!group) return null;

  const prayerItem = group.prayerItems.find((item) => item.id === prayerId);
  if (!prayerItem) return null;

  prayerItem.status = status;
  return prayerItem;
}

export function addLeaderAssignment(
  slug: string,
  input: Omit<GroupAssignment, "id" | "status">,
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

  const nextAssignment: GroupAssignment = {
    id: `assignment-${Date.now()}`,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    assignee: input.assignee,
    status: "open",
  };

  group.leaderAssignments.unshift(nextAssignment);
  return nextAssignment;
}

export function updateLeaderAssignmentStatus(
  slug: string,
  assignmentId: string,
  status: GroupAssignment["status"],
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

  const assignment = group.leaderAssignments.find((item) => item.id === assignmentId);
  if (!assignment) return null;

  assignment.status = status;
  return assignment;
}

export function addAttendanceRecord(
  slug: string,
  input: Omit<GroupAttendanceRecord, "id" | "notedAt">,
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

  const nextRecord: GroupAttendanceRecord = {
    id: `attendance-${Date.now()}`,
    memberName: input.memberName,
    status: input.status,
    notedAt: new Date().toISOString(),
  };

  group.attendanceRecords.unshift(nextRecord);
  return nextRecord;
}

export function addDiscussionThread(
  slug: string,
  input: Omit<GroupDiscussionThread, "id" | "createdAt" | "replies">,
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

  const nextThread: GroupDiscussionThread = {
    id: `thread-${Date.now()}`,
    author: input.author,
    topic: input.topic,
    text: input.text,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  group.discussionThreads.unshift(nextThread);
  return nextThread;
}

export function addDiscussionReply(
  slug: string,
  threadId: string,
  input: Omit<GroupDiscussionThreadReply, "id" | "createdAt">,
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

  const thread = group.discussionThreads.find((item) => item.id === threadId);
  if (!thread) return null;

  const nextReply: GroupDiscussionThreadReply = {
    id: `reply-${Date.now()}`,
    author: input.author,
    text: input.text,
    createdAt: new Date().toISOString(),
  };

  thread.replies.push(nextReply);
  return nextReply;
}

export function updateWeeklyPlan(
  slug: string,
  input: GroupWeeklyPlan,
) {
  const group = findGroupBySlug(slug);
  if (!group) return null;

  group.weeklyPlan = input;
  group.assignedReading = input.reading;
  group.nextStep = `${input.goal} Review ${input.reading} before the next meeting.`;
  return group.weeklyPlan;
}
