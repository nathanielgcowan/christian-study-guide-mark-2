import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="minimal-shell">
      <section className="minimal-card minimal-form">
        <p className="eyebrow">Email Confirmation</p>
        <h2>Check your inbox</h2>
        <p className="minimal-note">
          Your account is ready. Open the confirmation email from Supabase to
          finish signing in and activate your workspace.
        </p>
        <div className="minimal-actions">
          <Link href="/auth/signin" className="button-primary">
            Back to sign in
          </Link>
          <Link href="/" className="button-secondary">
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
