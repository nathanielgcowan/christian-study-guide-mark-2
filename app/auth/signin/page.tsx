"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (clientError) {
      console.error(clientError);
      setError(
        clientError instanceof Error
          ? clientError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="minimal-shell">
      <section className="minimal-grid minimal-grid-two">
        <div className="minimal-hero">
          <p className="eyebrow">Account Access</p>
          <h1>Sign in and pick up where you left off.</h1>
          <p>
            Use your Supabase-backed account to open your profile, saved
            passages, prayer requests, and admin tools with a quieter, cleaner
            workspace.
          </p>
          <div className="minimal-actions">
            <span className="minimal-badge">
              <Mail size={14} />
              Email sign-in
            </span>
            <span className="minimal-badge">
              <LockKeyhole size={14} />
              Secure session
            </span>
          </div>
        </div>

        <div className="minimal-card minimal-form">
          <h2>Welcome back</h2>
          <p className="minimal-note">
            Minimal, direct, and fast. Just sign in and continue.
          </p>

          {error ? (
            <div className="minimal-banner minimal-banner-error">{error}</div>
          ) : null}

          <form onSubmit={handleSubmit} className="minimal-form-grid">
            <div>
              <label className="minimal-label">Email</label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                className="minimal-input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="minimal-label">Password</label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
                className="minimal-input"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="button-primary"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="minimal-links">
            <Link href="/auth/register" className="minimal-link">
              Create account
            </Link>
            <Link href="/" className="minimal-link">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
