import { NextResponse } from "next/server";
import {
  createContentItem,
  deleteContentItem,
  listContentItems,
  updateContentItem,
} from "@/lib/content-store";

export async function GET() {
  return NextResponse.json({ items: listContentItems() });
}

export async function POST(request: Request) {
  const {
    type,
    slug,
    title,
    excerpt,
    body,
    status,
    featured,
    owner,
  }: {
    type?: "devotional" | "blog" | "reading-plan" | "resource" | "homepage";
    slug?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    status?: "draft" | "review" | "published";
    featured?: boolean;
    owner?: string;
  } = await request.json();

  if (!type || !slug || !title || !excerpt || !body || !owner) {
    return NextResponse.json(
      { error: "Type, slug, title, excerpt, body, and owner are required." },
      { status: 400 },
    );
  }

  const item = createContentItem({
    type,
    slug,
    title,
    excerpt,
    body,
    status: status ?? "draft",
    featured: featured ?? false,
    owner,
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const {
    id,
    type,
    slug,
    title,
    excerpt,
    body,
    status,
    featured,
    owner,
  }: {
    id?: string;
    type?: "devotional" | "blog" | "reading-plan" | "resource" | "homepage";
    slug?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    status?: "draft" | "review" | "published";
    featured?: boolean;
    owner?: string;
  } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Content item id is required." }, { status: 400 });
  }

  const item = updateContentItem(id, {
    type,
    slug,
    title,
    excerpt,
    body,
    status,
    featured,
    owner,
  });
  if (!item) {
    return NextResponse.json({ error: "Content item not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Content item id is required." },
      { status: 400 },
    );
  }

  const success = deleteContentItem(id);
  if (!success) {
    return NextResponse.json({ error: "Content item not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
