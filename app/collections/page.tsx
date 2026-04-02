"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  StudyCollection,
  createStudyCollection,
  getStudyCollections,
  removeReferenceFromCollection,
} from "@/lib/client-features";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<StudyCollection[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setCollections(getStudyCollections());
  }, []);

  function handleCreateCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setCollections(createStudyCollection(name.trim(), description.trim()));
    setName("");
    setDescription("");
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Study collections</p>
        <h1>Keep your passages and themes gathered on purpose.</h1>
        <p className="content-lead">
          Build named collections for sermon prep, personal study, a group series,
          or verses you want to revisit often.
        </p>
        <div className="content-actions">
          <Link href="/exports" className="button-secondary">
            Export collections and study data
          </Link>
        </div>
      </section>

      <section className="content-grid-two">
        <form onSubmit={handleCreateCollection} className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Create</p>
            <h2>Start a new collection</h2>
          </div>
          <div className="minimal-form-grid">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="minimal-input"
              placeholder="Collection name"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="minimal-textarea"
              rows={4}
              placeholder="What is this collection for?"
            />
          </div>
          <button type="submit" className="button-primary">
            Create collection
          </button>
        </form>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Overview</p>
            <h2>Your collection library</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>{collections.length} collection{collections.length === 1 ? "" : "s"}</strong>
              <p>
                {collections.reduce((total, collection) => total + collection.items.length, 0)} saved reference
                {collections.reduce((total, collection) => total + collection.items.length, 0) === 1 ? "" : "s"} across your study library.
              </p>
            </div>
            <Link href="/dashboard" className="button-secondary">
              Back to dashboard
            </Link>
          </div>
        </section>
      </section>

      <section className="content-stack">
        {collections.map((collection) => (
          <article key={collection.id} className="content-card">
            <div className="content-section-heading">
              <p className="eyebrow">Collection</p>
              <h2>{collection.name}</h2>
              <p>{collection.description || "No description added yet."}</p>
            </div>
            {collection.items.length > 0 ? (
              <div className="content-stack">
                {collection.items.map((item) => (
                  <div key={`${collection.id}-${item.reference}`} className="content-card-note">
                    <strong>{item.reference}</strong>
                    <p>Saved {new Date(item.addedAt).toLocaleDateString()}</p>
                    <div className="content-actions">
                      <Link href={item.href} className="button-secondary">
                        Open
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setCollections(
                            removeReferenceFromCollection(collection.id, item.reference),
                          )
                        }
                        className="button-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="content-card-note">
                Add passages from the study pages to start shaping this collection.
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
