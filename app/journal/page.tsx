import Link from "next/link";
import JournalForm from "./JournalForm";

export default function JournalPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Notes and highlights</p>
        <h1>A synced journal for Scripture notes, questions, and study insights.</h1>
        <p className="content-lead">
          Capture what stood out in the passage, keep questions tied to a
          reference, and build a real study workspace instead of a single local
          textarea.
        </p>
        <div className="content-actions">
          <Link href="/exports" className="button-secondary">
            Export notes and study data
          </Link>
        </div>
      </section>

      <JournalForm />
    </main>
  );
}
