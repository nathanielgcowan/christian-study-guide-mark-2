export interface BiblePassageVerse {
  number: number;
  text: string;
}

export interface BibleBook {
  name: string;
  chapters: number;
}

interface ApiBibleVerse {
  number?: number;
  text?: string;
}

interface BibleApiResult {
  reference?: string;
  text?: string;
  verses?: ApiBibleVerse[];
}

interface BibleApiResponse {
  results?: BibleApiResult[];
}

/**
 * Fetches a passage and returns an array of verses with their numbers and text.
 * @param reference Passage reference (e.g., 'John 3:16-18')
 * @returns Array of verses with numbers and text, or null if not found
 */
export async function getPassage(
  reference: string,
): Promise<BiblePassageVerse[] | null> {
  try {
    if (!API_KEY) {
      // Mock passage for local/dev
      return [
        {
          number: 16,
          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
        },
        {
          number: 17,
          text: "For God did not send his Son into the world to condemn the world, but to save the world through him.",
        },
        {
          number: 18,
          text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God’s one and only Son.",
        },
      ];
    }

    // Example API endpoint for passage (update as needed for your API)
    const response = await fetch(`${BIBLE_API_URL}/passages`, {
      method: "POST",
      headers: { "api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ query: reference }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as BibleApiResponse;
    // Adjust parsing based on actual API response structure
    if (!data.results || data.results.length === 0) return null;

    // Assume data.results[0].verses is an array of { number, text }
    if (Array.isArray(data.results[0].verses)) {
      return data.results[0].verses.map((v) => ({
        number: v.number ?? 0,
        text: v.text ?? "",
      }));
    }

    // Fallback: try to parse a single string into verses (if needed)
    return null;
  } catch (error) {
    console.error("Bible API error (getPassage):", error);
    return null;
  }
}
export interface BibleVerse {
  reference: string;
  text: string;
  version: string;
}

export interface VerseComparisonResult {
  reference: string;
  text: string;
  version: string;
}

export const SUPPORTED_TRANSLATIONS = [
  { id: "web", label: "WEB" },
  { id: "kjv", label: "KJV" },
  { id: "asv", label: "ASV" },
] as const;

export const BIBLE_BOOKS: BibleBook[] = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 },
  { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 },
  { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 },
  { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 },
  { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 },
  { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 },
  { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 },
  { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 },
  { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 },
  { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 },
];

const BIBLE_API_URL = "https://api.scripture.api.bible/v1";
const API_KEY = process.env.BIBLE_API_KEY || "";

function normalizeBookName(book: string) {
  return book.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findBibleBook(book: string) {
  return (
    BIBLE_BOOKS.find(
      (entry) => normalizeBookName(entry.name) === normalizeBookName(book),
    ) ?? null
  );
}

export function getDefaultBibleReference() {
  return {
    book: "John",
    chapter: 1,
    translation: SUPPORTED_TRANSLATIONS[0].id,
  };
}

function buildMockChapterPassage(
  book: string,
  chapter: number,
  translation: string,
): BiblePassageVerse[] {
  const style =
    translation === "kjv"
      ? "Thou art invited to behold"
      : translation === "asv"
        ? "Behold"
        : "Consider";

  return Array.from({ length: 18 }, (_, index) => ({
    number: index + 1,
    text: `${style} ${book} ${chapter}:${index + 1} as a study-ready mock verse. This line stands in while a live Bible source is unavailable, preserving a readable chapter flow for navigation, notes, and reflection.`,
  }));
}

export async function getChapterPassage(
  book: string,
  chapter: number,
  translation: string,
): Promise<BiblePassageVerse[]> {
  const normalizedBook = findBibleBook(book)?.name ?? book;
  const chapterReference = `${normalizedBook} ${chapter}`;
  const livePassage = await getPassage(chapterReference);

  if (livePassage && livePassage.length > 0) {
    return livePassage;
  }

  return buildMockChapterPassage(normalizedBook, chapter, translation);
}

export async function getVerse(reference: string): Promise<BibleVerse | null> {
  try {
    if (!API_KEY) {
      console.warn("BIBLE_API_KEY not set; returning mock verse");
      return {
        reference,
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. (John 3:16)",
        version: "NIV",
      };
    }

    const response = await fetch(`${BIBLE_API_URL}/search`, {
      headers: { "api-key": API_KEY },
      body: JSON.stringify({ query: reference }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as BibleApiResponse;
    if (!data.results || data.results.length === 0) return null;

    return {
      reference,
      text: data.results[0].text || "",
      version: "NIV",
    };
  } catch (error) {
    console.error("Bible API error:", error);
    return null;
  }
}

export async function searchVerse(query: string): Promise<BibleVerse[]> {
  try {
    if (!API_KEY) {
      return [
        {
          reference: "John 3:16",
          text: "For God so loved the world...",
          version: "NIV",
        },
      ];
    }

    const response = await fetch(`${BIBLE_API_URL}/search`, {
      headers: { "api-key": API_KEY },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as BibleApiResponse;
    return (
      data.results?.map((result) => ({
        reference: result.reference || "",
        text: result.text || "",
        version: "NIV",
      })) || []
    );
  } catch (error) {
    console.error("Bible API error:", error);
    return [];
  }
}

function buildMockTranslation(
  reference: string,
  translation: string,
): VerseComparisonResult {
  const mockTexts: Record<string, Record<string, string>> = {
    "John 3:16": {
      web: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
      kjv: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      asv: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.",
    },
    "Psalm 119:105": {
      web: "Your word is a lamp to my feet, and a light for my path.",
      kjv: "Thy word is a lamp unto my feet, and a light unto my path.",
      asv: "Thy word is a lamp unto my feet, And light unto my path.",
    },
    "Romans 8:28": {
      web: "We know that all things work together for good for those who love God, to those who are called according to his purpose.",
      kjv: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      asv: "And we know that to them that love God all things work together for good, even to them that are called according to his purpose.",
    },
  };

  const canonicalReference = mockTexts[reference] ? reference : "John 3:16";

  return {
    reference,
    text:
      mockTexts[canonicalReference]?.[
        translation as keyof (typeof mockTexts)[typeof canonicalReference]
      ] ?? mockTexts[canonicalReference].web,
    version: translation.toUpperCase(),
  };
}

export async function getVerseComparison(
  reference: string,
  translations: string[],
): Promise<VerseComparisonResult[]> {
  if (!API_KEY) {
    return translations.map((translation) =>
      buildMockTranslation(reference, translation),
    );
  }

  const baseVerse = await getVerse(reference);
  if (!baseVerse) {
    return translations.map((translation) =>
      buildMockTranslation(reference, translation),
    );
  }

  return translations.map((translation) => ({
    reference,
    text: baseVerse.text,
    version: translation.toUpperCase(),
  }));
}
