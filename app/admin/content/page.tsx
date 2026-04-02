"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentType = "devotional" | "blog" | "reading-plan" | "resource" | "homepage";
type ContentStatus = "draft" | "review" | "published";

interface ContentItem {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: ContentStatus;
  featured: boolean;
  updatedAt: string;
  owner: string;
}

interface EditorState {
  type: ContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: ContentStatus;
  featured: boolean;
  owner: string;
}

const EMPTY_EDITOR: EditorState = {
  type: "blog",
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  status: "draft",
  featured: false,
  owner: "Editorial",
};

function toEditorState(item: ContentItem): EditorState {
  return {
    type: item.type,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    status: item.status,
    featured: item.featured,
    owner: item.owner,
  };
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(EMPTY_EDITOR);
  const [creatingNew, setCreatingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<ContentType | "all">("all");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/content");
      if (!response.ok) return;
      const data = (await response.json()) as { items: ContentItem[] };
      setItems(data.items);

      if (data.items.length > 0) {
        setSelectedId(data.items[0].id);
        setEditor(toEditorState(data.items[0]));
      }
    }

    void load();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return items;
    }

    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? null;

  function selectItem(item: ContentItem) {
    setCreatingNew(false);
    setSelectedId(item.id);
    setEditor(toEditorState(item));
    setStatusMessage(null);
  }

  function startNewItem() {
    setCreatingNew(true);
    setSelectedId(null);
    setEditor(EMPTY_EDITOR);
    setStatusMessage(null);
  }

  function updateEditor<K extends keyof EditorState>(
    key: K,
    value: EditorState[K],
  ) {
    setEditor((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveItem() {
    if (
      !editor.slug.trim() ||
      !editor.title.trim() ||
      !editor.excerpt.trim() ||
      !editor.body.trim() ||
      !editor.owner.trim()
    ) {
      setStatusMessage("Complete the title, slug, excerpt, body, and owner fields before saving.");
      return;
    }

    setSaving(true);
    const method = creatingNew ? "POST" : "PATCH";
    const response = await fetch("/api/admin/content", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(creatingNew ? {} : { id: selectedId }),
        ...editor,
      }),
    });

    const data = (await response.json()) as {
      item?: ContentItem;
      error?: string;
    };
    setSaving(false);

    if (!response.ok || !data.item) {
      setStatusMessage(data.error ?? "Unable to save this content item.");
      return;
    }

    setItems((current) => {
      if (creatingNew) {
        return [data.item as ContentItem, ...current];
      }

      return current.map((item) =>
        item.id === data.item?.id ? (data.item as ContentItem) : item,
      );
    });
    setCreatingNew(false);
    setSelectedId(data.item.id);
    setEditor(toEditorState(data.item));
    setStatusMessage(creatingNew ? "Content item created." : "Content item updated.");
  }

  async function removeItem() {
    if (!selectedItem) {
      return;
    }

    setSaving(true);
    const response = await fetch(`/api/admin/content?id=${selectedItem.id}`, {
      method: "DELETE",
    });
    setSaving(false);

    if (!response.ok) {
      setStatusMessage("Unable to delete this content item.");
      return;
    }

    const remaining = items.filter((item) => item.id !== selectedItem.id);
    setItems(remaining);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
      setEditor(toEditorState(remaining[0]));
      setCreatingNew(false);
    } else {
      startNewItem();
    }
    setStatusMessage("Content item deleted.");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Admin CMS</p>
        <h1>Edit, stage, and publish content from one workspace.</h1>
        <p className="content-lead">
          This editor now gives the site a real content workflow with drafts,
          publishing controls, featured flags, and editable body copy.
        </p>
        <div className="content-actions">
          <Link href="/admin/dictionary" className="button-secondary">
            View dictionary inventory
          </Link>
          <Link href="/admin/churches" className="button-secondary">
            Edit church branding
          </Link>
          <Link href="/admin/moderation" className="button-secondary">
            Open moderation queue
          </Link>
        </div>
      </section>

      <section className="content-grid-three">
        <article className="content-card">
          <h2>Drafts</h2>
          <p>{items.filter((item) => item.status === "draft").length}</p>
        </article>
        <article className="content-card">
          <h2>In review</h2>
          <p>{items.filter((item) => item.status === "review").length}</p>
        </article>
        <article className="content-card">
          <h2>Featured</h2>
          <p>{items.filter((item) => item.featured).length}</p>
        </article>
      </section>

      <section className="admin-content-layout">
        <aside className="content-card admin-content-sidebar">
          <div className="content-section-heading">
            <p className="eyebrow">Editorial queue</p>
            <h2>Content items</h2>
          </div>
          <div className="admin-content-toolbar">
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as ContentType | "all")
              }
              className="minimal-select"
            >
              <option value="all">All content</option>
              <option value="blog">Blog</option>
              <option value="devotional">Devotionals</option>
              <option value="reading-plan">Reading plans</option>
              <option value="resource">Resources</option>
              <option value="homepage">Homepage</option>
            </select>
            <button type="button" className="button-primary" onClick={startNewItem}>
              New item
            </button>
          </div>
          <div className="admin-content-list">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-content-list-item${selectedId === item.id && !creatingNew ? " admin-content-list-item-active" : ""}`}
                onClick={() => selectItem(item)}
              >
                <span className="content-chip">{item.type}</span>
                <strong>{item.title}</strong>
                <p>{item.slug}</p>
                <small>
                  {item.status} · {item.owner}
                </small>
              </button>
            ))}
          </div>
        </aside>

        <section className="content-card admin-content-editor">
          <div className="content-section-heading">
            <p className="eyebrow">{creatingNew ? "New content" : "Editor"}</p>
            <h2>{creatingNew ? "Create content item" : editor.title || "Select an item"}</h2>
          </div>

          <div className="admin-content-form-grid">
            <div>
              <label className="minimal-label" htmlFor="content-type">Type</label>
              <select
                id="content-type"
                value={editor.type}
                onChange={(event) => updateEditor("type", event.target.value as ContentType)}
                className="minimal-select"
              >
                <option value="blog">Blog</option>
                <option value="devotional">Devotional</option>
                <option value="reading-plan">Reading plan</option>
                <option value="resource">Resource</option>
                <option value="homepage">Homepage</option>
              </select>
            </div>
            <div>
              <label className="minimal-label" htmlFor="content-status">Status</label>
              <select
                id="content-status"
                value={editor.status}
                onChange={(event) => updateEditor("status", event.target.value as ContentStatus)}
                className="minimal-select"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="minimal-label" htmlFor="content-owner">Owner</label>
              <input
                id="content-owner"
                className="minimal-input"
                value={editor.owner}
                onChange={(event) => updateEditor("owner", event.target.value)}
              />
            </div>
            <div className="admin-content-featured-toggle">
              <label className="minimal-label" htmlFor="content-featured">Featured</label>
              <input
                id="content-featured"
                type="checkbox"
                checked={editor.featured}
                onChange={(event) => updateEditor("featured", event.target.checked)}
              />
            </div>
          </div>

          <div className="content-stack">
            <div>
              <label className="minimal-label" htmlFor="content-title">Title</label>
              <input
                id="content-title"
                className="minimal-input"
                value={editor.title}
                onChange={(event) => updateEditor("title", event.target.value)}
              />
            </div>
            <div>
              <label className="minimal-label" htmlFor="content-slug">Slug</label>
              <input
                id="content-slug"
                className="minimal-input"
                value={editor.slug}
                onChange={(event) => updateEditor("slug", event.target.value)}
                placeholder="your-content-slug"
              />
            </div>
            <div>
              <label className="minimal-label" htmlFor="content-excerpt">Excerpt</label>
              <textarea
                id="content-excerpt"
                className="minimal-textarea admin-content-excerpt"
                value={editor.excerpt}
                onChange={(event) => updateEditor("excerpt", event.target.value)}
              />
            </div>
            <div>
              <label className="minimal-label" htmlFor="content-body">Body</label>
              <textarea
                id="content-body"
                className="minimal-textarea admin-content-body"
                value={editor.body}
                onChange={(event) => updateEditor("body", event.target.value)}
              />
            </div>
          </div>

          <div className="admin-content-preview">
            <p className="eyebrow">Preview</p>
            <h3>{editor.title || "Untitled content item"}</h3>
            <p className="content-card-note">{editor.excerpt || "Add an excerpt to see the editorial summary here."}</p>
            <article className="admin-content-preview-body">
              {editor.body || "Body copy preview will appear here as you write."}
            </article>
          </div>

          <div className="content-actions">
            <button
              type="button"
              className="button-primary"
              disabled={saving}
              onClick={() => void saveItem()}
            >
              {saving ? "Saving..." : creatingNew ? "Create content" : "Save changes"}
            </button>
            {!creatingNew ? (
              <button
                type="button"
                className="button-secondary"
                disabled={saving || !selectedItem}
                onClick={() => void removeItem()}
              >
                Delete item
              </button>
            ) : null}
          </div>

          {statusMessage ? <p className="share-status">{statusMessage}</p> : null}
        </section>
      </section>
    </main>
  );
}
