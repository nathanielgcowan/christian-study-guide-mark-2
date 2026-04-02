"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStudyCollections, StudyCollection } from "@/lib/client-features";
import {
  ExportPrayerEntry,
  exportCollectionsAsPdf,
  exportCollectionsAsText,
  exportNotesAsPdf,
  exportNotesAsText,
  exportPrayerJournalAsPdf,
  exportPrayerJournalAsText,
} from "@/lib/export-tools";

interface NoteItem {
  id: string;
  reference: string;
  content: string;
  noteType: string;
  color: string;
  updatedAt: string;
  tags: string[];
}

export default function ExportsPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [prayerEntries, setPrayerEntries] = useState<ExportPrayerEntry[]>([]);
  const [collections, setCollections] = useState<StudyCollection[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadExportData() {
      setCollections(getStudyCollections());

      if (typeof window !== "undefined") {
        try {
          const stored = window.localStorage.getItem("prayerJournal");
          setPrayerEntries(stored ? (JSON.parse(stored) as ExportPrayerEntry[]) : []);
        } catch {
          setPrayerEntries([]);
        }
      }

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

    void loadExportData();
  }, []);

  function handleExport(action: () => void, successMessage: string) {
    action();
    setStatus(successMessage);
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Export tools</p>
        <h1>Download your study notes, prayer journal, and collections.</h1>
        <p className="content-lead">
          Export your workspace as plain text files or open a print-friendly layout
          that can be saved as PDF from your browser.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">Notes</span>
          <span className="content-chip">Prayer journal</span>
          <span className="content-chip">Collections</span>
          <span className="content-chip">PDF or text</span>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-stat">
          <span>Notes ready</span>
          <strong>{signedIn ? notes.length : 0}</strong>
        </article>
        <article className="content-stat">
          <span>Prayer entries ready</span>
          <strong>{prayerEntries.length}</strong>
        </article>
        <article className="content-stat">
          <span>Collections ready</span>
          <strong>{collections.length}</strong>
        </article>
      </section>

      <section className="content-grid-three">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Notes</p>
            <h2>Export your study journal</h2>
          </div>
          <div className="content-card-note">
            <strong>{signedIn ? `${notes.length} synced note${notes.length === 1 ? "" : "s"}` : "Sign in required"}</strong>
            <p>
              Download your notes as plain text or open a print-friendly version for PDF saving.
            </p>
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-primary"
              disabled={!signedIn}
              onClick={() =>
                handleExport(() => exportNotesAsText(notes), "Notes exported as text.")
              }
            >
              Export notes as text
            </button>
            <button
              type="button"
              className="button-secondary"
              disabled={!signedIn}
              onClick={() =>
                handleExport(
                  () => exportNotesAsPdf(notes),
                  "Notes opened in a print-friendly PDF view.",
                )
              }
            >
              Export notes as PDF
            </button>
          </div>
          {!signedIn ? (
            <p className="content-card-note">
              Your synced notes live behind sign-in, so this export becomes available after authentication.
            </p>
          ) : null}
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Prayer journal</p>
            <h2>Export prayers and answers</h2>
          </div>
          <div className="content-card-note">
            <strong>{prayerEntries.length} saved prayer entr{prayerEntries.length === 1 ? "y" : "ies"}</strong>
            <p>
              Keep a readable record of ongoing requests, answered prayers, and categories.
            </p>
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-primary"
              onClick={() =>
                handleExport(
                  () => exportPrayerJournalAsText(prayerEntries),
                  "Prayer journal exported as text.",
                )
              }
            >
              Export prayers as text
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                handleExport(
                  () => exportPrayerJournalAsPdf(prayerEntries),
                  "Prayer journal opened in a print-friendly PDF view.",
                )
              }
            >
              Export prayers as PDF
            </button>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Collections</p>
            <h2>Export saved passage libraries</h2>
          </div>
          <div className="content-card-note">
            <strong>{collections.length} collection{collections.length === 1 ? "" : "s"}</strong>
            <p>
              Save your study collections as a readable list of passages and dates for sharing or backup.
            </p>
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-primary"
              onClick={() =>
                handleExport(
                  () => exportCollectionsAsText(collections),
                  "Collections exported as text.",
                )
              }
            >
              Export collections as text
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() =>
                handleExport(
                  () => exportCollectionsAsPdf(collections),
                  "Collections opened in a print-friendly PDF view.",
                )
              }
            >
              Export collections as PDF
            </button>
          </div>
        </section>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Use your browser for PDF saving</h2>
        </div>
        <div className="content-stack">
          <div className="content-card-note">
            <strong>Text export</strong>
            <p>Downloads a `.txt` file directly to your device.</p>
          </div>
          <div className="content-card-note">
            <strong>PDF export</strong>
            <p>
              Opens a print-friendly version in a new tab or window. From there, choose
              “Save as PDF” in your browser’s print dialog.
            </p>
          </div>
          <div className="content-actions">
            <Link href="/journal" className="button-secondary">
              Back to journal
            </Link>
            <Link href="/prayer-journal" className="button-secondary">
              Back to prayer journal
            </Link>
            <Link href="/collections" className="button-secondary">
              Back to collections
            </Link>
          </div>
        </div>
      </section>

      {loading ? <p className="share-status">Loading export data...</p> : null}
      {status ? <p className="share-status">{status}</p> : null}
    </main>
  );
}
