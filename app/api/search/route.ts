import { NextResponse } from "next/server";
import { searchVerse } from "@lib/bible";
import { getAllBlogPosts } from "@/lib/blog";
import { listContentItems } from "@/lib/content-store";
import { findBiblicalDictionaryEntry } from "@/lib/biblical-dictionary";
import { bibleCharacters, bibleLocations } from "@/lib/bible-atlas";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getTopicHubs } from "@/lib/topic-hubs";
import { listGroups } from "@/lib/group-store";

type SearchFilter =
  | "all"
  | "verses"
  | "notes"
  | "atlas"
  | "blog"
  | "topics"
  | "groups";

type SmartSearchSection = {
  id: string;
  title: string;
  type:
    | "dictionary"
    | "atlas"
    | "blog"
    | "content"
    | "note"
    | "bookmark"
    | "topic"
    | "group";
  href: string;
  excerpt: string;
  meta: string;
};

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

function wantsFilter(active: SearchFilter, target: Exclude<SearchFilter, "all">) {
  return active === "all" || active === target;
}

export async function POST(req: Request) {
  const { query, filter } = (await req.json()) as {
    query?: string;
    filter?: SearchFilter;
  };

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const activeFilter = filter ?? "all";
  const normalized = query.trim().toLowerCase();

  const bibleResults = wantsFilter(activeFilter, "verses")
    ? await searchVerse(query)
    : [];

  const dictionaryResult =
    activeFilter === "all" ? findBiblicalDictionaryEntry(query) : null;

  const atlasResults = wantsFilter(activeFilter, "atlas")
    ? [
        ...bibleLocations
          .filter(
            (entry) =>
              includesQuery(entry.name, normalized) ||
              includesQuery(entry.summary, normalized) ||
              includesQuery(entry.significance, normalized),
          )
          .slice(0, 3)
          .map<SmartSearchSection>((entry) => ({
            id: `atlas-location-${entry.slug}`,
            title: entry.name,
            type: "atlas",
            href: `/maps/${entry.slug}`,
            excerpt: entry.summary,
            meta: `Location · ${entry.region}`,
          })),
        ...bibleCharacters
          .filter(
            (entry) =>
              includesQuery(entry.name, normalized) ||
              includesQuery(entry.summary, normalized) ||
              entry.themes.some((theme) => includesQuery(theme, normalized)),
          )
          .slice(0, 3)
          .map<SmartSearchSection>((entry) => ({
            id: `atlas-character-${entry.slug}`,
            title: entry.name,
            type: "atlas",
            href: `/characters/${entry.slug}`,
            excerpt: entry.summary,
            meta: `Character · ${entry.era}`,
          })),
      ].slice(0, 6)
    : [];

  const blogResults = wantsFilter(activeFilter, "blog")
    ? getAllBlogPosts()
        .filter(
          (post) =>
            includesQuery(post.title, normalized) ||
            includesQuery(post.excerpt, normalized) ||
            includesQuery(post.category, normalized),
        )
        .slice(0, 4)
        .map<SmartSearchSection>((post) => ({
          id: `blog-${post.slug}`,
          title: post.title,
          type: "blog",
          href: `/blog/${post.slug}`,
          excerpt: post.excerpt,
          meta: `${post.category} · ${post.date}`,
        }))
    : [];

  const topicResults = wantsFilter(activeFilter, "topics")
    ? getTopicHubs()
        .filter(
          (topic) =>
            includesQuery(topic.title, normalized) ||
            includesQuery(topic.summary, normalized) ||
            includesQuery(topic.lead, normalized) ||
            topic.keyVerses.some((verse) => includesQuery(verse, normalized)),
        )
        .slice(0, 5)
        .map<SmartSearchSection>((topic) => ({
          id: `topic-${topic.slug}`,
          title: topic.title,
          type: "topic",
          href: `/topics/${topic.slug}`,
          excerpt: topic.summary,
          meta: `Topic study · ${topic.theme}`,
        }))
    : [];

  const groupResults = wantsFilter(activeFilter, "groups")
    ? listGroups()
        .filter(
          (group) =>
            includesQuery(group.title, normalized) ||
            includesQuery(group.focus, normalized) ||
            includesQuery(group.description, normalized) ||
            includesQuery(group.assignedReading, normalized),
        )
        .slice(0, 5)
        .map<SmartSearchSection>((group) => ({
          id: `group-${group.slug}`,
          title: group.title,
          type: "group",
          href: `/groups/${group.slug}`,
          excerpt: group.description,
          meta: `Group · ${group.focus}`,
        }))
    : [];

  const contentResults =
    activeFilter === "all"
      ? listContentItems()
          .filter(
            (item) =>
              includesQuery(item.title, normalized) ||
              includesQuery(item.excerpt, normalized) ||
              includesQuery(item.body, normalized),
          )
          .slice(0, 4)
          .map<SmartSearchSection>((item) => ({
            id: `content-${item.id}`,
            title: item.title,
            type: "content",
            href:
              item.type === "blog"
                ? "/blog"
                : item.type === "reading-plan"
                  ? "/reading-plans"
                  : "/resources",
            excerpt: item.excerpt,
            meta: `${item.type} · ${item.status}`,
          }))
      : [];

  let personalResults: SmartSearchSection[] = [];
  if (wantsFilter(activeFilter, "notes")) {
    try {
      const user = await getCurrentUser();
      if (user) {
        const supabase = await createClient();
        const [{ data: notes }, { data: bookmarks }] = await Promise.all([
          supabase
            .from("user_notes")
            .select("id,reference,content,note_type")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(20),
          supabase
            .from("user_bookmarks")
            .select("id,reference,category")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

        personalResults = [
          ...((notes ?? [])
            .filter(
              (note) =>
                includesQuery(note.reference, normalized) ||
                includesQuery(note.content, normalized),
            )
            .slice(0, 4)
            .map<SmartSearchSection>((note) => ({
              id: `note-${note.id}`,
              title: note.reference,
              type: "note",
              href: `/passage/${encodeURIComponent(note.reference)}`,
              excerpt: note.content,
              meta: `Note · ${note.note_type}`,
            }))),
          ...((bookmarks ?? [])
            .filter(
              (bookmark) =>
                includesQuery(bookmark.reference, normalized) ||
                includesQuery(bookmark.category ?? "", normalized),
            )
            .slice(0, 4)
            .map<SmartSearchSection>((bookmark) => ({
              id: `bookmark-${bookmark.id}`,
              title: bookmark.reference,
              type: "bookmark",
              href: `/passage/${encodeURIComponent(bookmark.reference)}`,
              excerpt: bookmark.category ?? "Saved passage",
              meta: "Bookmark",
            }))),
        ];
      }
    } catch {}
  }

  return NextResponse.json({
    bibleResults,
    smartResults: [
      ...(dictionaryResult
        ? [
            {
              id: `dictionary-${dictionaryResult.slug}`,
              title: dictionaryResult.term,
              type: "dictionary" as const,
              href: `/dictionary/${dictionaryResult.slug}`,
              excerpt: dictionaryResult.summary,
              meta: `Dictionary · ${dictionaryResult.category}`,
            },
          ]
        : []),
      ...atlasResults,
      ...blogResults,
      ...topicResults,
      ...groupResults,
      ...contentResults,
      ...personalResults,
    ],
    activeFilter,
  });
}
