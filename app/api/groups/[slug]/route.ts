import { NextResponse } from "next/server";
import {
  addAttendanceRecord,
  addDiscussionReply,
  addDiscussionThread,
  addLeaderAssignment,
  addPrayerItem,
  findGroupBySlug,
  updateLeaderAssignmentStatus,
  updatePrayerStatus,
  updateWeeklyPlan,
} from "@/lib/group-store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const group = findGroupBySlug(slug);

  if (!group) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  return NextResponse.json({ group });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const body = (await request.json()) as {
    mode?:
      | "add-prayer"
      | "update-status"
      | "add-assignment"
      | "update-assignment-status"
      | "add-attendance"
      | "add-thread"
      | "add-reply"
      | "update-weekly-plan";
    author?: string;
    text?: string;
    prayerId?: string;
    status?: "active" | "answered" | "open" | "done";
    assignmentId?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    assignee?: string;
    memberName?: string;
    attendanceStatus?: "present" | "absent" | "follow-up";
    topic?: string;
    threadId?: string;
    weekLabel?: string;
    focus?: string;
    reading?: string;
    memoryVerse?: string;
    goal?: string;
    meetingPlan?: string[];
  };

  if (body.mode === "add-prayer") {
    if (!body.author || !body.text) {
      return NextResponse.json({ error: "Author and text are required." }, { status: 400 });
    }

    const prayerItem = addPrayerItem(slug, { author: body.author, text: body.text });
    if (!prayerItem) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ prayerItem });
  }

  if (body.mode === "update-status") {
    if (!body.prayerId || (body.status !== "active" && body.status !== "answered")) {
      return NextResponse.json({ error: "Prayer item and status are required." }, { status: 400 });
    }

    const prayerItem = updatePrayerStatus(slug, body.prayerId, body.status);
    if (!prayerItem) {
      return NextResponse.json({ error: "Group or prayer item not found." }, { status: 404 });
    }

    return NextResponse.json({ prayerItem });
  }

  if (body.mode === "add-assignment") {
    if (!body.title || !body.description || !body.dueDate || !body.assignee) {
      return NextResponse.json(
        { error: "Title, description, due date, and assignee are required." },
        { status: 400 },
      );
    }

    const assignment = addLeaderAssignment(slug, {
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
      assignee: body.assignee,
    });
    if (!assignment) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  }

  if (body.mode === "update-assignment-status") {
    if (!body.assignmentId || (body.status !== "open" && body.status !== "done")) {
      return NextResponse.json({ error: "Assignment id and status are required." }, { status: 400 });
    }

    const assignment = updateLeaderAssignmentStatus(slug, body.assignmentId, body.status);
    if (!assignment) {
      return NextResponse.json({ error: "Group or assignment not found." }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  }

  if (body.mode === "add-attendance") {
    if (!body.memberName || !body.attendanceStatus) {
      return NextResponse.json({ error: "Member name and attendance status are required." }, { status: 400 });
    }

    const attendance = addAttendanceRecord(slug, {
      memberName: body.memberName,
      status: body.attendanceStatus,
    });
    if (!attendance) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ attendance });
  }

  if (body.mode === "add-thread") {
    if (!body.author || !body.topic || !body.text) {
      return NextResponse.json({ error: "Author, topic, and text are required." }, { status: 400 });
    }

    const thread = addDiscussionThread(slug, {
      author: body.author,
      topic: body.topic,
      text: body.text,
    });
    if (!thread) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ thread });
  }

  if (body.mode === "add-reply") {
    if (!body.threadId || !body.author || !body.text) {
      return NextResponse.json({ error: "Thread, author, and text are required." }, { status: 400 });
    }

    const reply = addDiscussionReply(slug, body.threadId, {
      author: body.author,
      text: body.text,
    });
    if (!reply) {
      return NextResponse.json({ error: "Group or thread not found." }, { status: 404 });
    }

    return NextResponse.json({ reply });
  }

  if (body.mode === "update-weekly-plan") {
    if (
      !body.weekLabel ||
      !body.focus ||
      !body.reading ||
      !body.memoryVerse ||
      !body.goal ||
      !Array.isArray(body.meetingPlan)
    ) {
      return NextResponse.json({ error: "Weekly plan fields are required." }, { status: 400 });
    }

    const weeklyPlan = updateWeeklyPlan(slug, {
      weekLabel: body.weekLabel,
      focus: body.focus,
      reading: body.reading,
      memoryVerse: body.memoryVerse,
      goal: body.goal,
      meetingPlan: body.meetingPlan,
    });
    if (!weeklyPlan) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ weeklyPlan });
  }

  return NextResponse.json({ error: "Unsupported update mode." }, { status: 400 });
}
