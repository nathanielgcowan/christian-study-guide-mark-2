"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseBibleReference } from "@/lib/bible";

export default function HomeVerseLookup() {
  const router = useRouter();
  const [reference, setReference] = useState("John 3:16");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = reference.trim();
    if (!trimmed) return;

    const parsed = parseBibleReference(trimmed);

    if (parsed?.isChapterReference) {
      router.push(`/bible/${encodeURIComponent(parsed.book)}/${parsed.chapter}`);
      return;
    }

    router.push(`/passage/${encodeURIComponent(parsed?.canonicalReference ?? trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="hero-lookup" aria-label="Look up a Bible verse">
      <div className="hero-lookup-field">
        <label htmlFor="hero-verse-lookup" className="minimal-label">
          Look up a Bible verse
        </label>
        <input
          id="hero-verse-lookup"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          className="minimal-input"
          placeholder="John 3:16, Romans 8, Psalm 23..."
        />
      </div>
      <button type="submit" className="button-primary">
        Open passage
      </button>
    </form>
  );
}
