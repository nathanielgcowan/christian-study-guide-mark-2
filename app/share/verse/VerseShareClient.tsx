"use client";

import { useMemo } from "react";

export default function VerseShareClient({
  verse,
  reference,
}: {
  verse?: string;
  reference?: string;
}) {
  const currentUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold">Share This Verse</h1>
        <p className="mb-6 text-slate-600">
          This verse has been shared on social media. Copy the URL to share with
          others!
        </p>

        <div className="mb-6 rounded-lg bg-slate-100 px-4 py-2">
          <p className="text-sm text-slate-700">
            <code>{currentUrl || "Loading link..."}</code>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (!currentUrl) return;
              navigator.clipboard.writeText(currentUrl);
              alert("URL copied to clipboard!");
            }}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Copy Link
          </button>
          <a
            href={`/user/verse-generator?verse=${encodeURIComponent(verse || "")}&&reference=${encodeURIComponent(reference || "")}`}
            className="block rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Create Another Verse
          </a>
        </div>
      </div>
    </main>
  );
}
