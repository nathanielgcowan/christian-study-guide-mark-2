"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Bookmark {
  id: string;
  type: string;
  reference: string;
  title: string | null;
  createdAt: string;
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookmarks();
    }
  }, [status]);

  async function fetchBookmarks() {
    const response = await fetch("/api/user/bookmarks");
    if (response.ok) {
      const data = await response.json();
      setBookmarks(data.bookmarks);
    }
    setLoading(false);
  }

  async function deleteBookmark(id: string) {
    await fetch("/api/user/bookmarks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  }

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <p>Please sign in to view bookmarks.</p>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back home
        </Link>
      </div>

      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-slate-600">
          No bookmarks yet. Start saving content!
        </p>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {bookmark.title || bookmark.reference}
                </p>
                <p className="text-sm text-slate-500">{bookmark.type}</p>
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
