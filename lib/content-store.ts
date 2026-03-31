export interface ContentItem {
  id: string;
  type: "devotional" | "blog" | "reading-plan" | "resource" | "homepage";
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "review" | "published";
  featured: boolean;
  updatedAt: string;
  owner: string;
}

const contentItems: ContentItem[] = [
  {
    id: "content-1",
    type: "devotional",
    slug: "daily-abiding-reflection",
    title: "Daily Abiding Reflection",
    excerpt: "A quiet devotional on staying near to Christ in ordinary rhythms.",
    body: "Abiding in Christ is not a dramatic one-time moment alone. It is a daily returning of the heart, a quiet dependence that reshapes attention, prayer, and obedience throughout the day.",
    status: "published",
    featured: true,
    updatedAt: "2026-03-26T14:00:00.000Z",
    owner: "Editorial",
  },
  {
    id: "content-2",
    type: "blog",
    slug: "build-a-study-rhythm-that-lasts",
    title: "How to Build a Study Rhythm That Lasts",
    excerpt: "A practical framework for creating a sustainable Bible study cadence.",
    body: "Lasting study rhythms are built through clarity and repetition. Start with a realistic reading pace, a clear place to take notes, and a short closing prayer that keeps application close to the text.",
    status: "review",
    featured: false,
    updatedAt: "2026-03-28T10:30:00.000Z",
    owner: "Nathaniel",
  },
  {
    id: "content-3",
    type: "reading-plan",
    slug: "30-days-through-john",
    title: "30 Days Through John",
    excerpt: "A month-long reading plan centered on the identity and words of Jesus.",
    body: "This plan walks slowly through the Gospel of John with room for observation, reflection, and prayer. It is designed for both new believers and mature readers who want a gospel-centered reset.",
    status: "published",
    featured: true,
    updatedAt: "2026-03-21T09:15:00.000Z",
    owner: "Editorial",
  },
  {
    id: "content-4",
    type: "resource",
    slug: "understanding-grace-resource-guide",
    title: "Understanding Grace Resource Guide",
    excerpt: "A curated guide to grace, discipleship, and spiritual formation resources.",
    body: "Grace is more than the doorway into salvation. It is also the sustaining power of the Christian life. This guide gathers verses, articles, and reflection prompts that help readers understand grace more fully.",
    status: "draft",
    featured: false,
    updatedAt: "2026-03-29T16:10:00.000Z",
    owner: "Research",
  },
  {
    id: "content-5",
    type: "homepage",
    slug: "homepage-featured-pathways",
    title: "Homepage Featured Pathways",
    excerpt: "Featured entry points and highlighted journeys for the homepage.",
    body: "The homepage pathways should direct users into the Bible reader, devotionals, reading plans, and verse image tools with clear next steps and a calmer editorial tone.",
    status: "review",
    featured: true,
    updatedAt: "2026-03-30T08:05:00.000Z",
    owner: "Product",
  },
];

export function listContentItems() {
  return [...contentItems].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function updateContentItem(
  id: string,
  updates: Partial<
    Pick<
      ContentItem,
      "type" | "slug" | "title" | "excerpt" | "body" | "status" | "featured" | "owner"
    >
  >,
) {
  const item = contentItems.find((entry) => entry.id === id);
  if (!item) {
    return null;
  }

  if (updates.type) {
    item.type = updates.type;
  }

  if (updates.slug) {
    item.slug = updates.slug;
  }

  if (updates.title) {
    item.title = updates.title;
  }

  if (updates.excerpt) {
    item.excerpt = updates.excerpt;
  }

  if (updates.body) {
    item.body = updates.body;
  }

  if (updates.status) {
    item.status = updates.status;
  }

  if (typeof updates.featured === "boolean") {
    item.featured = updates.featured;
  }

  if (updates.owner) {
    item.owner = updates.owner;
  }

  item.updatedAt = new Date().toISOString();
  return item;
}

export function createContentItem(
  item: Pick<
    ContentItem,
    "type" | "slug" | "title" | "excerpt" | "body" | "status" | "featured" | "owner"
  >,
) {
  const createdItem: ContentItem = {
    id: `content-${crypto.randomUUID()}`,
    updatedAt: new Date().toISOString(),
    ...item,
  };

  contentItems.unshift(createdItem);
  return createdItem;
}

export function deleteContentItem(id: string) {
  const index = contentItems.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return false;
  }

  contentItems.splice(index, 1);
  return true;
}
