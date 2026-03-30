"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquareText, UsersRound } from "lucide-react";

interface GroupItem {
  id: string;
  slug: string;
  title: string;
  focus: string;
  cadence: string;
  description: string;
  members: number;
  nextStep: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [cadence, setCadence] = useState("Weekly");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/groups");
      if (!response.ok) return;
      const data = (await response.json()) as { groups: GroupItem[] };
      setGroups(data.groups);
    }

    void load();
  }, []);

  async function createNewGroup() {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        focus,
        cadence,
        description,
      }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { group: GroupItem };
    setGroups((current) => [data.group, ...current]);
    setTitle("");
    setFocus("");
    setCadence("Weekly");
    setDescription("");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Groups</p>
        <h1>Create shared rhythms for study, prayer, and follow-up.</h1>
        <p className="content-lead">
          Group spaces now have a real API-backed foundation so churches,
          classes, and friends can gather around study and prayer instead of
          keeping everything in disconnected chats.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Create a group</p>
            <h2>Start a new shared study space</h2>
          </div>
          <div className="minimal-form-grid">
            <div>
              <label className="minimal-label">Group name</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="minimal-input"
                placeholder="Evening study circle"
              />
            </div>
            <div>
              <label className="minimal-label">Focus</label>
              <input
                value={focus}
                onChange={(event) => setFocus(event.target.value)}
                className="minimal-input"
                placeholder="Romans, prayer, new believers..."
              />
            </div>
            <div>
              <label className="minimal-label">Cadence</label>
              <select
                value={cadence}
                onChange={(event) => setCadence(event.target.value)}
                className="minimal-select"
              >
                <option>Weekly</option>
                <option>Twice a week</option>
                <option>Daily</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="minimal-label">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="minimal-textarea"
                rows={4}
                placeholder="Describe how this group will pray, read, and follow up together..."
              />
            </div>
            <div className="content-actions">
              <button type="button" className="button-primary" onClick={() => void createNewGroup()}>
                Create group
              </button>
              <Link href="/social" className="button-secondary">
                Community overview
              </Link>
            </div>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">What this unlocks</p>
            <h2>Shared study without group-chat chaos</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Prayer follow-up</strong>
              <p>Track requests and answered prayer inside the group itself.</p>
            </div>
            <div className="content-card-note">
              <strong>Reading plan rhythm</strong>
              <p>Point everyone toward the same passage and next step.</p>
            </div>
            <div className="content-card-note">
              <strong>Deeper prompts</strong>
              <p>Pair discussion and prayer with the new passage study page.</p>
            </div>
          </div>
        </section>
      </section>

      <section className="content-grid-three">
        {groups.map((group) => (
          <article key={group.id} className="content-card">
            <span className="content-badge">
              <UsersRound size={14} />
              {group.members} members
            </span>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <div className="content-card-note">
              <strong>{group.focus}</strong>
              <p>{group.cadence}</p>
            </div>
            <div className="content-card-note">
              <strong>Next step</strong>
              <p>{group.nextStep}</p>
            </div>
            <Link href={`/groups/${group.slug}`} className="button-secondary">
              <MessageSquareText size={16} />
              Open group
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
