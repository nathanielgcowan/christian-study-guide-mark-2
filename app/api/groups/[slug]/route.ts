import { NextResponse } from "next/server";
import {
  addPrayerItem,
  findGroupBySlug,
  updatePrayerStatus,
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
  const {
    mode,
    author,
    text,
    prayerId,
    status,
  }: {
    mode?: "add-prayer" | "update-status";
    author?: string;
    text?: string;
    prayerId?: string;
    status?: "active" | "answered";
  } = await request.json();

  if (mode === "add-prayer") {
    if (!author || !text) {
      return NextResponse.json(
        { error: "Author and text are required." },
        { status: 400 },
      );
    }

    const prayerItem = addPrayerItem(slug, { author, text });
    if (!prayerItem) {
      return NextResponse.json({ error: "Group not found." }, { status: 404 });
    }

    return NextResponse.json({ prayerItem });
  }

  if (mode === "update-status") {
    if (!prayerId || !status) {
      return NextResponse.json(
        { error: "Prayer item and status are required." },
        { status: 400 },
      );
    }

    const prayerItem = updatePrayerStatus(slug, prayerId, status);
    if (!prayerItem) {
      return NextResponse.json(
        { error: "Group or prayer item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ prayerItem });
  }

  return NextResponse.json({ error: "Unsupported update mode." }, { status: 400 });
}
