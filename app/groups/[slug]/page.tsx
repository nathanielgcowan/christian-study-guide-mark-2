"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PrayerItem {
  id: string;
  author: string;
  text: string;
  status: "active" | "answered";
  createdAt: string;
}

interface GroupOnlyPrayerRequest {
  id: string;
  title: string;
  description: string;
  status: "active" | "answered";
  createdAt: string;
  updatedAt?: string;
  visibility?: "private" | "group" | "public";
  groupSlug?: string | null;
}

interface GroupAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignee: string;
  status: "open" | "done";
}

interface AttendanceRecord {
  id: string;
  memberName: string;
  status: "present" | "absent" | "follow-up";
  notedAt: string;
}

interface ThreadReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface DiscussionThread {
  id: string;
  author: string;
  topic: string;
  text: string;
  createdAt: string;
  replies: ThreadReply[];
}

interface WeeklyPlan {
  weekLabel: string;
  focus: string;
  reading: string;
  memoryVerse: string;
  goal: string;
  meetingPlan: string[];
}

interface Group {
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
  prayerItems: PrayerItem[];
  leaderAssignments: GroupAssignment[];
  attendanceRecords: AttendanceRecord[];
  discussionThreads: DiscussionThread[];
  weeklyPlan: WeeklyPlan;
}

