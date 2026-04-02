"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addUserTestimony,
  deleteTestimonyDraft,
  getTestimonyDraftById,
  TestimonyDraftRecord,
} from "@/lib/client-features";

export default function NewTestimonyClient({ draftId }: { draftId?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<TestimonyDraftRecord | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "growth-story" as "answered-prayer" | "growth-story",
    summary: "",
    story: "",
    scripture: "",
  });

  useEffect(() => {
    if (!draftId) return;
    const savedDraft = getTestimonyDraftById(draftId);
    setDraft(savedDraft);

    if (savedDraft) {
      setFormData({
        title: savedDraft.title,
        author: "Anonymous",
        type: "answered-prayer",
        summary: savedDraft.summary,
        story: savedDraft.story,
        scripture: savedDraft.scripture,
      });
    }
  }, [draftId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.title.trim() || !formData.summary.trim() || !formData.story.trim()) {
      setStatus("Title, summary, and story are required.");
      return;
    }

    addUserTestimony({
      sourcePrayerRequestId: draft?.sourcePrayerRequestId,
      title: formData.title.trim(),
      type: formData.type,
      author: formData.author.trim() || "Anonymous",
      timeframe: "Shared just now",
      summary: formData.summary.trim(),
      story: formData.story.trim(),
      scripture: formData.scripture.trim() || "Psalm 66:16",
      nextStep: {
        label: formData.type === "answered-prayer" ? "Open prayer requests" : "Return to testimony wall",
        href: formData.type === "answered-prayer" ? "/user/prayer-requests" : "/testimonies",
      },
    });

    if (draft?.id) {
      deleteTestimonyDraft(draft.id);
    }

    router.push("/testimonies?created=1");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">{draft ? "Testimony draft" : "Share a testimony"}</p>
        <h1>
          {draft
            ? "Turn an answered prayer into a testimony someone else can read."
            : "Share an answered prayer or growth story from your own life."}
        </h1>
        <p className="content-lead">
          {draft
            ? "This draft was created from an answered prayer request. Finish the story, add a Scripture anchor, and publish it to your testimony wall."
            : "Use this form to submit a testimony directly from the site. You can share a clear answered prayer or a quieter story of growth that may encourage someone else."}
        </p>
      </section>

      <form onSubmit={handleSubmit} className="content-card content-stack">
        <div className="minimal-form-grid">
          <div>
            <label className="minimal-label">Story type</label>
            <select
              value={formData.type}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  type: event.target.value as "answered-prayer" | "growth-story",
                }))
              }
              className="minimal-input"
              disabled={Boolean(draft)}
            >
              <option value="growth-story">Growth story</option>
              <option value="answered-prayer">Answered prayer</option>
            </select>
          </div>
          <div>
            <label className="minimal-label">Title</label>
            <input
              value={formData.title}
              onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
              className="minimal-input"
              placeholder="What answered prayer are you sharing?"
            />
          </div>
          <div>
            <label className="minimal-label">Author name</label>
            <input
              value={formData.author}
              onChange={(event) => setFormData((current) => ({ ...current, author: event.target.value }))}
              className="minimal-input"
              placeholder="Anonymous"
            />
          </div>
          <div>
            <label className="minimal-label">Summary</label>
            <textarea
              value={formData.summary}
              onChange={(event) => setFormData((current) => ({ ...current, summary: event.target.value }))}
              className="minimal-textarea"
              rows={3}
              placeholder="One short summary of what God did."
            />
          </div>
          <div>
            <label className="minimal-label">Story</label>
            <textarea
              value={formData.story}
              onChange={(event) => setFormData((current) => ({ ...current, story: event.target.value }))}
              className="minimal-textarea"
              rows={8}
              placeholder="Tell the fuller story of the prayer and the answer."
            />
          </div>
          <div>
            <label className="minimal-label">Scripture anchor</label>
            <input
              value={formData.scripture}
              onChange={(event) => setFormData((current) => ({ ...current, scripture: event.target.value }))}
              className="minimal-input"
              placeholder="Philippians 4:6-7"
            />
          </div>
        </div>
        <div className="content-actions">
          <button type="submit" className="button-primary">
            Publish testimony
          </button>
          <Link href={draft ? "/user/prayer-requests" : "/testimonies"} className="button-secondary">
            {draft ? "Back to prayer requests" : "Back to testimony wall"}
          </Link>
        </div>
        {status ? <p className="share-status">{status}</p> : null}
      </form>
    </main>
  );
}
