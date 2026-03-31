export interface BiblePassageVerse {
  number: number;
  text: string;
}

export interface BibleBook {
  name: string;
  chapters: number;
}

export interface BibleChapterPointer {
  book: string;
  chapter: number;
}

export interface ParsedBibleReference {
  book: string;
  chapter: number | null;
  verse: number | null;
  isChapterReference: boolean;
  isVerseReference: boolean;
  canonicalReference: string;
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

export interface VerseCrossReference {
  reference: string;
  label: string;
  reason: string;
}

export interface VerseCommentarySection {
  title: string;
  body: string;
}

export interface OriginalLanguageWord {
  term: string;
  transliteration: string;
  language: "Greek" | "Hebrew";
  strongs: string;
  partOfSpeech: string;
  definition: string;
  nuance: string;
  relatedReferences: string[];
}

export interface VerseStudyResource {
  summary: string;
  crossReferences: VerseCrossReference[];
  commentary: VerseCommentarySection[];
  originalLanguage: OriginalLanguageWord[];
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

export function parseBibleReference(input: string): ParsedBibleReference | null {
  const normalizedInput = input.trim().replace(/\s+/g, " ");
  if (!normalizedInput) {
    return null;
  }

  const matchedBook =
    BIBLE_BOOKS
      .slice()
      .sort((left, right) => right.name.length - left.name.length)
      .find((entry) => normalizedInput.toLowerCase().startsWith(entry.name.toLowerCase()));

  if (!matchedBook) {
    return null;
  }

  const remainder = normalizedInput.slice(matchedBook.name.length).trim();
  if (!remainder) {
    return {
      book: matchedBook.name,
      chapter: null,
      verse: null,
      isChapterReference: false,
      isVerseReference: false,
      canonicalReference: matchedBook.name,
    };
  }

  const match = remainder.match(/^(\d+)(?::(\d+))?/);
  if (!match) {
    return null;
  }

  const chapter = Number(match[1]);
  const verse = match[2] ? Number(match[2]) : null;
  const boundedChapter = Math.min(Math.max(chapter, 1), matchedBook.chapters);

  return {
    book: matchedBook.name,
    chapter: boundedChapter,
    verse,
    isChapterReference: Boolean(boundedChapter && !verse),
    isVerseReference: Boolean(boundedChapter && verse),
    canonicalReference: verse
      ? `${matchedBook.name} ${boundedChapter}:${verse}`
      : `${matchedBook.name} ${boundedChapter}`,
  };
}

export function getAdjacentBibleChapter(
  book: string,
  chapter: number,
  direction: "previous" | "next",
): BibleChapterPointer | null {
  const canonicalBook = findBibleBook(book);
  if (!canonicalBook) {
    return null;
  }

  const currentIndex = BIBLE_BOOKS.findIndex((entry) => entry.name === canonicalBook.name);
  if (currentIndex === -1) {
    return null;
  }

  if (direction === "previous") {
    if (chapter > 1) {
      return { book: canonicalBook.name, chapter: chapter - 1 };
    }

    const previousBook = BIBLE_BOOKS[currentIndex - 1];
    return previousBook
      ? { book: previousBook.name, chapter: previousBook.chapters }
      : null;
  }

  if (chapter < canonicalBook.chapters) {
    return { book: canonicalBook.name, chapter: chapter + 1 };
  }

  const nextBook = BIBLE_BOOKS[currentIndex + 1];
  return nextBook ? { book: nextBook.name, chapter: 1 } : null;
}

export function getBibleReadingProgress(book: string, chapter: number) {
  const canonicalBook = findBibleBook(book);
  if (!canonicalBook) {
    return {
      completedChapters: 0,
      totalChapters: BIBLE_BOOKS.reduce((sum, entry) => sum + entry.chapters, 0),
      percentComplete: 0,
    };
  }

  const chaptersBeforeBook = BIBLE_BOOKS.slice(
    0,
    BIBLE_BOOKS.findIndex((entry) => entry.name === canonicalBook.name),
  ).reduce((sum, entry) => sum + entry.chapters, 0);

  const totalChapters = BIBLE_BOOKS.reduce((sum, entry) => sum + entry.chapters, 0);
  const completedChapters = Math.min(chaptersBeforeBook + Math.max(chapter, 1), totalChapters);

  return {
    completedChapters,
    totalChapters,
    percentComplete: Math.round((completedChapters / totalChapters) * 100),
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

const STUDY_RESOURCE_MAP: Record<string, VerseStudyResource> = {
  "John 1:1": {
    summary: "John opens by presenting Jesus as eternal, divine, and active in creation before the incarnation story begins.",
    crossReferences: [
      {
        reference: "Genesis 1:1",
        label: "Creation echoes",
        reason: "The phrase 'In the beginning' deliberately ties Jesus to the opening of Scripture.",
      },
      {
        reference: "Colossians 1:16-17",
        label: "Christ before all things",
        reason: "Paul also describes Jesus as preexistent and central to creation.",
      },
      {
        reference: "Hebrews 1:1-3",
        label: "The Son revealed",
        reason: "Hebrews reinforces the Son's divine nature and sustaining power.",
      },
    ],
    commentary: [
      {
        title: "Devotional",
        body: "This verse steadies faith by reminding us that Jesus did not begin in Bethlehem. He has always been the eternal Word, fully worthy of trust and worship.",
      },
      {
        title: "Pastoral",
        body: "John starts with identity before instruction. A healthy Christian life grows from seeing who Christ is before asking what we should do.",
      },
      {
        title: "Study",
        body: "The term 'Word' carries both revelation and divine action. John uses it to show that God has made Himself known decisively in Jesus.",
      },
    ],
    originalLanguage: [
      {
        term: "Logos",
        transliteration: "logos",
        language: "Greek",
        strongs: "G3056",
        partOfSpeech: "Noun",
        definition: "word, message, self-expression",
        nuance: "John uses logos to present Jesus as God's personal self-revelation and active agent in creation.",
        relatedReferences: ["John 1:14", "1 John 1:1", "Revelation 19:13"],
      },
      {
        term: "Theos",
        transliteration: "theos",
        language: "Greek",
        strongs: "G2316",
        partOfSpeech: "Noun",
        definition: "God, the divine one",
        nuance: "The wording of John 1:1 presses the reader to see the Word as fully sharing in deity, not as a lesser being.",
        relatedReferences: ["John 20:28", "Titus 2:13", "Hebrews 1:8"],
      },
    ],
  },
  "John 1:14": {
    summary: "The eternal Word truly entered human life, revealing divine glory through grace and truth.",
    crossReferences: [
      {
        reference: "Exodus 33:18-23",
        label: "Glory revealed",
        reason: "Moses longed to see God's glory, and John says that glory is now seen in Christ.",
      },
      {
        reference: "Philippians 2:6-8",
        label: "The Son humbled",
        reason: "Paul explains the humility of the incarnation from another angle.",
      },
      {
        reference: "Hebrews 4:15",
        label: "Near to our weakness",
        reason: "The incarnate Christ knows the human condition from the inside.",
      },
    ],
    commentary: [
      {
        title: "Devotional",
        body: "God did not stay distant from human sorrow. In Jesus, He drew near with real tenderness, presence, and rescue.",
      },
      {
        title: "Pastoral",
        body: "Grace and truth are not rivals in Jesus. He meets people honestly and mercifully at the same time.",
      },
      {
        title: "Study",
        body: "John's language of 'dwelt among us' recalls the tabernacle, suggesting that God's presence now comes personally through the Son.",
      },
    ],
    originalLanguage: [
      {
        term: "Sarx",
        transliteration: "sarx",
        language: "Greek",
        strongs: "G4561",
        partOfSpeech: "Noun",
        definition: "flesh, human nature",
        nuance: "John stresses that the Word truly entered full human life, not merely appearing human from a distance.",
        relatedReferences: ["Romans 1:3", "Philippians 2:7", "Hebrews 2:14"],
      },
      {
        term: "Skenoo",
        transliteration: "skenoo",
        language: "Greek",
        strongs: "G4637",
        partOfSpeech: "Verb",
        definition: "to dwell, to tabernacle",
        nuance: "The verb recalls God's dwelling among Israel and suggests Jesus as the true meeting place between God and humanity.",
        relatedReferences: ["Exodus 25:8", "Revelation 21:3", "John 2:19-21"],
      },
    ],
  },
  "John 3:16": {
    summary: "This verse gathers the heart of the gospel into one sentence: God's love, the gift of the Son, and life through faith.",
    crossReferences: [
      {
        reference: "Romans 5:8",
        label: "Love demonstrated",
        reason: "Paul describes the cross as God's love made visible in action.",
      },
      {
        reference: "1 John 4:9-10",
        label: "Love defined",
        reason: "John later explains that God's love is seen in sending His Son.",
      },
      {
        reference: "Ephesians 2:4-5",
        label: "Mercy and life",
        reason: "Salvation is presented again as a work of divine love and grace.",
      },
    ],
    commentary: [
      {
        title: "Devotional",
        body: "This verse keeps the gospel deeply personal. God's saving work is not cold doctrine alone, but love moving toward a broken world.",
      },
      {
        title: "Pastoral",
        body: "Notice the movement of the verse: love leads to giving, and giving opens the way to life. The gospel is received by trust, not earned by effort.",
      },
      {
        title: "Study",
        body: "The wording emphasizes both the breadth of God's love for the world and the particularity of response in believing.",
      },
    ],
    originalLanguage: [
      {
        term: "Agapao",
        transliteration: "agapao",
        language: "Greek",
        strongs: "G25",
        partOfSpeech: "Verb",
        definition: "to love with committed, purposeful affection",
        nuance: "The verse frames salvation as the action of God's initiating love, not human deserving.",
        relatedReferences: ["1 John 4:9-10", "Romans 5:8", "Ephesians 2:4"],
      },
      {
        term: "Kosmos",
        transliteration: "kosmos",
        language: "Greek",
        strongs: "G2889",
        partOfSpeech: "Noun",
        definition: "world, ordered creation, humanity in rebellion",
        nuance: "In John, kosmos often carries the sense of a fallen world that still becomes the object of God's saving love.",
        relatedReferences: ["John 1:10", "John 12:31", "1 John 2:15-17"],
      },
      {
        term: "Pisteuo",
        transliteration: "pisteuo",
        language: "Greek",
        strongs: "G4100",
        partOfSpeech: "Verb",
        definition: "to believe, trust, rely upon",
        nuance: "John's use of believing is active reliance on the Son, not bare agreement with facts about Him.",
        relatedReferences: ["John 1:12", "John 6:35", "John 20:31"],
      },
    ],
  },
  "Psalm 23:1": {
    summary: "David frames life with God through the image of a shepherd whose care is personal, sufficient, and steady.",
    crossReferences: [
      {
        reference: "John 10:11",
        label: "The good shepherd",
        reason: "Jesus applies the shepherd image to Himself in a deeply personal way.",
      },
      {
        reference: "Ezekiel 34:11-16",
        label: "God seeks His flock",
        reason: "The Lord promises to shepherd and restore His people directly.",
      },
      {
        reference: "Philippians 4:19",
        label: "Need supplied",
        reason: "Paul echoes the theme of God's sufficiency for His people.",
      },
    ],
    commentary: [
      {
        title: "Devotional",
        body: "The Christian life begins with belonging before striving. The Lord is your shepherd first, and from that security your soul can rest.",
      },
      {
        title: "Pastoral",
        body: "David is not claiming an easy life, but a guided one. The shepherd's presence changes how lack and danger are interpreted.",
      },
      {
        title: "Study",
        body: "The statement 'I shall not want' expresses trust in God's shepherding sufficiency, not a promise of luxury or constant comfort.",
      },
    ],
    originalLanguage: [
      {
        term: "Ro'i",
        transliteration: "ro-ee",
        language: "Hebrew",
        strongs: "H7462",
        partOfSpeech: "Noun/Participle",
        definition: "my shepherd, one who tends and feeds",
        nuance: "David's image is relational and active: the Lord guides, feeds, guards, and remains present with the flock.",
        relatedReferences: ["Ezekiel 34:11-16", "John 10:11", "1 Peter 5:4"],
      },
      {
        term: "Echsar",
        transliteration: "ekh-sar",
        language: "Hebrew",
        strongs: "H2637",
        partOfSpeech: "Verb",
        definition: "to lack, be in want",
        nuance: "The line speaks of deep shepherded sufficiency, not a promise of ease or excess.",
        relatedReferences: ["Psalm 34:9-10", "Philippians 4:19", "Matthew 6:31-33"],
      },
    ],
  },
  "Romans 8:28": {
    summary: "Paul anchors suffering in the confidence that God is actively at work for His people according to His purpose.",
    crossReferences: [
      {
        reference: "Genesis 50:20",
        label: "God overrules evil",
        reason: "Joseph's story shows God bringing good through deeply painful events.",
      },
      {
        reference: "James 1:2-4",
        label: "Trials shaping maturity",
        reason: "James connects hardship with God's refining work in believers.",
      },
      {
        reference: "2 Corinthians 4:17",
        label: "Present trouble, eternal weight",
        reason: "Paul again sets suffering inside God's larger redemptive frame.",
      },
    ],
    commentary: [
      {
        title: "Devotional",
        body: "This verse does not minimize pain. It offers a stronger comfort: your story is not chaotic or abandoned, but held inside God's wise purpose.",
      },
      {
        title: "Pastoral",
        body: "Paul is not saying every event is good in itself. He is saying God can weave even real suffering into His redemptive good for His people.",
      },
      {
        title: "Study",
        body: "The promise is tethered to God's calling and purpose, which the surrounding context roots in conformity to Christ.",
      },
    ],
    originalLanguage: [
      {
        term: "Synergeo",
        transliteration: "synergeo",
        language: "Greek",
        strongs: "G4903",
        partOfSpeech: "Verb",
        definition: "to work together, cooperate toward an end",
        nuance: "Paul describes God as actively weaving circumstances into His redemptive purpose rather than calling every event good by itself.",
        relatedReferences: ["Genesis 50:20", "2 Corinthians 4:17", "James 1:2-4"],
      },
      {
        term: "Prothesis",
        transliteration: "prothesis",
        language: "Greek",
        strongs: "G4286",
        partOfSpeech: "Noun",
        definition: "purpose, plan, intention",
        nuance: "The comfort of Romans 8:28 rests in God's settled purpose, not in chance or mere optimism.",
        relatedReferences: ["Romans 8:29-30", "Ephesians 1:11", "2 Timothy 1:9"],
      },
    ],
  },
};

function buildFallbackStudyResource(reference: string, verseText: string): VerseStudyResource {
  const [bookChapter = reference, verse = ""] = reference.split(":");
  const [book, chapter] = bookChapter.split(/ (?=\d+$)/);
  const isOldTestament = BIBLE_BOOKS.findIndex((entry) => entry.name === book) <=
    BIBLE_BOOKS.findIndex((entry) => entry.name === "Malachi");

  return {
    summary: `Study ${reference} by tracing how this verse fits its chapter, how it connects to the wider story of Scripture, and what response it calls for in faith and obedience.`,
    crossReferences: [
      {
        reference: `${book} ${chapter}`,
        label: "Read the chapter",
        reason: "Keep the verse anchored in its immediate context before drawing conclusions.",
      },
      {
        reference: `${book} ${chapter}:${verse || "1"}`,
        label: "Trace the paragraph",
        reason: "Read the surrounding movement of thought and ask how the verse develops the author's main point.",
      },
      {
        reference: "Luke 24:27",
        label: "Christ-centered reading",
        reason: "Jesus teaches us to read Scripture as part of one unfolding redemptive story.",
      },
    ],
    commentary: [
      {
        title: "Devotional",
        body: "Sit with the verse slowly. Let the wording expose what it reveals about God's character before rushing toward application.",
      },
      {
        title: "Pastoral",
        body: "Ask what this verse comforts, corrects, or strengthens in ordinary discipleship. Good study should move naturally toward trust and obedience.",
      },
      {
        title: "Study",
        body: `Observe repeated words, commands, promises, and contrasts in the verse. "${verseText.slice(0, 110)}${verseText.length > 110 ? "..." : ""}" can then be interpreted within the chapter rather than in isolation.`,
      },
    ],
    originalLanguage: [
      isOldTestament
        ? {
            term: "Dabar",
            transliteration: "dah-var",
            language: "Hebrew" as const,
            strongs: "H1697",
            partOfSpeech: "Noun",
            definition: "word, matter, spoken message",
            nuance: "Hebrew study often begins by noticing how God's word and action stay tightly joined in the Old Testament.",
            relatedReferences: [`${book} ${chapter}`, "Isaiah 55:10-11", "Psalm 119:105"],
          }
        : {
            term: "Pisteuo",
            transliteration: "pisteuo",
            language: "Greek" as const,
            strongs: "G4100",
            partOfSpeech: "Verb",
            definition: "to believe, trust, rely upon",
            nuance: "Many New Testament passages call for active trust, so word study should keep relationship and response in view.",
            relatedReferences: [`${book} ${chapter}`, "John 20:31", "Romans 10:9-10"],
          },
      isOldTestament
        ? {
            term: "Hesed",
            transliteration: "heh-sed",
            language: "Hebrew" as const,
            strongs: "H2617",
            partOfSpeech: "Noun",
            definition: "steadfast love, covenant loyalty",
            nuance: "Old Testament theology is often illuminated by covenant love and faithfulness rather than isolated moral language.",
            relatedReferences: ["Exodus 34:6", "Psalm 136", "Micah 6:8"],
          }
        : {
            term: "Charis",
            transliteration: "khar-ece",
            language: "Greek" as const,
            strongs: "G5485",
            partOfSpeech: "Noun",
            definition: "grace, favor, generous gift",
            nuance: "A simple Greek word study often helps readers see how the New Testament frames salvation and discipleship as gift before achievement.",
            relatedReferences: ["Ephesians 2:8-9", "Romans 3:24", "Titus 2:11"],
          },
    ],
  };
}

export function getVerseStudyResource(
  reference: string,
  verseText: string,
): VerseStudyResource {
  return STUDY_RESOURCE_MAP[reference] ?? buildFallbackStudyResource(reference, verseText);
}
