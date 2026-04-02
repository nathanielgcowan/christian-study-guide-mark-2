export const RECENT_PASSAGES_KEY = "csg-recent-passages";
export const STUDY_COLLECTIONS_KEY = "csg-study-collections";
export const MEMORY_VERSES_KEY = "memoryVerses";
export const SERMON_NOTES_KEY = "csg-sermon-notes";
export const AUDIO_PROGRESS_KEY = "csg-audio-progress";
export const TESTIMONY_ENTRIES_KEY = "csg-testimony-entries";
export const TESTIMONY_DRAFTS_KEY = "csg-testimony-drafts";
export const FAMILY_MODE_KEY = "csg-family-mode";
export const SYNC_META_KEY = "csg-sync-meta";
export const AUTO_SYNC_EVENT = "csg:auto-sync-updated";

export type RecentPassageItem = {
  reference: string;
  href: string;
  type: "passage" | "chapter";
  savedAt: string;
};

export type StudyCollectionItem = {
  reference: string;
  href: string;
  addedAt: string;
};

export type StudyCollection = {
  id: string;
  name: string;
  description: string;
  items: StudyCollectionItem[];
  updatedAt: string;
};

export type MemoryVerseRecord = {
  id: string;
  reference: string;
  text: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  mastered: boolean;
  lastReviewed: string;
  reviewCount: number;
};

export type SermonNoteRecord = {
  id: string;
  title: string;
  speaker: string;
  speakerId?: string;
  church: string;
  eventId?: string;
  eventName?: string;
  date: string;
  passage: string;
  linkedPassages?: {
    reference: string;
    href: string;
  }[];
  notes: string;
  prayerFollowUp: string;
  actionStep: string;
};

export type AudioProgressRecord = {
  book: string;
  chapter: number;
  translation: string;
  activeVerseIndex: number;
  activeVerseNumber: number | null;
  speechRate: number;
  isPlaying: boolean;
  updatedAt: string;
};

export type FamilyModeState = {
  activePlanId: string;
  completedParentDays: number[];
  completedChildDays: number[];
  masteredVerseIds: string[];
};

export type TestimonyRecord = {
  id: string;
  sourcePrayerRequestId?: string;
  title: string;
  type: "answered-prayer" | "growth-story";
  author: string;
  timeframe: string;
  summary: string;
  story: string;
  scripture: string;
  nextStep: {
    label: string;
    href: string;
  };
  createdAt: string;
};

export type TestimonyDraftRecord = {
  id: string;
  sourcePrayerRequestId: string;
  title: string;
  summary: string;
  story: string;
  scripture: string;
  createdAt: string;
};

export type SyncedFeaturesState = {
  collections: StudyCollection[];
  recentPassages: RecentPassageItem[];
  memoryVerses: MemoryVerseRecord[];
  sermonNotes: SermonNoteRecord[];
  audioProgress: AudioProgressRecord | null;
  familyMode: FamilyModeState | null;
  updatedAt: string | null;
};

type SyncMeta = {
  lastLocalChangeAt: string | null;
  lastRemoteAppliedAt: string | null;
  lastPushedAt: string | null;
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  directWrite(key, value);
  touchLocalSyncMeta();
}

function directWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readSyncMeta() {
  return safeRead<SyncMeta>(SYNC_META_KEY, {
    lastLocalChangeAt: null,
    lastRemoteAppliedAt: null,
    lastPushedAt: null,
  });
}

function writeSyncMeta(meta: SyncMeta) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
}

function dispatchAutoSyncEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTO_SYNC_EVENT));
}

function touchLocalSyncMeta() {
  const now = new Date().toISOString();
  const current = readSyncMeta();
  writeSyncMeta({
    ...current,
    lastLocalChangeAt: now,
  });
  dispatchAutoSyncEvent();
}

export function markSyncPushed(pushedAt: string) {
  const current = readSyncMeta();
  writeSyncMeta({
    ...current,
    lastPushedAt: pushedAt,
  });
}

export function markRemoteSyncApplied(appliedAt: string) {
  const current = readSyncMeta();
  writeSyncMeta({
    ...current,
    lastRemoteAppliedAt: appliedAt,
    lastPushedAt: appliedAt,
  });
}

export function getSyncMeta() {
  return readSyncMeta();
}

export function getRecentPassages() {
  return safeRead<RecentPassageItem[]>(RECENT_PASSAGES_KEY, []);
}

