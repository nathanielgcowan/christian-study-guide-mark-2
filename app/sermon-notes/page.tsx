"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { churchEvents, churchSpeakers, getEventById, getSpeakerById } from "@/lib/church-events";
import {
  getSermonNotes,
  saveSermonNotes,
  SermonNoteRecord as SermonNote,
} from "@/lib/client-features";

type DraftState = Omit<SermonNote, "id">;
const SERMON_NOTE_DRAFT_KEY = "csg-sermon-note-draft";

function buildPassageLink(reference: string) {
  return {
    reference,
    href: `/passage/${encodeURIComponent(reference)}`,
  };
}

function createEmptyDraft(): DraftState {
  return {
    title: "",
    speaker: "",
    speakerId: undefined,
    church: "",
    eventId: undefined,
    eventName: "",
    date: new Date().toISOString().split("T")[0],
    passage: "",
    linkedPassages: [],
    notes: "",
    prayerFollowUp: "",
    actionStep: "",
  };
}

function normalizeNote(note: SermonNote): SermonNote {
  const linkedPassages = Array.isArray(note.linkedPassages)
    ? note.linkedPassages
    : note.passage
      ? [buildPassageLink(note.passage)]
      : [];

  return {
    ...note,
    eventName: note.eventName ?? note.church,
    linkedPassages,
  };
}

