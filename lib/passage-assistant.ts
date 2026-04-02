import { getSuggestedAtlasContext } from "@/lib/bible-atlas";
import { getSuggestedDictionaryEntries } from "@/lib/biblical-dictionary";
import { getVerseStudyResource } from "@/lib/bible";
import { getReferenceContext } from "@/lib/bible-context";

export interface PassageAssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PassageAssistantReply {
  title: string;
  answer: string;
  supports: string[];
  followUpQuestions: string[];
  citations: string[];
  limitation: string;
}

export interface PassageAssistantContextPacket {
  reference: string;
  passageText: string;
  prompts: string[];
  commentary: Array<{
    title: string;
    body: string;
  }>;
  crossReferences: Array<{
    label: string;
    reference: string;
    reason: string;
  }>;
  originalLanguage: Array<{
    term: string;
    transliteration: string;
    language: string;
    strongs: string;
    partOfSpeech: string;
    definition: string;
    nuance: string;
    relatedReferences: string[];
  }>;
  bookContext: {
    book: string;
    testament: string;
    era: string;
    approximateDate: string;
    author: string;
    audience: string;
    setting: string;
    themes: string[];
    summary: string;
    whyReadIt: string;
  };
  timeline: Array<{
    label: string;
    approximateDate: string;
    summary: string;
  }>;
  dictionary: Array<{
    term: string;
    summary: string;
    whyItMatters: string;
    keyReferences: string[];
  }>;
  atlas: {
    characters: Array<{
      name: string;
      summary: string;
      themes: string[];
    }>;
    locations: Array<{
      name: string;
      summary: string;
      significance: string;
    }>;
  };
}

function normalizeReference(value: string) {
  return value.trim().toLowerCase();
}

function truncateText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function getPassageAssistantSuggestedQuestions(reference: string) {
  const normalized = normalizeReference(reference);

  if (normalized.startsWith("john")) {
    return [
      "What does this passage reveal about the identity of Jesus?",
      "Where do you see belief, unbelief, invitation, or response in the text?",
      "How does this passage call me to trust Christ more personally today?",
      "How does this connect to the rest of John's Gospel?",
    ];
  }

  if (normalized.startsWith("psalm")) {
    return [
      "What emotion or posture toward God is strongest in this passage?",
      "How could this text shape the way I pray today?",
      "What part of this passage sounds most like worship or surrender?",
      "What does this show about trusting God honestly?",
    ];
  }

  if (normalized.startsWith("romans")) {
    return [
      "What truth about the gospel or Christian life is being emphasized here?",
      "What promise or assurance needs careful attention in context?",
      "How should this passage reframe the way I think, hope, or endure?",
      "How does this fit Paul's larger argument in Romans?",
    ];
  }

  return [
    "What is the main point of this passage?",
    "How does this fit the larger biblical story?",
    "How should I pray or respond to this text?",
    "What repeated words, contrasts, or promises deserve slower attention?",
  ];
}

export function buildPassageAssistantContext(reference: string, primaryText: string) {
  const studyResource = getVerseStudyResource(reference, primaryText);
  const referenceContext = getReferenceContext(reference);
  const atlasSuggestions = getSuggestedAtlasContext(reference);
  const dictionarySuggestions = getSuggestedDictionaryEntries(reference);
  const prompts = getPassageAssistantSuggestedQuestions(reference);

  const context: PassageAssistantContextPacket = {
    reference,
    passageText: truncateText(primaryText, 7000),
    prompts,
    commentary: studyResource.commentary.map((entry) => ({
      title: entry.title,
      body: entry.body,
    })),
    crossReferences: studyResource.crossReferences.map((entry) => ({
      label: entry.label,
      reference: entry.reference,
      reason: entry.reason,
    })),
    originalLanguage: studyResource.originalLanguage.map((entry) => ({
      term: entry.term,
      transliteration: entry.transliteration,
      language: entry.language,
      strongs: entry.strongs,
      partOfSpeech: entry.partOfSpeech,
      definition: entry.definition,
      nuance: entry.nuance,
      relatedReferences: entry.relatedReferences,
    })),
    bookContext: {
      book: referenceContext.bookContext.book,
      testament: referenceContext.bookContext.testament,
      era: referenceContext.bookContext.era,
      approximateDate: referenceContext.bookContext.approximateDate,
      author: referenceContext.bookContext.author,
      audience: referenceContext.bookContext.audience,
      setting: referenceContext.bookContext.setting,
      themes: referenceContext.bookContext.themes,
      summary: referenceContext.bookContext.summary,
      whyReadIt: referenceContext.bookContext.whyReadIt,
    },
    timeline: referenceContext.timeline.slice(0, 3).map((event) => ({
      label: event.label,
      approximateDate: event.approximateDate,
      summary: event.summary,
    })),
    dictionary: dictionarySuggestions.slice(0, 3).map((entry) => ({
      term: entry.term,
      summary: entry.summary,
      whyItMatters: entry.whyItMatters ?? entry.summary,
      keyReferences: entry.keyReferences,
    })),
    atlas: {
      characters: atlasSuggestions.characters.slice(0, 4).map((entry) => ({
        name: entry.name,
        summary: entry.summary,
        themes: entry.themes,
      })),
      locations: atlasSuggestions.locations.slice(0, 4).map((entry) => ({
        name: entry.name,
        summary: entry.summary,
        significance: entry.significance,
      })),
    },
  };

  return context;
}

