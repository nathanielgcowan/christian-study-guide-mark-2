"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import {
  BIBLE_BOOKS,
  BiblePassageVerse,
  findBibleBook,
  getDefaultBibleReference,
  SUPPORTED_TRANSLATIONS,
} from "@/lib/bible";
import {
  getAudioProgress,
  saveAudioProgress,
  type AudioProgressRecord,
} from "@/lib/client-features";

interface AudioBiblePayload {
  book: string;
  chapter: number;
  chapterCount: number;
  translation: string;
  verses: BiblePassageVerse[];
}

export default function AudioBibleClient() {
  const defaults = getDefaultBibleReference();
  const restoredProgressRef = useRef<AudioProgressRecord | null>(null);
  const didRestoreRef = useRef(false);
  const persistReadyRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [book, setBook] = useState(defaults.book);
  const [chapter, setChapter] = useState(defaults.chapter);
  const [translation, setTranslation] = useState<string>(defaults.translation);
  const [payload, setPayload] = useState<AudioBiblePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [speechRate, setSpeechRate] = useState(1);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const savedProgress = getAudioProgress();
    if (!savedProgress) {
      didRestoreRef.current = true;
      persistReadyRef.current = true;
      return;
    }

    restoredProgressRef.current = savedProgress;
    setBook(savedProgress.book);
    setChapter(savedProgress.chapter);
    setTranslation(savedProgress.translation);
    setSpeechRate(savedProgress.speechRate);
    didRestoreRef.current = true;
  }, []);

  const chapterOptions = useMemo(() => {
    const currentBook = findBibleBook(book);
    const chapterCount = currentBook?.chapters ?? 1;
    return Array.from({ length: chapterCount }, (_, index) => index + 1);
  }, [book]);

  useEffect(() => {
    async function loadPassage() {
      setLoading(true);
      const params = new URLSearchParams({
        book,
        chapter: String(chapter),
        translation,
      });

      const response = await fetch(`/api/bible/passage?${params.toString()}`);
      if (response.ok) {
        const data = (await response.json()) as AudioBiblePayload;
        setPayload(data);
        const restored = restoredProgressRef.current;
        const shouldRestoreVerse =
          restored &&
          restored.book === data.book &&
          restored.chapter === data.chapter &&
          restored.translation === data.translation;

        setActiveVerseIndex(
          shouldRestoreVerse
            ? Math.min(restored.activeVerseIndex, Math.max(data.verses.length - 1, 0))
            : 0,
        );
        restoredProgressRef.current = null;
        persistReadyRef.current = true;
        setAudioError(null);
      } else {
        setPayload(null);
      }
      setLoading(false);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    void loadPassage();
  }, [book, chapter, translation]);

  useEffect(() => {
    if (!persistReadyRef.current || !didRestoreRef.current) return;

    const activeVerse = payload?.verses[activeVerseIndex];
    saveAudioProgress({
      book,
      chapter,
      translation,
      activeVerseIndex,
      activeVerseNumber: activeVerse?.number ?? null,
      speechRate,
      isPlaying,
      updatedAt: new Date().toISOString(),
    });
  }, [activeVerseIndex, book, chapter, isPlaying, payload, speechRate, translation]);

  const audioSrc = useMemo(() => {
    const params = new URLSearchParams({
      book,
      chapter: String(chapter),
      translation,
    });
    return `/api/bible/audio?${params.toString()}`;
  }, [book, chapter, translation]);

  const estimatedVerseIndex = useMemo(() => {
    if (!payload?.verses.length || !duration || !currentTime) {
      return activeVerseIndex;
    }

    const ratio = Math.max(0, Math.min(0.999, currentTime / duration));
    return Math.min(
      payload.verses.length - 1,
      Math.floor(ratio * payload.verses.length),
    );
  }, [activeVerseIndex, currentTime, duration, payload]);

  useEffect(() => {
    if (!payload?.verses.length) return;
    if (estimatedVerseIndex !== activeVerseIndex) {
      setActiveVerseIndex(estimatedVerseIndex);
    }
  }, [activeVerseIndex, estimatedVerseIndex, payload]);

  async function playFromVerse(index: number) {
    const audio = audioRef.current;
    if (!audio || !payload?.verses.length) return;

    if (duration > 0) {
      const ratio = index / Math.max(payload.verses.length, 1);
      audio.currentTime = Math.max(0, Math.min(duration - 0.25, duration * ratio));
      setCurrentTime(audio.currentTime);
    }

    audio.playbackRate = speechRate;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setAudioError("Unable to start narrated audio in this browser right now.");
    }
  }

  function stopPlayback() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Audio Bible mode</p>
        <h1>Listen to narrated chapter audio while staying anchored to the text.</h1>
        <p className="content-lead">
          This listening mode uses generated chapter audio instead of browser
          text-to-speech, keeps your current verse visible, and makes it easy
          to jump back into the Bible reader whenever you want to read with
          your eyes again.
        </p>
        <p className="content-card-meta">
          Narration is AI-generated audio, not a human voice recording.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Chapter audio</p>
            <h2>Choose what to listen to</h2>
          </div>
          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label">Book</label>
              <select
                value={book}
                onChange={(event) => setBook(event.target.value)}
                className="minimal-select"
              >
                {BIBLE_BOOKS.map((entry) => (
                  <option key={entry.name} value={entry.name}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="minimal-label">Chapter</label>
              <select
                value={chapter}
                onChange={(event) => setChapter(Number(event.target.value))}
                className="minimal-select"
              >
                {chapterOptions.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="minimal-label">Translation</label>
              <select
                value={translation}
                onChange={(event) => setTranslation(event.target.value)}
                className="minimal-select"
              >
                {SUPPORTED_TRANSLATIONS.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="minimal-label">Playback speed</label>
              <select
                value={speechRate}
                onChange={(event) => setSpeechRate(Number(event.target.value))}
                className="minimal-select"
              >
                <option value={0.85}>0.85x</option>
                <option value={1}>1.0x</option>
                <option value={1.08}>1.1x</option>
                <option value={1.2}>1.2x</option>
              </select>
            </div>
          </div>
          <audio
            ref={audioRef}
            key={audioSrc}
            src={audioSrc}
            preload="metadata"
            onLoadedMetadata={(event) => {
              const audio = event.currentTarget;
              audio.playbackRate = speechRate;
              setDuration(audio.duration || 0);
              const restored = restoredProgressRef.current;
              if (restored?.activeVerseIndex && payload?.verses.length && audio.duration) {
                const ratio = restored.activeVerseIndex / Math.max(payload.verses.length, 1);
                audio.currentTime = Math.max(0, Math.min(audio.duration - 0.25, audio.duration * ratio));
                setCurrentTime(audio.currentTime);
              }
            }}
            onTimeUpdate={(event) => {
              setCurrentTime(event.currentTarget.currentTime);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(duration);
            }}
            onError={() =>
              setAudioError(
                "Narrated audio could not be loaded. Add OPENAI_API_KEY to enable chapter narration.",
              )
            }
            className="w-full"
            controls
          />
          <div className="content-actions">
            <button
              type="button"
              onClick={() => void playFromVerse(activeVerseIndex)}
              disabled={loading || !payload?.verses.length}
              className="button-primary"
            >
              <Play size={16} />
              {isPlaying ? "Restart from current verse" : "Play chapter"}
            </button>
            <button
              type="button"
              onClick={stopPlayback}
              disabled={!isPlaying}
              className="button-secondary"
            >
              <Pause size={16} />
              Stop
            </button>
            <button
              type="button"
              onClick={() => {
                stopPlayback();
                setActiveVerseIndex(0);
                setCurrentTime(0);
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                }
              }}
              className="button-secondary"
            >
              <RotateCcw size={16} />
              Restart chapter
            </button>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Listening flow</p>
            <h2>Use audio without losing your place</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Resume listening</strong>
              <p>
                {payload?.verses[activeVerseIndex]
                  ? `Pick up at verse ${payload.verses[activeVerseIndex].number} in ${book} ${chapter}.`
                  : "Choose a chapter and your listening progress will be saved automatically."}
              </p>
            </div>
            <div className="content-card-note">
              <strong>
                {payload ? `${payload.book} ${payload.chapter}` : "Choose a chapter"}
              </strong>
              <p>
                {loading
                  ? "Loading chapter audio..."
                  : `${payload?.verses.length ?? 0} verses ready for narrated playback in ${translation.toUpperCase()}.`}
              </p>
            </div>
            <div className="content-card-note">
              <strong>Current verse</strong>
              <p>
                {payload?.verses[activeVerseIndex]
                  ? `${payload.verses[activeVerseIndex].number}. ${payload.verses[activeVerseIndex].text}`
                  : "Playback has not started yet."}
              </p>
            </div>
            <div className="content-actions">
              <Link
                href={`/bible/${encodeURIComponent(book)}/${chapter}`}
                className="button-secondary"
              >
                Open in Bible reader
              </Link>
              <Link
                href={`/passage/${encodeURIComponent(`${book} ${chapter}`)}`}
                className="button-secondary"
              >
                Open passage workspace
              </Link>
            </div>
            {audioError ? <p className="share-status">{audioError}</p> : null}
          </div>
        </section>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Verse queue</p>
          <h2>See the chapter while you listen</h2>
        </div>
        {loading ? (
          <div className="content-card-note">Loading chapter...</div>
        ) : (
          <div className="content-stack">
            {payload?.verses.map((verse, index) => (
              <button
                key={`${payload.book}-${payload.chapter}-${verse.number}`}
                type="button"
                onClick={() => {
                  setActiveVerseIndex(index);
                  if (isPlaying) {
                    void playFromVerse(index);
                  } else if (audioRef.current && duration > 0) {
                    const ratio = index / Math.max(payload.verses.length, 1);
                    audioRef.current.currentTime = Math.max(
                      0,
                      Math.min(duration - 0.25, duration * ratio),
                    );
                    setCurrentTime(audioRef.current.currentTime);
                  }
                }}
                className="content-card-note"
                style={{
                  textAlign: "left",
                  borderColor:
                    activeVerseIndex === index ? "var(--line-strong)" : undefined,
                  background:
                    activeVerseIndex === index ? "var(--accent-soft)" : undefined,
                }}
              >
                <strong>
                  <Volume2
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: "0.45rem" }}
                  />
                  Verse {verse.number}
                </strong>
                <p>{verse.text}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="content-grid-three">
        <article className="content-card">
          <span className="content-badge">
            <Headphones size={14} />
            Narrated audio
          </span>
          <h2>Use it on walks or commutes</h2>
          <p>Recorded-style chapter audio helps Scripture stay close when reading with your eyes is harder.</p>
        </article>
        <article className="content-card">
          <span className="content-badge">Follow along</span>
          <h2>Keep the active verse visible</h2>
          <p>Watch the chapter progress verse by verse so the text remains connected to the listening.</p>
        </article>
        <article className="content-card">
          <span className="content-badge">Study handoff</span>
          <h2>Jump back into deeper study fast</h2>
          <p>Move straight into the Bible reader or passage workspace when one verse needs closer attention.</p>
        </article>
      </section>
    </main>
  );
}
