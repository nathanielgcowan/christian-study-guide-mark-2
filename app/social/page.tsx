import Link from "next/link";
import { HeartHandshake, MessageCircleMore, Users } from "lucide-react";

const socialLayers = [
  {
    title: "Prayer circles",
    copy:
      "A quieter place to share requests, post updates, and mark answered prayer without the chaos of a chat feed.",
    icon: HeartHandshake,
  },
  {
    title: "Small-group prompts",
    copy:
      "Build conversation around a passage, devotional, or reading plan with shared discussion starters.",
    icon: MessageCircleMore,
  },
  {
    title: "Trusted study spaces",
    copy:
      "Keep collaboration close to the church, class, or friends you actually want to study with.",
    icon: Users,
  },
];

export default function SocialPage() {
  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Community</p>
        <h1>Make prayer and study shared, not scattered.</h1>
        <p className="content-lead">
          The social layer should feel like a trusted ministry space, not a
          noisy feed. Prayer circles, group prompts, and shared progress are the
          strongest first steps.
        </p>
      </section>

      <section className="content-grid-three">
        {socialLayers.map(({ title, copy, icon: Icon }) => (
          <article key={title} className="content-card">
            <span className="content-badge">
              <Icon size={14} />
              Community layer
            </span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Start with what exists</p>
            <h2>Use personal prayer tools as the foundation</h2>
          </div>
          <p>
            Prayer requests, notifications, and reading plans are already in the
            app. The next social step is layering sharing, visibility, and
            follow-up on top of those tools.
          </p>
          <div className="content-actions">
            <Link href="/groups" className="button-primary">
              Open groups
            </Link>
            <Link href="/user/prayer-requests" className="button-secondary">
              Prayer requests
            </Link>
            <Link href="/testimonies" className="button-secondary">
              Testimony wall
            </Link>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Notifications</p>
            <h2>Keep shared rhythms intentional</h2>
          </div>
          <p>
            Group reminders and prayer-circle updates work best when the
            notification system stays thoughtful and limited.
          </p>
          <Link href="/notifications" className="button-secondary">
            Manage reminder flow
          </Link>
        </section>
      </section>
    </main>
  );
}
