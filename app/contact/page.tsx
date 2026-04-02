import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Christian Study Guide for support, feedback, partnerships, or general questions.",
};

const contactOptions = [
  {
    title: "General questions",
    body: "Reach out if you have a question about the platform, a feature, or how to use a specific part of the site.",
  },
  {
    title: "Feedback and bug reports",
    body: "Share anything that feels broken, confusing, or worth improving so the study experience can keep getting better.",
  },
  {
    title: "Partnerships and ministry use",
    body: "Get in touch if your church, group, or ministry wants to use Christian Study Guide more intentionally.",
  },
];

export default function ContactPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Contact</p>
        <h1>Get in touch with Christian Study Guide.</h1>
        <p className="content-lead">
          Questions, support requests, feedback, and partnership conversations
          are all welcome.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Contact options</p>
            <h2>How to reach out</h2>
          </div>
          <div className="content-stack">
            {contactOptions.map((option) => (
              <article key={option.title} className="content-card-note">
                <strong>{option.title}</strong>
                <p>{option.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Direct contact</p>
            <h2>Send a message</h2>
          </div>
          <div className="content-stack">
            <article className="content-card-note">
              <strong>Email</strong>
              <p>
                <a href="mailto:nathaniel.g.cowan@gmail.com">
                  newtcowan@gmail.com
                </a>
              </p>
            </article>
            <article className="content-card-note">
              <strong>Helpful links</strong>
              <p>
                You can also use the pages below to answer common questions or
                manage your experience.
              </p>
              <div className="content-actions">
                <Link href="/about" className="button-secondary">
                  About
                </Link>
                <Link href="/privacy" className="button-secondary">
                  Privacy
                </Link>
                <Link href="/terms" className="button-secondary">
                  Terms
                </Link>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
