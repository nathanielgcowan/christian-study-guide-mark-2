import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{
    verse?: string;
    reference?: string;
    bg?: string;
    text?: string;
    theme?: string;
    layout?: string;
    mood?: string;
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
  const theme = params.theme || "minimal";
  const layout = params.layout || "classic";
  const mood = params.mood || "daybreak";

  const ogImageUrl = `/api/og/verse?verse=${encodeURIComponent(verse)}&reference=${encodeURIComponent(reference)}&bg=${encodeURIComponent(bg)}&text=${encodeURIComponent(text)}&theme=${encodeURIComponent(theme)}&layout=${encodeURIComponent(layout)}&mood=${encodeURIComponent(mood)}`;

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

import VerseShareClient from "./VerseShareClient";

export default function ShareVersePage({
  searchParams,
}: {
  searchParams?: { verse?: string; reference?: string; theme?: string; layout?: string; mood?: string };
}) {
  return (
    <VerseShareClient
      verse={searchParams?.verse}
      reference={searchParams?.reference}
      theme={searchParams?.theme}
      layout={searchParams?.layout}
      mood={searchParams?.mood}
    />
  );
}
