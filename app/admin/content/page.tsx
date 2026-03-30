"use client";

import { useEffect, useState } from "react";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  status: "draft" | "review" | "published";
  featured: boolean;
  updatedAt: string;
  owner: string;
}

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/content");
      if (!response.ok) return;
      const data = (await response.json()) as { items: ContentItem[] };
      setItems(data.items);
    }

    void load();
  }, []);

  async function updateItem(
    id: string,
    updates: Partial<Pick<ContentItem, "status" | "featured">>,
  ) {
    const response = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { item: ContentItem };
    setItems((current) =>
      current.map((item) => (item.id === id ? data.item : item)),
    );
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Admin CMS</p>
        <h1>Manage publishing status across the site.</h1>
        <p className="content-lead">
          This content workspace is the foundation for a fuller CMS. It gives
          the admin surface a real editorial layer instead of only analytics.
        </p>
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

      <section className="content-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Editorial queue</p>
          <h2>Content items</h2>
        </div>
        {items.map((item) => (
          <div key={item.id} className="content-card-note">
            <strong>{item.title}</strong>
            <p>
              {item.type} · Owner: {item.owner} · Updated{" "}
              {new Date(item.updatedAt).toLocaleDateString()}
            </p>
            <div className="content-actions">
              <select
                value={item.status}
                onChange={(event) =>
                  void updateItem(item.id, {
                    status: event.target.value as ContentItem["status"],
                  })
                }
                className="minimal-select"
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
              <button
                type="button"
                className="button-secondary"
                onClick={() =>
                  void updateItem(item.id, { featured: !item.featured })
                }
              >
                {item.featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
