import type { Metadata } from "next";
import { generateVerseImage } from "@/lib/verse-image";

interface Props {
  searchParams: Promise<{
    verse?: string;
    reference?: string;
    bg?: string;
    text?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const verse = params.verse || "For God so loved the world...";
  const reference = params.reference || "John 3:16";
  const bg = params.bg || "#1f2937";
  const text = params.text || "#ffffff";

  const ogImageUrl = `/api/og/verse?verse=${encodeURIComponent(verse)}&reference=${encodeURIComponent(reference)}&bg=${encodeURIComponent(bg)}&text=${encodeURIComponent(text)}`;

  return {
    title: `${reference} - Christian Study Guide`,
    description: verse,
    openGraph: {
      title: reference,
      description: verse,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: reference,
      description: verse,
      images: [ogImageUrl],
    },
  };
}

export default function ShareVersePage() {
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
            <code>{typeof window !== "undefined" && window.location.href}</code>
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("URL copied to clipboard!");
            }}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Copy Link
          </button>
          <a
            href="/user/verse-generator"
            className="block rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            Create Another Verse
          </a>
        </div>
      </div>
    </main>
  );
}
