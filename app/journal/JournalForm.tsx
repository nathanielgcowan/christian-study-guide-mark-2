"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NoteItem {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  color: string;
  updatedAt: string;
  tags: string[];
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
      setStatus("Note saved.");
    } else {
      setStatus("Could not save note.");
    }
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

        {status ? <p className="share-status">{status}</p> : null}
      </form>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Saved notes</p>
          <h2>Your recent study workspace</h2>
        </div>

        {notes.length > 0 ? (
          <div className="content-stack">
            {notes.slice(0, 8).map((note) => (
              <article key={note.id} className="content-card-note">
                <strong>{note.reference}</strong>
                <p>{note.content}</p>
                <p>
                  {note.noteType} · Updated{" "}
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
                {note.tags.length > 0 ? (
                  <p>Tags: {note.tags.join(", ")}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void deleteNote(note.id)}
                  className="button-secondary"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="content-card-note">
            Notes you save here will start building a searchable study record.
          </div>
        )}
      </section>
    </section>
  );
}
