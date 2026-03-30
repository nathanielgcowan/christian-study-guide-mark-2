"use client";
import { useState } from "react";

interface BibleVerse {
  reference: string;
  text: string;
  version: string;
}

export default function BibleSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/bible/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = (await res.json()) as { results?: BibleVerse[] };
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-2xl shadow">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 rounded border px-3 py-2"
          placeholder="Search for a verse (e.g. John 3:16 or 'love')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-blue-600 text-white px-4 py-2 font-semibold"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="space-y-4">
        {results.map((v, i) => (
          <li key={i} className="p-4 bg-blue-50 rounded">
            <span className="block font-bold text-blue-700">
              {v.reference} ({v.version})
            </span>
            <span className="block mt-1">{v.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