export function pushRecentPassage(item: Omit<RecentPassageItem, "savedAt">) {
  const current = getRecentPassages();
  const next: RecentPassageItem[] = [
    { ...item, savedAt: new Date().toISOString() },
    ...current.filter((entry) => entry.reference !== item.reference),
  ].slice(0, 8);
  safeWrite(RECENT_PASSAGES_KEY, next);
  return next;
}

export function getStudyCollections() {
  const collections = safeRead<StudyCollection[]>(STUDY_COLLECTIONS_KEY, []);
  if (collections.length > 0) {
    return collections;
  }

  const defaultCollection: StudyCollection = {
    id: "collection-default",
    name: "My Study Collection",
    description: "A place to gather passages you want to revisit.",
    items: [],
    updatedAt: new Date(0).toISOString(),
  };
  return [defaultCollection];
}

export function saveStudyCollections(collections: StudyCollection[]) {
  safeWrite(STUDY_COLLECTIONS_KEY, collections);
}

export function addReferenceToCollection(
  collectionId: string,
  item: Omit<StudyCollectionItem, "addedAt">,
) {
  const collections = getStudyCollections();
  const nextCollections = collections.map((collection) => {
    if (collection.id !== collectionId) return collection;

    const nextItems = [
      { ...item, addedAt: new Date().toISOString() },
      ...collection.items.filter((entry) => entry.reference !== item.reference),
    ];

    return {
      ...collection,
      items: nextItems.slice(0, 50),
      updatedAt: new Date().toISOString(),
    };
  });

  saveStudyCollections(nextCollections);
  return nextCollections;
}

export function createStudyCollection(name: string, description: string) {
  const collections = getStudyCollections();
  const nextCollection: StudyCollection = {
    id: `collection-${Date.now()}`,
    name,
    description,
    items: [],
    updatedAt: new Date().toISOString(),
  };
  const nextCollections = [nextCollection, ...collections];
  saveStudyCollections(nextCollections);
  return nextCollections;
}

export function removeReferenceFromCollection(collectionId: string, reference: string) {
  const collections = getStudyCollections();
  const nextCollections = collections.map((collection) =>
    collection.id === collectionId
      ? {
          ...collection,
          items: collection.items.filter((item) => item.reference !== reference),
          updatedAt: new Date().toISOString(),
        }
      : collection,
  );
  saveStudyCollections(nextCollections);
  return nextCollections;
}

export function getMemoryVerses() {
  return safeRead<MemoryVerseRecord[]>(MEMORY_VERSES_KEY, []);
}

export function saveMemoryVerses(verses: MemoryVerseRecord[]) {
  safeWrite(MEMORY_VERSES_KEY, verses);
}

export function getSermonNotes() {
  return safeRead<SermonNoteRecord[]>(SERMON_NOTES_KEY, []);
}

export function saveSermonNotes(entries: SermonNoteRecord[]) {
  safeWrite(SERMON_NOTES_KEY, entries);
}

export function getAudioProgress() {
  return safeRead<AudioProgressRecord | null>(AUDIO_PROGRESS_KEY, null);
}

export function saveAudioProgress(progress: AudioProgressRecord) {
  safeWrite(AUDIO_PROGRESS_KEY, progress);
}

export function getFamilyModeState() {
  return safeRead<FamilyModeState | null>(FAMILY_MODE_KEY, null);
}

export function saveFamilyModeState(state: FamilyModeState) {
  safeWrite(FAMILY_MODE_KEY, state);
}

export function getUserTestimonies() {
  return safeRead<TestimonyRecord[]>(TESTIMONY_ENTRIES_KEY, []);
}

export function saveUserTestimonies(entries: TestimonyRecord[]) {
  safeWrite(TESTIMONY_ENTRIES_KEY, entries);
}