export default function SermonNotesPage() {
  const [preselectedEventId, setPreselectedEventId] = useState<string | null>(null);
  const [entries, setEntries] = useState<SermonNote[]>([]);
  const [draft, setDraft] = useState<DraftState>(createEmptyDraft());
  const [passageInput, setPassageInput] = useState("");
  const [draftStatus, setDraftStatus] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getSermonNotes().map(normalizeNote));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedDraft = window.localStorage.getItem(SERMON_NOTE_DRAFT_KEY);
      if (!savedDraft) return;

      const parsed = JSON.parse(savedDraft) as Partial<DraftState> & {
        passageInput?: string;
      };

      setDraft((current) => ({ ...current, ...parsed }));
      if (typeof parsed.passageInput === "string") {
        setPassageInput(parsed.passageInput);
      }
      setDraftStatus("Unfinished sermon note restored.");
    } catch {
      // Ignore malformed draft data and keep defaults.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPreselectedEventId(new URLSearchParams(window.location.search).get("event"));
  }, []);

  useEffect(() => {
    if (!preselectedEventId) return;
    const event = getEventById(preselectedEventId);
    if (!event) return;

    const speaker = getSpeakerById(event.speakerId);
    const passages = [event.primaryPassage, ...event.supportingPassages].map(buildPassageLink);

    setDraft((current) => ({
      ...current,
      title: current.title || event.title,
      speaker: speaker?.name ?? current.speaker,
      speakerId: speaker?.id ?? current.speakerId,
      church: event.church,
      eventId: event.id,
      eventName: event.title,
      date: event.date,
      passage: current.passage || event.primaryPassage,
      linkedPassages:
        current.linkedPassages && current.linkedPassages.length > 0
          ? current.linkedPassages
          : passages,
    }));
  }, [preselectedEventId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasDraft = Boolean(
      draft.title.trim() ||
        draft.speaker.trim() ||
        draft.church.trim() ||
        draft.passage.trim() ||
        draft.notes.trim() ||
        draft.prayerFollowUp.trim() ||
        draft.actionStep.trim() ||
        passageInput.trim() ||
        (draft.linkedPassages?.length ?? 0) > 0,
    );

    if (!hasDraft) {
      window.localStorage.removeItem(SERMON_NOTE_DRAFT_KEY);
      return;
    }

    window.localStorage.setItem(
      SERMON_NOTE_DRAFT_KEY,
      JSON.stringify({
        ...draft,
        passageInput,
      }),
    );
  }, [draft, passageInput]);

  const selectedEvent = useMemo(
    () => (draft.eventId ? getEventById(draft.eventId) : null),
    [draft.eventId],
  );

  function save(next: SermonNote[]) {
    setEntries(next);
    saveSermonNotes(next);
  }

  function applyEvent(eventId: string) {
    if (!eventId) {
      setDraft((current) => ({
        ...current,
        eventId: undefined,
        eventName: "",
      }));
      return;
    }

    const event = getEventById(eventId);
    if (!event) return;

    const speaker = getSpeakerById(event.speakerId);

    setDraft((current) => ({
      ...current,
      title: current.title || event.title,
      speaker: speaker?.name ?? current.speaker,
      speakerId: speaker?.id ?? current.speakerId,
      church: event.church,
      eventId: event.id,
      eventName: event.title,
      date: event.date,
      passage: current.passage || event.primaryPassage,
      linkedPassages:
        current.linkedPassages && current.linkedPassages.length > 0
          ? current.linkedPassages
          : [event.primaryPassage, ...event.supportingPassages].map(buildPassageLink),
    }));
  }

  function applySpeaker(speakerId: string) {
    if (!speakerId) {
      setDraft((current) => ({
        ...current,
        speakerId: undefined,
      }));
      return;
    }

    const speaker = getSpeakerById(speakerId);
    if (!speaker) return;

    setDraft((current) => ({
      ...current,
      speakerId: speaker.id,
      speaker: speaker.name,
      church: current.church || speaker.church,
    }));
  }

  function addLinkedPassage() {
    const reference = passageInput.trim();
    if (!reference) return;

    setDraft((current) => {
      const currentLinks = current.linkedPassages ?? [];
      if (currentLinks.some((item) => item.reference === reference)) {
        return current;
      }

      return {
        ...current,
        passage: current.passage || reference,
        linkedPassages: [...currentLinks, buildPassageLink(reference)],
      };
    });
    setPassageInput("");
  }

  function removeLinkedPassage(reference: string) {
    setDraft((current) => {
      const nextLinkedPassages = (current.linkedPassages ?? []).filter(
        (item) => item.reference !== reference,
      );

      return {
        ...current,
        passage:
          current.passage === reference
            ? nextLinkedPassages[0]?.reference ?? ""
            : current.passage,
        linkedPassages: nextLinkedPassages,
      };
    });
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.passage.trim()) return;

    const nextNote = normalizeNote({
      ...draft,
      id: `sermon-${Date.now()}`,
      eventName: draft.eventName || draft.church,
    });

    save([nextNote, ...entries]);
    setDraft(createEmptyDraft());
    setPassageInput("");
    window.localStorage.removeItem(SERMON_NOTE_DRAFT_KEY);
    setDraftStatus("Sermon note saved.");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Sermon notes</p>
        <h1>Capture church teaching, connect it to the event, and carry the passages into the week.</h1>
        <p className="content-lead">
          Attach one sermon note to a real church event, a specific speaker,
          and multiple linked passages so follow-up study feels connected
          instead of scattered.
        </p>
      </section>

      <section className="content-grid-two">
        <form onSubmit={handleCreate} className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Create note</p>
            <h2>Start a sermon companion entry</h2>
          </div>

          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label" htmlFor="sermon-event">
                Church event
              </label>
              <select
                id="sermon-event"
                value={draft.eventId ?? ""}
                onChange={(event) => applyEvent(event.target.value)}
                className="minimal-select"
              >
                <option value="">Choose an event</option>
                {churchEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} · {event.church}
                  </option>
                ))}
              </select>
            </div>

            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className="minimal-input"
              placeholder="Sermon title"
            />

            <div>
              <label className="minimal-label" htmlFor="sermon-speaker">
                Speaker
              </label>
              <select
                id="sermon-speaker"
                value={draft.speakerId ?? ""}
                onChange={(event) => applySpeaker(event.target.value)}
                className="minimal-select"
              >
                <option value="">Choose a speaker</option>
                {churchSpeakers.map((speaker) => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name} · {speaker.role}
                  </option>
                ))}
              </select>
            </div>

            <input
              value={draft.speaker}
              onChange={(event) => setDraft({ ...draft, speaker: event.target.value })}
              className="minimal-input"
              placeholder="Speaker name"
            />

            <input
              value={draft.church}
              onChange={(event) => setDraft({ ...draft, church: event.target.value })}
              className="minimal-input"
              placeholder="Church or ministry"
            />

            <input
              type="date"
              value={draft.date}
              onChange={(event) => setDraft({ ...draft, date: event.target.value })}
              className="minimal-input"
            />

            <input
              value={draft.passage}
              onChange={(event) => setDraft({ ...draft, passage: event.target.value })}
              className="minimal-input"
              placeholder="Primary passage"
            />

            <div className="content-stack">
              <div className="content-actions">
                <input
                  value={passageInput}
                  onChange={(event) => setPassageInput(event.target.value)}
                  className="minimal-input"
                  placeholder="Add linked passage"
                />
                <button
                  type="button"
                  className="button-secondary"
                  onClick={addLinkedPassage}
                >
                  Attach passage
                </button>
              </div>

              {(draft.linkedPassages ?? []).length > 0 ? (
                <div className="content-chip-row">
                  {(draft.linkedPassages ?? []).map((item) => (
                    <button
                      key={item.reference}
                      type="button"
                      className="content-chip"
                      onClick={() => removeLinkedPassage(item.reference)}
                    >
                      {item.reference}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <textarea
              value={draft.notes}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
              className="minimal-textarea"
              rows={6}
              placeholder="Main sermon notes..."
            />
            <textarea
              value={draft.prayerFollowUp}
              onChange={(event) => setDraft({ ...draft, prayerFollowUp: event.target.value })}
              className="minimal-textarea"
              rows={4}
              placeholder="Prayer follow-up"
            />
            <textarea
              value={draft.actionStep}
              onChange={(event) => setDraft({ ...draft, actionStep: event.target.value })}
              className="minimal-textarea"
              rows={3}
              placeholder="One action step"
            />
          </div>
          <p className="content-card-meta">Drafts auto-save in this browser while you write.</p>
          {draftStatus ? <p className="share-status">{draftStatus}</p> : null}
          <button type="submit" className="button-primary">
            Save sermon note
          </button>
        </form>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Connected study</p>
            <h2>Move from the gathering into follow-up reading</h2>
          </div>

          {selectedEvent ? (
            <div className="content-stack">
              <div className="content-card-note">
                <strong>{selectedEvent.title}</strong>
                <p>
                  {selectedEvent.eventType} at {selectedEvent.church} on{" "}
                  {new Date(selectedEvent.date).toLocaleDateString()}.
                </p>
              </div>
              <div className="content-card-note">
                <strong>Main text</strong>
                <p>{selectedEvent.primaryPassage}</p>
              </div>
              <div className="content-chip-row">
                {[selectedEvent.primaryPassage, ...selectedEvent.supportingPassages].map(
                  (reference) => (
                    <Link
                      key={reference}
                      href={`/passage/${encodeURIComponent(reference)}`}
                      className="content-chip"
                    >
                      {reference}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="content-card-note">
              <strong>Attach context quickly</strong>
              <p>
                Pick a church event or speaker to prefill details and seed the
                note with the passages you want to keep studying.
              </p>
            </div>
          )}

          <div className="content-stack">
            <div className="content-card-note">
              <strong>Passage study</strong>
              <p>Open the sermon texts in the deeper study workspace during the week.</p>
            </div>
            <div className="content-card-note">
              <strong>Prayer follow-up</strong>
              <p>Turn sermon burdens or encouragement into personal prayer requests.</p>
            </div>
            <div className="content-card-note">
              <strong>Collections</strong>
              <p>Gather sermon passages into one named study series.</p>
            </div>
            <div className="content-actions">
              <Link href="/church-events" className="button-secondary">
                Browse church events
              </Link>
              <Link href="/collections" className="button-secondary">
                Open collections
              </Link>
            </div>
          </div>
        </section>
      </section>

      <section className="content-stack">
        {entries.map((entry) => (
          <article key={entry.id} className="content-card">
            <div className="content-chip-row">
              <span className="content-badge">{entry.date}</span>
              <span className="content-card-meta">{entry.speaker || "Unknown speaker"}</span>
              {entry.eventName ? <span className="content-chip">{entry.eventName}</span> : null}
            </div>
            <h2 className="content-card-title">{entry.title}</h2>
            <p>{entry.church}</p>
            <div className="content-card-note">
              <strong>{entry.passage}</strong>
              <p>{entry.notes}</p>
            </div>
            {(entry.linkedPassages ?? []).length > 0 ? (
              <div className="content-chip-row">
                {(entry.linkedPassages ?? []).map((item) => (
                  <Link key={item.reference} href={item.href} className="content-chip">
                    {item.reference}
                  </Link>
                ))}
              </div>
            ) : null}
            {entry.prayerFollowUp ? (
              <div className="content-card-note">
                <strong>Prayer follow-up</strong>
                <p>{entry.prayerFollowUp}</p>
              </div>
            ) : null}
            {entry.actionStep ? (
              <div className="content-card-note">
                <strong>Action step</strong>
                <p>{entry.actionStep}</p>
              </div>
            ) : null}
            <div className="content-actions">
              <Link href={`/passage/${encodeURIComponent(entry.passage)}`} className="button-secondary">
                Study primary passage
              </Link>
              <Link href="/church-events" className="button-secondary">
                More events
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