export default function GroupDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [group, setGroup] = useState<Group | null>(null);
  const [groupPrayerFeed, setGroupPrayerFeed] = useState<GroupOnlyPrayerRequest[]>([]);

  const [author, setAuthor] = useState("");
  const [prayerText, setPrayerText] = useState("");

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentAssignee, setAssignmentAssignee] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [attendanceName, setAttendanceName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "follow-up">(
    "present",
  );

  const [threadAuthor, setThreadAuthor] = useState("");
  const [threadTopic, setThreadTopic] = useState("");
  const [threadText, setThreadText] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, { author: string; text: string }>>({});

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({
    weekLabel: "",
    focus: "",
    reading: "",
    memoryVerse: "",
    goal: "",
    meetingPlan: ["", "", "", ""],
  });

  useEffect(() => {
    async function load() {
      const [groupResponse, prayerFeedResponse] = await Promise.all([
        fetch(`/api/groups/${slug}`),
        fetch(`/api/user/prayer-requests?scope=mine&groupSlug=${encodeURIComponent(slug)}`),
      ]);

      if (groupResponse.ok) {
        const data = (await groupResponse.json()) as { group: Group };
        setGroup(data.group);
        setWeeklyPlan(data.group.weeklyPlan);
      }

      if (prayerFeedResponse.ok) {
        const data = (await prayerFeedResponse.json()) as {
          prayerRequests: GroupOnlyPrayerRequest[];
        };
        setGroupPrayerFeed(data.prayerRequests);
      } else {
        setGroupPrayerFeed([]);
      }
    }

    void load();
  }, [slug]);

  async function addPrayer() {
    if (!author.trim() || !prayerText.trim() || !group) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "add-prayer",
        author: author.trim(),
        text: prayerText.trim(),
      }),
    });

    if (!response.ok) return;
    const data = (await response.json()) as { prayerItem: PrayerItem };
    setGroup({
      ...group,
      prayerItems: [data.prayerItem, ...group.prayerItems],
    });
    setAuthor("");
    setPrayerText("");
  }

  async function markAnswered(prayerId: string) {
    if (!group) return;
    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "update-status",
        prayerId,
        status: "answered",
      }),
    });

    if (!response.ok) return;

    setGroup({
      ...group,
      prayerItems: group.prayerItems.map((item) =>
        item.id === prayerId ? { ...item, status: "answered" } : item,
      ),
    });
  }

  async function markGroupPrayerAnswered(request: GroupOnlyPrayerRequest) {
    const response = await fetch("/api/user/prayer-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: request.id,
        answered: true,
        visibility: "group",
        groupSlug: slug,
      }),
    });

    if (!response.ok) return;

    setGroupPrayerFeed((current) =>
      current.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "answered",
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  async function addAssignment() {
    if (
      !group ||
      !assignmentTitle.trim() ||
      !assignmentDescription.trim() ||
      !assignmentAssignee.trim() ||
      !assignmentDueDate
    ) {
      return;
    }

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "add-assignment",
        title: assignmentTitle.trim(),
        description: assignmentDescription.trim(),
        assignee: assignmentAssignee.trim(),
        dueDate: assignmentDueDate,
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { assignment: GroupAssignment };
    setGroup({
      ...group,
      leaderAssignments: [data.assignment, ...group.leaderAssignments],
    });
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentAssignee("");
  }

  async function markAssignmentDone(assignmentId: string) {
    if (!group) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "update-assignment-status",
        assignmentId,
        status: "done",
      }),
    });

    if (!response.ok) return;

    setGroup({
      ...group,
      leaderAssignments: group.leaderAssignments.map((item) =>
        item.id === assignmentId ? { ...item, status: "done" } : item,
      ),
    });
  }

  async function addAttendance() {
    if (!group || !attendanceName.trim()) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "add-attendance",
        memberName: attendanceName.trim(),
        attendanceStatus,
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { attendance: AttendanceRecord };
    setGroup({
      ...group,
      attendanceRecords: [data.attendance, ...group.attendanceRecords],
    });
    setAttendanceName("");
    setAttendanceStatus("present");
  }

  async function addThread() {
    if (!group || !threadAuthor.trim() || !threadTopic.trim() || !threadText.trim()) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "add-thread",
        author: threadAuthor.trim(),
        topic: threadTopic.trim(),
        text: threadText.trim(),
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { thread: DiscussionThread };
    setGroup({
      ...group,
      discussionThreads: [data.thread, ...group.discussionThreads],
    });
    setThreadAuthor("");
    setThreadTopic("");
    setThreadText("");
  }

  async function addReply(threadId: string) {
    if (!group) return;
    const draft = replyDrafts[threadId];
    if (!draft?.author.trim() || !draft.text.trim()) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "add-reply",
        threadId,
        author: draft.author.trim(),
        text: draft.text.trim(),
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { reply: ThreadReply };
    setGroup({
      ...group,
      discussionThreads: group.discussionThreads.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: [...thread.replies, data.reply] }
          : thread,
      ),
    });
    setReplyDrafts((current) => ({
      ...current,
      [threadId]: { author: "", text: "" },
    }));
  }

  async function saveWeeklyPlan() {
    if (!group) return;

    const response = await fetch(`/api/groups/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "update-weekly-plan",
        ...weeklyPlan,
        meetingPlan: weeklyPlan.meetingPlan.filter((item) => item.trim().length > 0),
      }),
    });

    if (!response.ok) return;

    setGroup({
      ...group,
      weeklyPlan: {
        ...weeklyPlan,
        meetingPlan: weeklyPlan.meetingPlan.filter((item) => item.trim().length > 0),
      },
      assignedReading: weeklyPlan.reading,
      nextStep: `${weeklyPlan.goal} Review ${weeklyPlan.reading} before the next meeting.`,
    });
  }

  if (!group) {
    return (
      <main className="page-shell content-shell-narrow">
        <section className="content-card">
          <h2>Loading group...</h2>
        </section>
      </main>
    );
  }

  const presentCount = group.attendanceRecords.filter((item) => item.status === "present").length;
  const followUpCount = group.attendanceRecords.filter((item) => item.status === "follow-up").length;
  const openAssignmentsCount = group.leaderAssignments.filter((item) => item.status === "open").length;
  const doneAssignmentsCount = group.leaderAssignments.filter((item) => item.status === "done").length;
  const activePrayerCount = group.prayerItems.filter((item) => item.status === "active").length;
  const answeredPrayerCount = group.prayerItems.filter((item) => item.status === "answered").length;
  const activeGroupOnlyPrayerCount = groupPrayerFeed.filter((item) => item.status === "active").length;
  const discussionReplyCount = group.discussionThreads.reduce(
    (total, thread) => total + thread.replies.length,
    0,
  );
  const latestThread = group.discussionThreads[0] ?? null;

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Group workflow</p>
        <h1>{group.title}</h1>
        <p className="content-lead">{group.description}</p>
        <div className="content-chip-row">
          <span className="content-chip">{group.focus}</span>
          <span className="content-chip">{group.cadence}</span>
          <span className="content-chip">{group.members} members</span>
          <span className="content-chip">{group.discussionThreads.length} threads</span>
        </div>
      </section>

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Leader dashboard</p>
          <h2>Your weekly overview</h2>
        </div>
        <div className="content-grid-three">
          <article className="content-stat">
            <span>Open assignments</span>
            <strong>{openAssignmentsCount}</strong>
          </article>
          <article className="content-stat">
            <span>Attendance follow-up</span>
            <strong>{followUpCount}</strong>
          </article>
          <article className="content-stat">
            <span>Prayer items needing care</span>
            <strong>{activePrayerCount + activeGroupOnlyPrayerCount}</strong>
          </article>
        </div>
        <div className="content-grid-two">
          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Assignments</p>
              <h2>What still needs delegation</h2>
            </div>
            <div className="content-card-note">
              <strong>{openAssignmentsCount} open this week</strong>
              <p>
                {doneAssignmentsCount} completed so far. Keep the most time-sensitive task in front
                of the group before meeting day arrives.
              </p>
            </div>
            {group.leaderAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="content-card-note">
                <strong>
                  {assignment.title} · {assignment.status}
                </strong>
                <p>
                  {assignment.assignee} · due {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Attendance</p>
              <h2>Who may need a touchpoint</h2>
            </div>
            <div className="content-card-note">
              <strong>{presentCount} present recently</strong>
              <p>
                {followUpCount} marked for follow-up. This helps leaders notice people before they
                drift quietly.
              </p>
            </div>
            {group.attendanceRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="content-card-note">
                <strong>
                  {record.memberName} · {record.status}
                </strong>
                <p>{new Date(record.notedAt).toLocaleString()}</p>
              </div>
            ))}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Discussion</p>
              <h2>Conversation activity this week</h2>
            </div>
            <div className="content-card-note">
              <strong>
                {group.discussionThreads.length} thread{group.discussionThreads.length === 1 ? "" : "s"} and{" "}
                {discussionReplyCount} repl{discussionReplyCount === 1 ? "y" : "ies"}
              </strong>
              <p>
                {latestThread
                  ? `Latest topic: ${latestThread.topic}`
                  : "No thread activity yet. A leader prompt can get the conversation moving."}
              </p>
            </div>
            {latestThread ? (
              <div className="content-card-note">
                <strong>{latestThread.author}</strong>
                <p>{latestThread.text}</p>
              </div>
            ) : null}
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Prayer feed</p>
              <h2>Care load across the group</h2>
            </div>
            <div className="content-card-note">
              <strong>
                {activePrayerCount} shared requests and {activeGroupOnlyPrayerCount} group-only requests active
              </strong>
              <p>
                {answeredPrayerCount} local answered updates are already visible, so leaders can celebrate
                while still noticing what needs follow-up.
              </p>
            </div>
            {groupPrayerFeed.slice(0, 2).map((item) => (
              <div key={item.id} className="content-card-note">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </section>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Weekly plan</p>
            <h2>Set the rhythm for this week</h2>
          </div>
          <div className="minimal-form-grid">
            <input
              value={weeklyPlan.weekLabel}
              onChange={(event) => setWeeklyPlan({ ...weeklyPlan, weekLabel: event.target.value })}
              className="minimal-input"
              placeholder="Week of April 7"
            />
            <input
              value={weeklyPlan.focus}
              onChange={(event) => setWeeklyPlan({ ...weeklyPlan, focus: event.target.value })}
              className="minimal-input"
              placeholder="Weekly focus"
            />
            <input
              value={weeklyPlan.reading}
              onChange={(event) => setWeeklyPlan({ ...weeklyPlan, reading: event.target.value })}
              className="minimal-input"
              placeholder="Assigned reading"
            />
            <input
              value={weeklyPlan.memoryVerse}
              onChange={(event) => setWeeklyPlan({ ...weeklyPlan, memoryVerse: event.target.value })}
              className="minimal-input"
              placeholder="Memory verse"
            />
            <textarea
              value={weeklyPlan.goal}
              onChange={(event) => setWeeklyPlan({ ...weeklyPlan, goal: event.target.value })}
              className="minimal-textarea"
              rows={3}
              placeholder="Weekly goal"
            />
            {weeklyPlan.meetingPlan.map((item, index) => (
              <input
                key={`${index}-${item}`}
                value={item}
                onChange={(event) => {
                  const nextMeetingPlan = [...weeklyPlan.meetingPlan];
                  nextMeetingPlan[index] = event.target.value;
                  setWeeklyPlan({ ...weeklyPlan, meetingPlan: nextMeetingPlan });
                }}
                className="minimal-input"
                placeholder={`Meeting step ${index + 1}`}
              />
            ))}
            <button type="button" className="button-primary" onClick={() => void saveWeeklyPlan()}>
              Save weekly plan
            </button>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Current week</p>
            <h2>Leader-ready snapshot</h2>
          </div>
          <div className="content-card-note">
            <strong>{group.weeklyPlan.weekLabel}</strong>
            <p>{group.weeklyPlan.goal}</p>
          </div>
          <div className="content-card-note">
            <strong>Reading</strong>
            <p>{group.weeklyPlan.reading}</p>
          </div>
          <div className="content-card-note">
            <strong>Memory verse</strong>
            <p>{group.weeklyPlan.memoryVerse}</p>
          </div>
          <div className="content-stack">
            {group.weeklyPlan.meetingPlan.map((step) => (
              <div key={step} className="content-card-note">
                <p>{step}</p>
              </div>
            ))}
          </div>
          <div className="content-actions">
            <Link href={`/passage/${encodeURIComponent(group.weeklyPlan.reading)}`} className="button-secondary">
              Open assigned reading
            </Link>
            <Link href="/scripture-memory" className="button-secondary">
              Memory queue
            </Link>
          </div>
        </section>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Leader assignments</p>
            <h2>Delegate the week</h2>
          </div>
          <div className="minimal-form-grid">
            <input
              value={assignmentTitle}
              onChange={(event) => setAssignmentTitle(event.target.value)}
              className="minimal-input"
              placeholder="Assignment title"
            />
            <textarea
              value={assignmentDescription}
              onChange={(event) => setAssignmentDescription(event.target.value)}
              className="minimal-textarea"
              rows={3}
              placeholder="Describe the task"
            />
            <input
              value={assignmentAssignee}
              onChange={(event) => setAssignmentAssignee(event.target.value)}
              className="minimal-input"
              placeholder="Assigned to"
            />
            <input
              type="date"
              value={assignmentDueDate}
              onChange={(event) => setAssignmentDueDate(event.target.value)}
              className="minimal-input"
            />
            <button type="button" className="button-primary" onClick={() => void addAssignment()}>
              Add assignment
            </button>
          </div>
          <div className="content-stack">
            {group.leaderAssignments.map((assignment) => (
              <div key={assignment.id} className="content-card-note">
                <strong>
                  {assignment.title} · {assignment.status}
                </strong>
                <p>{assignment.description}</p>
                <p>
                  {assignment.assignee} · due {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                {assignment.status === "open" ? (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => void markAssignmentDone(assignment.id)}
                  >
                    Mark done
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Attendance</p>
            <h2>Track presence and follow-up</h2>
          </div>
          <div className="content-chip-row">
            <span className="content-chip">{presentCount} present</span>
            <span className="content-chip">{followUpCount} follow-up</span>
          </div>
          <div className="minimal-form-grid">
            <input
              value={attendanceName}
              onChange={(event) => setAttendanceName(event.target.value)}
              className="minimal-input"
              placeholder="Member name"
            />
            <select
              value={attendanceStatus}
              onChange={(event) =>
                setAttendanceStatus(event.target.value as "present" | "absent" | "follow-up")
              }
              className="minimal-select"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="follow-up">Needs follow-up</option>
            </select>
            <button type="button" className="button-primary" onClick={() => void addAttendance()}>
              Log attendance
            </button>
          </div>
          <div className="content-stack">
            {group.attendanceRecords.map((record) => (
              <div key={record.id} className="content-card-note">
                <strong>
                  {record.memberName} · {record.status}
                </strong>
                <p>{new Date(record.notedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Discussion threads</p>
            <h2>Keep the conversation moving between meetings</h2>
          </div>
          <div className="minimal-form-grid">
            <input
              value={threadAuthor}
              onChange={(event) => setThreadAuthor(event.target.value)}
              className="minimal-input"
              placeholder="Your name"
            />
            <input
              value={threadTopic}
              onChange={(event) => setThreadTopic(event.target.value)}
              className="minimal-input"
              placeholder="Thread topic"
            />
            <textarea
              value={threadText}
              onChange={(event) => setThreadText(event.target.value)}
              className="minimal-textarea"
              rows={4}
              placeholder="Start the conversation"
            />
            <button type="button" className="button-primary" onClick={() => void addThread()}>
              Post thread
            </button>
          </div>
          <div className="content-stack">
            {group.discussionThreads.map((thread) => (
              <article key={thread.id} className="content-card-note">
                <strong>{thread.topic}</strong>
                <p>
                  {thread.author} · {new Date(thread.createdAt).toLocaleDateString()}
                </p>
                <p>{thread.text}</p>
                <div className="content-stack">
                  {thread.replies.map((reply) => (
                    <div key={reply.id} className="content-card-note">
                      <strong>{reply.author}</strong>
                      <p>{reply.text}</p>
                    </div>
                  ))}
                </div>
                <div className="minimal-form-grid">
                  <input
                    value={replyDrafts[thread.id]?.author ?? ""}
                    onChange={(event) =>
                      setReplyDrafts((current) => ({
                        ...current,
                        [thread.id]: {
                          author: event.target.value,
                          text: current[thread.id]?.text ?? "",
                        },
                      }))
                    }
                    className="minimal-input"
                    placeholder="Reply author"
                  />
                  <textarea
                    value={replyDrafts[thread.id]?.text ?? ""}
                    onChange={(event) =>
                      setReplyDrafts((current) => ({
                        ...current,
                        [thread.id]: {
                          author: current[thread.id]?.author ?? "",
                          text: event.target.value,
                        },
                      }))
                    }
                    className="minimal-textarea"
                    rows={3}
                    placeholder="Reply to this thread"
                  />
                  <button type="button" className="button-secondary" onClick={() => void addReply(thread.id)}>
                    Add reply
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Prayer and prompts</p>
            <h2>Keep group care and discussion aligned</h2>
          </div>
          <div className="content-card-note">
            <strong>Leader prompt</strong>
            <p>{group.leaderPrompt}</p>
          </div>
          <div className="content-stack">
            {group.discussionQuestions.map((question) => (
              <div key={question} className="content-card-note">
                <p>{question}</p>
              </div>
            ))}
          </div>
          <div className="minimal-form-grid">
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="minimal-input"
              placeholder="Name"
            />
            <textarea
              value={prayerText}
              onChange={(event) => setPrayerText(event.target.value)}
              className="minimal-textarea"
              rows={4}
              placeholder="Prayer request or praise update"
            />
            <button type="button" className="button-primary" onClick={() => void addPrayer()}>
              Add prayer request
            </button>
          </div>
          <div className="content-stack">
            {group.prayerItems.map((item) => (
              <div key={item.id} className="content-card-note">
                <strong>
                  {item.author} · {item.status}
                </strong>
                <p>{item.text}</p>
                {item.status === "active" ? (
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => void markAnswered(item.id)}
                  >
                    Mark answered
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          <div className="content-section-heading">
            <p className="eyebrow">Group-only feed</p>
            <h2>Prayer requests shared privately with this group</h2>
          </div>
          {groupPrayerFeed.length > 0 ? (
            <div className="content-stack">
              {groupPrayerFeed.map((item) => (
                <div key={item.id} className="content-card-note">
                  <strong>
                    {item.title} · {item.status}
                  </strong>
                  <p>{item.description}</p>
                  <p>
                    Shared {new Date(item.createdAt).toLocaleDateString()} · Group-only
                  </p>
                  {item.status === "active" ? (
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => void markGroupPrayerAnswered(item)}
                    >
                      Mark answered
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="content-card-note">
              No group-only prayer requests have been shared with this group yet.
            </div>
          )}
          <div className="content-actions">
            <Link href="/user/prayer-requests" className="button-secondary">
              Open prayer requests
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
