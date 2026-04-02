"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const JOURNAL_DRAFT_KEY = "csg-journal-draft";

interface NoteItem {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  color: string;
  updatedAt: string;
  tags: string[];
  folder: string | null;
  pinned: boolean;
}

export default function JournalForm() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [reference, setReference] = useState("John 3:16");
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState("note");
  const [tags, setTags] = useState("");
  const [folder, setFolder] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotes() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSignedIn(false);
        setLoading(false);
        return;
      }

      setSignedIn(true);
      const response = await fetch("/api/user/notes");
      if (response.ok) {
        const data = (await response.json()) as { notes: NoteItem[] };
        setNotes(data.notes);
      }

      try {
        const savedDraft = window.localStorage.getItem(JOURNAL_DRAFT_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft) as {
            reference?: string;
            content?: string;
            noteType?: string;
            tags?: string;
            folder?: string;
          };

          if (parsed.reference) setReference(parsed.reference);
          if (parsed.content) setContent(parsed.content);
          if (parsed.noteType) setNoteType(parsed.noteType);
          if (parsed.tags) setTags(parsed.tags);
          if (parsed.folder) setFolder(parsed.folder);
          if (parsed.reference || parsed.content || parsed.tags) {
            setStatus("Unfinished journal draft restored.");
          }
        }
      } catch {
        // Ignore malformed draft data.
      }

      setLoading(false);
    }

    void loadNotes();
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!reference.trim() || !content.trim()) return;

    setSaving(true);
    setStatus(null);

    const response = await fetch("/api/user/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        content,
        noteType,
        folder,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    });

    setSaving(false);

    if (response.ok) {
      const note = (await response.json()) as NoteItem;
      setNotes((current) => [note, ...current]);
      setContent("");
      setTags("");
      setFolder("");
      setReference("John 3:16");
      setNoteType("note");
      window.localStorage.removeItem(JOURNAL_DRAFT_KEY);
      setStatus("Note saved.");
    } else {
      setStatus("Could not save note.");
    }
  }

  useEffect(() => {
    if (loading || !signedIn) return;

    const hasDraft = Boolean(reference.trim() || content.trim() || tags.trim());
    if (!hasDraft) {
      window.localStorage.removeItem(JOURNAL_DRAFT_KEY);
      return;
    }

    window.localStorage.setItem(
      JOURNAL_DRAFT_KEY,
      JSON.stringify({
        reference,
        content,
        noteType,
        folder,
        tags,
      }),
    );
  }, [content, folder, loading, noteType, reference, signedIn, tags]);

  const availableTags = Array.from(
    new Set(notes.flatMap((note) => note.tags).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right));

  const availableFolders = Array.from(
    new Set(
      notes
        .map((note) => note.folder)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((left, right) => left.localeCompare(right));

  const filteredNotes = notes.filter((note) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      note.reference.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      (note.folder ?? "").toLowerCase().includes(query);
    const matchesTag = selectedTag === "all" || note.tags.includes(selectedTag);
    const matchesFolder =
      selectedFolder === "all" || (note.folder ?? "Unfiled") === selectedFolder;
    const matchesPinned = !pinnedOnly || note.pinned;

    return matchesSearch && matchesTag && matchesFolder && matchesPinned;
  });

  async function updateNoteOrganization(
    note: NoteItem,
    updates: Partial<Pick<NoteItem, "folder" | "pinned">>,
  ) {
    const response = await fetch("/api/user/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: note.id,
        folder: updates.folder !== undefined ? updates.folder : note.folder,
        pinned: updates.pinned !== undefined ? updates.pinned : note.pinned,
      }),
    });

    if (!response.ok) {
      setStatus("Could not update note organization.");
      return;
    }

    const updated = (await response.json()) as NoteItem;
    setNotes((current) =>
      current
        .map((entry) => (entry.id === updated.id ? { ...entry, ...updated } : entry))
        .sort((left, right) => {
          if (left.pinned !== right.pinned) {
            return left.pinned ? -1 : 1;
          }
          return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
        }),
    );
    setStatus(updated.pinned ? "Note pinned." : "Note organization updated.");
  }

  async function deleteNote(id: string) {
    const response = await fetch(`/api/user/notes?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setNotes((current) => current.filter((note) => note.id !== id));
    }
  }

  if (loading) {
    return (
      <section className="content-card">
        <h2>Loading notes...</h2>
      </section>
    );
  }

  if (!signedIn) {
    return (
      <section className="content-card">
        <h2>Sign in to keep synced study notes.</h2>
        <div className="content-actions">
          <Link href="/auth/signin" className="button-primary">
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="content-grid-two">
      <form onSubmit={handleSave} className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Capture insight</p>
          <h2>Add a note or highlight</h2>
        </div>

        <div className="minimal-form-grid">
          <div>
            <label className="minimal-label">Reference</label>
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="minimal-input"
              placeholder="John 3:16"
            />
          </div>

          <div>
            <label className="minimal-label">Note type</label>
            <select
              value={noteType}
              onChange={(event) => setNoteType(event.target.value)}
              className="minimal-select"
            >
              <option value="note">Note</option>
              <option value="highlight">Highlight</option>
              <option value="question">Question</option>
            </select>
          </div>

          <div>
            <label className="minimal-label">Tags</label>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="minimal-input"
              placeholder="grace, gospel, prayer"
            />
          </div>

          <div>
            <label className="minimal-label">Folder</label>
            <input
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              className="minimal-input"
              placeholder="Sermons, Prayer, Romans study"
            />
          </div>

          <div>
            <label className="minimal-label">Content</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="minimal-textarea"
              rows={8}
              placeholder="Write your observations, questions, or application..."
            />
          </div>
        </div>

        <div className="content-actions">
          <button type="submit" disabled={saving} className="button-primary">
            {saving ? "Saving..." : "Save note"}
          </button>
        </div>

        <p className="content-card-meta">Drafts auto-save in this browser while you write.</p>
        {status ? <p className="share-status">{status}</p> : null}
      </form>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Saved notes</p>
          <h2>Your organized study workspace</h2>
        </div>

        <div className="minimal-form-grid">
          <div>
            <label className="minimal-label">Search notes</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="minimal-input"
              placeholder="Search reference, content, folder, or tag"
            />
          </div>
          <div>
            <label className="minimal-label">Filter by tag</label>
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="minimal-select"
            >
              <option value="all">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="minimal-label">Filter by folder</label>
            <select
              value={selectedFolder}
              onChange={(event) => setSelectedFolder(event.target.value)}
              className="minimal-select"
            >
              <option value="all">All folders</option>
              <option value="Unfiled">Unfiled</option>
              {availableFolders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="content-chip-row">
          <button
            type="button"
            onClick={() => setPinnedOnly((current) => !current)}
            className={pinnedOnly ? "button-primary button-small" : "button-secondary button-small"}
          >
            {pinnedOnly ? "Showing pinned only" : "Show pinned only"}
          </button>
          <span className="content-chip">{availableFolders.length} folders</span>
          <span className="content-chip">{availableTags.length} tags</span>
        </div>

        {filteredNotes.length > 0 ? (
          <div className="content-stack">
            {filteredNotes.map((note) => (
              <article key={note.id} className="content-card-note">
                <div className="content-chip-row">
                  <strong>{note.reference}</strong>
                  {note.pinned ? <span className="content-badge">Pinned</span> : null}
                  <span className="content-chip">{note.folder ?? "Unfiled"}</span>
                </div>
                <p>{note.content}</p>
                <p>
                  {note.noteType} · Updated{" "}
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
                {note.tags.length > 0 ? (
                  <p>Tags: {note.tags.join(", ")}</p>
                ) : null}
                <div className="content-actions">
                  <button
                    type="button"
                    onClick={() =>
                      void updateNoteOrganization(note, {
                        pinned: !note.pinned,
                      })
                    }
                    className="button-secondary"
                  >
                    {note.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void updateNoteOrganization(note, {
                        folder: note.folder ? null : "General",
                      })
                    }
                    className="button-secondary"
                  >
                    {note.folder ? "Clear folder" : "Move to General"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteNote(note.id)}
                    className="button-secondary"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="content-card-note">
            Notes you save here will build a searchable, folder-based study record.
          </div>
        )}
      </section>
    </section>
  );
}