export function buildFallbackPassageAssistantReply(
  question: string,
  context: PassageAssistantContextPacket,
): PassageAssistantReply {
  const normalized = question.trim().toLowerCase();
  const commentaryLead = context.commentary[0];
  const crossReferenceLead = context.crossReferences[0];
  const languageLead = context.originalLanguage[0];
  const timelineLead = context.timeline[0];
  const dictionaryLead = context.dictionary[0];
  const characterLead = context.atlas.characters[0];
  const locationLead = context.atlas.locations[0];
  const keyThemes = context.bookContext.themes.slice(0, 3).join(", ");
  const preview = truncateText(context.passageText, 260);

  if (
    normalized.includes("who") ||
    normalized.includes("people") ||
    normalized.includes("person") ||
    normalized.includes("character")
  ) {
    return {
      title: "People in view",
      answer: characterLead
        ? `${context.reference} is worth reading with ${characterLead.name} and the surrounding people in mind. Their role in the wider story helps explain why this passage matters, not just what it says on the surface.`
        : `${context.reference} should still be read with attention to the human voices involved. The original audience is ${context.bookContext.audience.toLowerCase()}, which helps frame how the passage lands.`,
      supports: [
        `Book setting: ${context.bookContext.setting}.`,
        characterLead
          ? `Connected character: ${characterLead.name}. ${characterLead.summary}`
          : `Original audience: ${context.bookContext.audience}.`,
        commentaryLead
          ? `${commentaryLead.title}: ${commentaryLead.body}`
          : `Passage preview: ${preview}`,
      ],
      followUpQuestions: [
        "How does this passage reveal God's character?",
        "What response of faith is being invited here?",
      ],
      citations: ["Book context", characterLead ? "Atlas characters" : "Passage text", "Commentary layer"],
      limitation: "This answer is using the local study context on the page rather than a live AI model response.",
    };
  }

  if (
    normalized.includes("where") ||
    normalized.includes("place") ||
    normalized.includes("location") ||
    normalized.includes("geography")
  ) {
    return {
      title: "Setting and place",
      answer: locationLead
        ? `${context.reference} becomes clearer when you picture ${locationLead.name}. Geography in Scripture often reinforces the theological movement of the text instead of serving as throwaway detail.`
        : `${context.reference} sits inside a larger biblical setting: ${context.bookContext.setting}. Even when a single verse does not name a place directly, the setting still shapes the tone and meaning.`,
      supports: [
        locationLead
          ? `${locationLead.name}: ${locationLead.summary}`
          : `Era: ${context.bookContext.era}.`,
        timelineLead
          ? `${timelineLead.label}: ${timelineLead.summary}`
          : `Book summary: ${context.bookContext.summary}`,
        locationLead
          ? `Why it matters: ${locationLead.significance}`
          : `Passage preview: ${preview}`,
      ],
      followUpQuestions: [
        "How does the historical setting shape this passage?",
        "What larger story is this passage part of?",
      ],
      citations: ["Atlas locations", "Timeline context", "Book context"],
      limitation: "This answer is using the local study context on the page rather than a live AI model response.",
    };
  }

  if (
    normalized.includes("word") ||
    normalized.includes("greek") ||
    normalized.includes("hebrew") ||
    normalized.includes("language") ||
    normalized.includes("original")
  ) {
    return {
      title: "Original-language insight",
      answer: languageLead
        ? `A helpful word-study starting point in ${context.reference} is ${languageLead.term} (${languageLead.transliteration}). It carries the sense of ${languageLead.definition.toLowerCase()}, which can sharpen how you hear the passage in context.`
        : `There is not a highlighted Greek or Hebrew note attached here yet, so the safest move is to lean on the immediate context, the commentary layer, and cross references first.`,
      supports: [
        languageLead
          ? `${languageLead.term} · ${languageLead.partOfSpeech} · ${languageLead.strongs}.`
          : `Themes in this book: ${keyThemes}.`,
        languageLead
          ? `Nuance: ${languageLead.nuance}`
          : `Passage preview: ${preview}`,
        languageLead
          ? `Related references: ${languageLead.relatedReferences.join(", ")}.`
          : commentaryLead
            ? `${commentaryLead.title}: ${commentaryLead.body}`
            : `Book summary: ${context.bookContext.summary}`,
      ],
      followUpQuestions: [
        "What is the main point of this passage?",
        "How should this shape my response?",
      ],
      citations: ["Original-language tools", "Commentary layer", "Book context"],
      limitation: "This answer is using the local study context on the page rather than a live AI model response.",
    };
  }

  if (
    normalized.includes("cross") ||
    normalized.includes("connect") ||
    normalized.includes("related") ||
    normalized.includes("reference")
  ) {
    return {
      title: "Scripture connections",
      answer: crossReferenceLead
        ? `${context.reference} is connected to passages like ${crossReferenceLead.reference} because Scripture often reinforces meaning through repeated themes, promises, and fulfillment patterns.`
        : `${context.reference} should still be read in conversation with the rest of Scripture, even when the connection points are simple rather than extensive.`,
      supports: [
        crossReferenceLead
          ? `${crossReferenceLead.label}: ${crossReferenceLead.reason}`
          : `Themes in this book: ${keyThemes}.`,
        context.crossReferences[1]
          ? `${context.crossReferences[1].label}: ${context.crossReferences[1].reason}`
          : `Passage preview: ${preview}`,
        commentaryLead
          ? `${commentaryLead.title}: ${commentaryLead.body}`
          : `Book summary: ${context.bookContext.summary}`,
      ],
      followUpQuestions: [
        "What larger biblical theme is showing up here?",
        "How does this passage point to Christ?",
      ],
      citations: ["Cross references", "Commentary layer", "Book context"],
      limitation: "This answer is using the local study context on the page rather than a live AI model response.",
    };
  }

  if (
    normalized.includes("pray") ||
    normalized.includes("prayer") ||
    normalized.includes("respond") ||
    normalized.includes("application") ||
    normalized.includes("apply") ||
    normalized.includes("obey") ||
    normalized.includes("live")
  ) {
    return {
      title: "Response and application",
      answer: commentaryLead
        ? `${context.reference} is inviting more than information. ${commentaryLead.body} A wise response is to turn the central truth of the passage into one concrete prayer or act of obedience today.`
        : `${context.reference} should move from observation into response. Try naming one truth to believe, one sin to resist, one promise to trust, or one action to take.`,
      supports: [
        `Reflection prompt: ${context.prompts[0]}`,
        context.prompts[1] ? `Reflection prompt: ${context.prompts[1]}` : `Passage preview: ${preview}`,
        dictionaryLead
          ? `${dictionaryLead.term}: ${dictionaryLead.whyItMatters}`
          : `Book summary: ${context.bookContext.summary}`,
      ],
      followUpQuestions: [
        "How can I pray this passage back to God?",
        "What does this teach me about faith and obedience?",
      ],
      citations: ["Commentary layer", "Reflection prompts", dictionaryLead ? "Dictionary" : "Book context"],
      limitation: "This answer is using the local study context on the page rather than a live AI model response.",
    };
  }

  return {
    title: "Passage overview",
    answer: commentaryLead
      ? `The main idea in ${context.reference} can be approached like this: ${commentaryLead.body} Read the passage itself first, then let the book context and connected references keep the meaning anchored.`
      : `${context.reference} should be read inside its immediate wording and its larger book context. A good summary starting point is: ${preview}`,
    supports: [
      `Book context: ${context.bookContext.summary}`,
      crossReferenceLead
        ? `${crossReferenceLead.label}: ${crossReferenceLead.reason}`
        : `Themes: ${keyThemes}.`,
      dictionaryLead
        ? `${dictionaryLead.term}: ${dictionaryLead.summary}`
        : context.prompts[0],
    ],
    followUpQuestions: [
      "What is the main point of this passage?",
      "How does this fit the larger biblical story?",
    ],
    citations: ["Book context", crossReferenceLead ? "Cross references" : "Passage text", dictionaryLead ? "Dictionary" : "Reflection prompts"],
    limitation: "This answer is using the local study context on the page rather than a live AI model response.",
  };
}
