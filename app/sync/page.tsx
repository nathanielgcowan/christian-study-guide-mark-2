"use client";

import { useEffect, useState } from "react";
import {
  applySyncedFeaturesState,
  AudioProgressRecord,
  FamilyModeState,
  getSyncedFeaturesState,
  MemoryVerseRecord,
  RecentPassageItem,
  SermonNoteRecord,
  StudyCollection,
} from "@/lib/client-features";

type SyncState = {
  collections: StudyCollection[];
  recentPassages: RecentPassageItem[];
  memoryVerses: MemoryVerseRecord[];
  sermonNotes: SermonNoteRecord[];
  audioProgress: AudioProgressRecord | null;
  familyMode: FamilyModeState | null;
  updatedAt: string | null;
};

export default function SyncPage() {
  const [remote, setRemote] = useState<SyncState | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function loadRemote() {
    const response = await fetch("/api/user/sync-state");
    if (!response.ok) return;
    const data = (await response.json()) as { syncState: SyncState };
    setRemote(data.syncState);
  }

  useEffect(() => {
    void loadRemote();
  }, []);

  async function pushLocal() {
    const response = await fetch("/api/user/sync-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getSyncedFeaturesState()),
    });

    if (!response.ok) {
      setStatus("Unable to sync local data right now.");
      return;
    }

    await loadRemote();
    setStatus("Local collections, recents, and memory verses synced to your account.");
  }

  function pullRemote() {
    if (!remote) return;
    applySyncedFeaturesState(remote);
    setStatus("Synced account data copied into this browser.");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Cross-device sync</p>
        <h1>Move your local study data beyond a single browser.</h1>
        <p className="content-lead">
          Signed-in users now sync collections, recent passages, sermon notes,
          and memory progress automatically. This page still gives you a manual
          push and restore tool when you want to force a refresh.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">From this device</p>
            <h2>Push local study data to your account</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>{getSyncedFeaturesState().collections.length} collections</strong>
              <p>
                {getSyncedFeaturesState().recentPassages.length} recent passages,
                {" "}
                {getSyncedFeaturesState().memoryVerses.length} memory verses, and
                {" "}
                {getSyncedFeaturesState().sermonNotes.length} sermon notes ready
                to sync.
                {getSyncedFeaturesState().audioProgress
                  ? " Audio resume progress is included too."
                  : ""}
                {getSyncedFeaturesState().familyMode
                  ? " Family household progress is included too."
                  : ""}
              </p>
            </div>
            <button type="button" className="button-primary" onClick={() => void pushLocal()}>
              Sync to account
            </button>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">From your account</p>
            <h2>Restore synced data into this browser</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>{remote?.updatedAt ? `Last synced ${new Date(remote.updatedAt).toLocaleString()}` : "No account sync found yet"}</strong>
              <p>
                Remote snapshot includes {(remote?.collections ?? []).length} collections, {(remote?.recentPassages ?? []).length} recent passages, {(remote?.memoryVerses ?? []).length} memory verses, and {(remote?.sermonNotes ?? []).length} sermon notes.
                {remote?.audioProgress
                  ? ` Audio is saved at ${remote.audioProgress.book} ${remote.audioProgress.chapter}.`
                  : ""}
                {remote?.familyMode
                  ? " Family household progress is saved in your account too."
                  : ""}
              </p>
            </div>
            <button type="button" className="button-secondary" onClick={pullRemote} disabled={!remote?.updatedAt}>
              Restore to this device
            </button>
          </div>
        </section>
      </section>

      {status ? <div className="content-card-note">{status}</div> : null}
    </main>
  );
}
