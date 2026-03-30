import { NextResponse } from "next/server";
import { listContentItems, updateContentItem } from "@/lib/content-store";

export async function GET() {
  return NextResponse.json({ items: listContentItems() });
}

export async function PATCH(request: Request) {
  const {
    id,
    status,
    featured,
  }: {
    id?: string;
    status?: "draft" | "review" | "published";
    featured?: boolean;
  } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Content item id is required." }, { status: 400 });
  }

  const item = updateContentItem(id, { status, featured });
  if (!item) {
    return NextResponse.json({ error: "Content item not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}
