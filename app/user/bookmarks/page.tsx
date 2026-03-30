"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Library, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BookmarkItem {
  id: string;
  type: string;
  reference: string;
  title: string | null;
  createdAt: string;
}

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function loadBookmarks() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSignedIn(false);
        setLoading(false);
        return;
      }

      setSignedIn(true);
      const response = await fetch("/api/user/bookmarks");

      if (response.ok) {
        const data = (await response.json()) as { bookmarks: BookmarkItem[] };
        setBookmarks(data.bookmarks);
      }

      setLoading(false);
    }

    void loadBookmarks();
  }, []);

  async function deleteBookmark(id: string) {
    await fetch("/api/user/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBookmarks((current) => current.filter((bookmark) => bookmark.id !== id));
  }

  if (loading) return <p>Loading...</p>;

  if (!signedIn)
    return (
      <main className="minimal-shell">
        <section className="minimal-card minimal-status">
          <h2>Please sign in to view bookmarks.</h2>
          <div className="minimal-actions">
            <button
              onClick={() => router.push("/auth/signin")}
              className="button-primary"
            >
              Sign in
            </button>
          </div>
        </section>
      </main>
    );

  return (
    <main className="minimal-shell">
      <section className="minimal-grid">
        <div className="minimal-hero">
          <p className="eyebrow">Saved Passages</p>
          <h1>Your bookmarks, without the clutter.</h1>
          <p>
            A quieter reading shelf for the verses and passages you want to come
            back to.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <section className="minimal-card minimal-empty">
            <Bookmark className="mx-auto mb-4 h-10 w-10 text-[var(--accent-strong)]" />
            <h2>No bookmarks yet</h2>
            <p>Save passages while reading and they will appear here.</p>
            <div className="minimal-actions" style={{ justifyContent: "center" }}>
              <Link href="/" className="button-primary">
                Start studying
              </Link>
            </div>
          </section>
        ) : (
          <section className="minimal-list">
            {bookmarks.map((bookmark) => (
              <article key={bookmark.id} className="minimal-item">
                <div>
                  <p className="minimal-link">
                    {bookmark.title || bookmark.reference}
                  </p>
                  <div className="minimal-meta">
                    <span className="minimal-badge">
                      <Library size={14} />
                      {bookmark.type}
                    </span>
                    <span>
                      Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => void deleteBookmark(bookmark.id)}
                  className="button-secondary"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
