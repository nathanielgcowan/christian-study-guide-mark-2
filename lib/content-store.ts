export interface ContentItem {
  id: string;
  type: "devotional" | "blog" | "reading-plan" | "resource" | "homepage";
  title: string;
  status: "draft" | "review" | "published";
  featured: boolean;
  updatedAt: string;
  owner: string;
}

const contentItems: ContentItem[] = [
  {
    id: "content-1",
    type: "devotional",
    title: "Daily Abiding Reflection",
    status: "published",
    featured: true,
    updatedAt: "2026-03-26T14:00:00.000Z",
    owner: "Editorial",
  },
  {
    id: "content-2",
    type: "blog",
    title: "How to Build a Study Rhythm That Lasts",
    status: "review",
    featured: false,
    updatedAt: "2026-03-28T10:30:00.000Z",
    owner: "Nathaniel",
  },
  {
    id: "content-3",
    type: "reading-plan",
    title: "30 Days Through John",
    status: "published",
    featured: true,
    updatedAt: "2026-03-21T09:15:00.000Z",
    owner: "Editorial",
  },
  {
    id: "content-4",
    type: "resource",
    title: "Understanding Grace Resource Guide",
    status: "draft",
    featured: false,
    updatedAt: "2026-03-29T16:10:00.000Z",
    owner: "Research",
  },
  {
    id: "content-5",
    type: "homepage",
    title: "Homepage Featured Pathways",
    status: "review",
    featured: true,
    updatedAt: "2026-03-30T08:05:00.000Z",
    owner: "Product",
  },
];

export function listContentItems() {
  return contentItems;
}

export function updateContentItem(
  id: string,
  updates: Partial<Pick<ContentItem, "status" | "featured">>,
) {
  const item = contentItems.find((entry) => entry.id === id);
  if (!item) {
    return null;
  }

  if (updates.status) {
    item.status = updates.status;
  }

  if (typeof updates.featured === "boolean") {
    item.featured = updates.featured;
  }

  item.updatedAt = new Date().toISOString();
  return item;
}
