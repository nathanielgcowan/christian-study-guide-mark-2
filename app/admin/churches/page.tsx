"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ChurchProfile = {
  slug: string;
  name: string;
  city: string;
  state: string;
  tagline: string;
  summary: string;
  branding: {
    logoText: string;
    accent: string;
    accentSoft: string;
    surface: string;
    heroGradient: string;
  };
  announcements: Array<{
    id: string;
    label: string;
    title: string;
    body: string;
    href: string;
    cta: string;
  }>;
  ministryFocus: string[];
  weeklyRhythms: string[];
  featuredResources: Array<{
    label: string;
    href: string;
    description: string;
    ministryTag: string;
  }>;
  groupSlugs: string[];
};

function cloneChurch(church: ChurchProfile): ChurchProfile {
  return {
    ...church,
    branding: { ...church.branding },
    announcements: church.announcements.map((item) => ({ ...item })),
    ministryFocus: [...church.ministryFocus],
    weeklyRhythms: [...church.weeklyRhythms],
    featuredResources: church.featuredResources.map((item) => ({ ...item })),
    groupSlugs: [...church.groupSlugs],
  };
}

export default function AdminChurchesPage() {
  const [churches, setChurches] = useState<ChurchProfile[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [editor, setEditor] = useState<ChurchProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/churches");
      if (!response.ok) return;
      const data = (await response.json()) as { churches: ChurchProfile[] };
      setChurches(data.churches);
      if (data.churches.length > 0) {
        setSelectedSlug(data.churches[0].slug);
        setEditor(cloneChurch(data.churches[0]));
      }
    }

    void load();
  }, []);

  const selectedChurch = useMemo(
    () => churches.find((church) => church.slug === selectedSlug) ?? null,
    [churches, selectedSlug],
  );

  function selectChurch(church: ChurchProfile) {
    setSelectedSlug(church.slug);
    setEditor(cloneChurch(church));
    setStatusMessage(null);
  }

  function updateField<K extends keyof ChurchProfile>(key: K, value: ChurchProfile[K]) {
    setEditor((current) => (current ? { ...current, [key]: value } : current));
  }

  function updateBranding<K extends keyof ChurchProfile["branding"]>(
    key: K,
    value: ChurchProfile["branding"][K],
  ) {
    setEditor((current) =>
      current
        ? {
            ...current,
            branding: {
              ...current.branding,
              [key]: value,
            },
          }
        : current,
    );
  }

  function updateArrayItem(
    key: "announcements" | "featuredResources",
    index: number,
    field: string,
    value: string,
  ) {
    setEditor((current) => {
      if (!current) return current;
      const nextItems = current[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      );
      return {
        ...current,
        [key]: nextItems,
      };
    });
  }

  function updateStringList(key: "ministryFocus" | "weeklyRhythms", value: string) {
    updateField(
      key,
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean) as ChurchProfile[typeof key],
    );
  }

  async function saveChurch() {
    if (!editor) return;

    setSaving(true);
    const response = await fetch("/api/admin/churches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editor),
    });
    const data = (await response.json()) as { church?: ChurchProfile; error?: string };
    setSaving(false);

    if (!response.ok || !data.church) {
      setStatusMessage(data.error ?? "Unable to save church profile changes.");
      return;
    }

    setChurches((current) =>
      current.map((church) => (church.slug === data.church?.slug ? data.church : church)),
    );
    setEditor(cloneChurch(data.church));
    setStatusMessage("Church branding controls updated.");
  }

  if (!editor || !selectedChurch) {
    return (
      <main id="main-content" className="page-shell content-shell content-stack">
        <section className="content-card">
          <h2>Loading church branding controls...</h2>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Admin churches</p>
        <h1>Edit ministry branding, announcements, and featured tools.</h1>
        <p className="content-lead">
          This workspace lets you manage the church-profile presentation layer
          directly in the app instead of hand-editing the profile config.
        </p>
        <div className="content-actions">
          <Link href="/churches" className="button-secondary">
            View church profiles
          </Link>
          <Link href="/admin/content" className="button-secondary">
            Back to admin CMS
          </Link>
        </div>
      </section>

      <section className="admin-content-layout">
        <aside className="content-card admin-content-sidebar">
          <div className="content-section-heading">
            <p className="eyebrow">Churches</p>
            <h2>Profile list</h2>
          </div>
          <div className="admin-content-list">
            {churches.map((church) => (
              <button
                key={church.slug}
                type="button"
                className={`admin-content-list-item${selectedSlug === church.slug ? " admin-content-list-item-active" : ""}`}
                onClick={() => selectChurch(church)}
              >
                <span className="content-chip">{church.branding.logoText}</span>
                <strong>{church.name}</strong>
                <p>
                  {church.city}, {church.state}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <section className="content-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">Brand editor</p>
            <h2>{selectedChurch.name}</h2>
          </div>

          <section className="content-grid-two">
            <div className="minimal-form-grid">
              <input
                value={editor.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="minimal-input"
                placeholder="Church name"
              />
              <input
                value={editor.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="minimal-input"
                placeholder="City"
              />
              <input
                value={editor.state}
                onChange={(event) => updateField("state", event.target.value)}
                className="minimal-input"
                placeholder="State"
              />
              <input
                value={editor.tagline}
                onChange={(event) => updateField("tagline", event.target.value)}
                className="minimal-input"
                placeholder="Tagline"
              />
              <textarea
                value={editor.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="minimal-textarea"
                rows={4}
                placeholder="Summary"
              />
            </div>

            <div
              className="content-card"
              style={{
                background: editor.branding.heroGradient,
                borderColor: editor.branding.accentSoft,
              }}
            >
              <div className="content-chip-row">
                <span
                  className="content-badge"
                  style={{ background: editor.branding.accent, color: "#fff" }}
                >
                  {editor.branding.logoText}
                </span>
                <span className="content-chip">
                  {editor.city}, {editor.state}
                </span>
              </div>
              <h3 className="content-card-title">{editor.name}</h3>
              <p>{editor.tagline}</p>
            </div>
          </section>

          <section className="content-grid-two">
            <section className="content-card">
              <div className="content-section-heading">
                <p className="eyebrow">Branding</p>
                <h2>Logo and color controls</h2>
              </div>
              <div className="minimal-form-grid">
                <input
                  value={editor.branding.logoText}
                  onChange={(event) => updateBranding("logoText", event.target.value)}
                  className="minimal-input"
                  placeholder="Logo text"
                />
                <input
                  value={editor.branding.accent}
                  onChange={(event) => updateBranding("accent", event.target.value)}
                  className="minimal-input"
                  placeholder="#855d36"
                />
                <input
                  value={editor.branding.accentSoft}
                  onChange={(event) => updateBranding("accentSoft", event.target.value)}
                  className="minimal-input"
                  placeholder="#efe2d0"
                />
                <input
                  value={editor.branding.surface}
                  onChange={(event) => updateBranding("surface", event.target.value)}
                  className="minimal-input"
                  placeholder="#fbf6ef"
                />
                <textarea
                  value={editor.branding.heroGradient}
                  onChange={(event) => updateBranding("heroGradient", event.target.value)}
                  className="minimal-textarea"
                  rows={3}
                  placeholder="linear-gradient(...)"
                />
              </div>
            </section>

            <section className="content-card">
              <div className="content-section-heading">
                <p className="eyebrow">Ministry copy</p>
                <h2>Focus and weekly rhythms</h2>
              </div>
              <div className="minimal-form-grid">
                <textarea
                  value={editor.ministryFocus.join("\n")}
                  onChange={(event) => updateStringList("ministryFocus", event.target.value)}
                  className="minimal-textarea"
                  rows={5}
                  placeholder="One focus per line"
                />
                <textarea
                  value={editor.weeklyRhythms.join("\n")}
                  onChange={(event) => updateStringList("weeklyRhythms", event.target.value)}
                  className="minimal-textarea"
                  rows={5}
                  placeholder="One rhythm per line"
                />
              </div>
            </section>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Announcements</p>
              <h2>Ministry highlights</h2>
            </div>
            <div className="content-grid-two">
              {editor.announcements.map((announcement, index) => (
                <div key={announcement.id} className="content-card-note">
                  <input
                    value={announcement.label}
                    onChange={(event) =>
                      updateArrayItem("announcements", index, "label", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="Label"
                  />
                  <input
                    value={announcement.title}
                    onChange={(event) =>
                      updateArrayItem("announcements", index, "title", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="Announcement title"
                  />
                  <textarea
                    value={announcement.body}
                    onChange={(event) =>
                      updateArrayItem("announcements", index, "body", event.target.value)
                    }
                    className="minimal-textarea"
                    rows={4}
                    placeholder="Announcement body"
                  />
                  <input
                    value={announcement.href}
                    onChange={(event) =>
                      updateArrayItem("announcements", index, "href", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="/sermon-notes"
                  />
                  <input
                    value={announcement.cta}
                    onChange={(event) =>
                      updateArrayItem("announcements", index, "cta", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="Call to action"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Featured tools</p>
              <h2>Ministry-specific tool curation</h2>
            </div>
            <div className="content-grid-three">
              {editor.featuredResources.map((resource, index) => (
                <div key={`${resource.href}-${index}`} className="content-card-note">
                  <input
                    value={resource.ministryTag}
                    onChange={(event) =>
                      updateArrayItem("featuredResources", index, "ministryTag", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="Ministry tag"
                  />
                  <input
                    value={resource.label}
                    onChange={(event) =>
                      updateArrayItem("featuredResources", index, "label", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="Tool label"
                  />
                  <input
                    value={resource.href}
                    onChange={(event) =>
                      updateArrayItem("featuredResources", index, "href", event.target.value)
                    }
                    className="minimal-input"
                    placeholder="/groups"
                  />
                  <textarea
                    value={resource.description}
                    onChange={(event) =>
                      updateArrayItem("featuredResources", index, "description", event.target.value)
                    }
                    className="minimal-textarea"
                    rows={4}
                    placeholder="Tool description"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="content-actions">
            <button type="button" className="button-primary" onClick={() => void saveChurch()} disabled={saving}>
              {saving ? "Saving..." : "Save church profile"}
            </button>
            <Link href={`/churches/${editor.slug}`} className="button-secondary">
              Preview church page
            </Link>
          </div>

          {statusMessage ? <p className="share-status">{statusMessage}</p> : null}
        </section>
      </section>
    </main>
  );
}
