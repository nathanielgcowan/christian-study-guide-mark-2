import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="minimal-shell">
      <section className="minimal-card minimal-form">
        <p className="eyebrow">Link Error</p>
        <h2>That authentication link could not be completed.</h2>
        <p className="minimal-note">
          The confirmation or recovery link may have expired or already been
          used. Start a fresh sign-in or create a new account.
        </p>
        <div className="minimal-actions">
          <Link href="/auth/signin" className="button-primary">
            Go to sign in
          </Link>
          <Link href="/auth/register" className="button-secondary">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
