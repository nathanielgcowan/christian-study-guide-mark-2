import { NextResponse } from "next/server";
import { createGroup, listGroups } from "@/lib/group-store";

export async function GET() {
  return NextResponse.json({ groups: listGroups() });
}

export async function POST(request: Request) {
  const {
    title,
    focus,
    cadence,
    description,
  }: {
    title?: string;
    focus?: string;
    cadence?: string;
    description?: string;
  } = await request.json();

  if (!title || !focus || !cadence || !description) {
    return NextResponse.json(
      { error: "Title, focus, cadence, and description are required." },
      { status: 400 },
    );
  }

  const group = createGroup({ title, focus, cadence, description });
  return NextResponse.json({ group }, { status: 201 });
}