export function addUserTestimony(entry: Omit<TestimonyRecord, "id" | "createdAt">) {
  const current = getUserTestimonies();
  const nextEntry: TestimonyRecord = {
    ...entry,
    id: `testimony-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const next = [nextEntry, ...current];
  saveUserTestimonies(next);
  return nextEntry;
}

export function getTestimonyDrafts() {
  return safeRead<TestimonyDraftRecord[]>(TESTIMONY_DRAFTS_KEY, []);
}

export function saveTestimonyDrafts(entries: TestimonyDraftRecord[]) {
  safeWrite(TESTIMONY_DRAFTS_KEY, entries);
}

export function createTestimonyDraftFromPrayer(prayerRequest: {
  id: string;
  title: string;
  description: string;
}) {
  const current = getTestimonyDrafts();
  const existing = current.find((entry) => entry.sourcePrayerRequestId === prayerRequest.id);
  if (existing) {
    return existing;
  }

  const nextDraft: TestimonyDraftRecord = {
    id: `testimony-draft-${Date.now()}`,
    sourcePrayerRequestId: prayerRequest.id,
    title: prayerRequest.title,
    summary: prayerRequest.description,
    story: `God answered this prayer in a way I want to remember:\n\n${prayerRequest.description}\n\nWhat changed:\n`,
    scripture: "",
    createdAt: new Date().toISOString(),
  };

  saveTestimonyDrafts([nextDraft, ...current]);
  return nextDraft;
}

export function getTestimonyDraftById(id: string) {
  return getTestimonyDrafts().find((entry) => entry.id === id) ?? null;
}

export function deleteTestimonyDraft(id: string) {
  const next = getTestimonyDrafts().filter((entry) => entry.id !== id);
  saveTestimonyDrafts(next);
}

export function getSyncedFeaturesState(): SyncedFeaturesState {
  return {
    collections: getStudyCollections(),
    recentPassages: getRecentPassages(),
    memoryVerses: getMemoryVerses(),
    sermonNotes: getSermonNotes(),
    audioProgress: getAudioProgress(),
    familyMode: getFamilyModeState(),
    updatedAt: getSyncMeta().lastPushedAt,
  };
}

export function applySyncedFeaturesState(state: Partial<SyncedFeaturesState>) {
  directWrite(STUDY_COLLECTIONS_KEY, Array.isArray(state.collections) ? state.collections : []);
  directWrite(RECENT_PASSAGES_KEY, Array.isArray(state.recentPassages) ? state.recentPassages : []);
  directWrite(MEMORY_VERSES_KEY, Array.isArray(state.memoryVerses) ? state.memoryVerses : []);
  directWrite(SERMON_NOTES_KEY, Array.isArray(state.sermonNotes) ? state.sermonNotes : []);
  directWrite(AUDIO_PROGRESS_KEY, state.audioProgress ?? null);
  directWrite(FAMILY_MODE_KEY, state.familyMode ?? null);

  if (state.updatedAt) {
    markRemoteSyncApplied(state.updatedAt);
  }

  dispatchAutoSyncEvent();
}

function daysSince(dateString: string) {
  if (!dateString) return Number.POSITIVE_INFINITY;
  const reviewedAt = new Date(dateString);
  const diff = Date.now() - reviewedAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getMemoryReviewQueue(verses: MemoryVerseRecord[]) {
  return [...verses]
    .filter((verse) => !verse.mastered)
    .map((verse) => {
      const reviewGap = daysSince(verse.lastReviewed);
      const interval = Math.max(1, Math.min(verse.reviewCount + 1, 5));
      const due = reviewGap >= interval;

      return {
        ...verse,
        reviewGap,
        interval,
        due,
      };
    })
    .sort((left, right) => {
      if (left.due !== right.due) return left.due ? -1 : 1;
      return right.reviewGap - left.reviewGap;
    });
}

export function getVerseOfTheDay() {
  const verses = [
    {
      reference: "Psalm 119:105",
      text: "Your word is a lamp to my feet and a light to my path.",
      theme: "Guidance",
    },
    {
      reference: "Isaiah 40:31",
      text: "Those who hope in the Lord will renew their strength.",
      theme: "Strength",
    },
    {
      reference: "John 15:5",
      text: "Whoever remains in me and I in him bears much fruit.",
      theme: "Abiding",
    },
    {
      reference: "Romans 8:28",
      text: "In all things God works for the good of those who love him.",
      theme: "Hope",
    },
    {
      reference: "Philippians 4:6-7",
      text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
      theme: "Prayer",
    },
    {
      reference: "Lamentations 3:22-23",
      text: "His mercies never come to an end; they are new every morning.",
      theme: "Mercy",
    },
    {
      reference: "Joshua 1:9",
      text: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.",
      theme: "Courage",
    },
  ];

  const start = Date.UTC(2026, 0, 1);
  const today = new Date();
  const current = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const dayIndex = Math.floor((current - start) / (1000 * 60 * 60 * 24));
  return verses[((dayIndex % verses.length) + verses.length) % verses.length];
}
