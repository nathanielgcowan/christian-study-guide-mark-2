"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, BadgeCheck, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            tradition: "overview",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setMessage(
        "Account created. Check your email for the confirmation link to finish signing in.",
      );
      window.setTimeout(() => router.push("/auth/check-email"), 1200);
    } catch (clientError) {
      console.error(clientError);
      setError(
        clientError instanceof Error
          ? clientError.message
          : "Unable to create your account right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="minimal-shell">
      <section className="minimal-grid minimal-grid-two">
        <div className="minimal-hero">
          <p className="eyebrow">Create Account</p>
          <h1>Set up a calm, personal space for study.</h1>
          <p>
            Create your account to keep profile details, bookmarks, prayer
            activity, and study progress in one clean place.
          </p>
          <div className="minimal-actions">
            <span className="minimal-badge">
              <UserRound size={14} />
              Personal workspace
            </span>
            <span className="minimal-badge">
              <BadgeCheck size={14} />
              Email confirmation
            </span>
          </div>
        </div>

        <div className="minimal-card minimal-form">
          <h2>Create your account</h2>
          <p className="minimal-note">
            Keep the form simple and get into the product quickly.
          </p>

          {error ? (
            <div className="minimal-banner minimal-banner-error">{error}</div>
          ) : null}
          {message ? (
            <div className="minimal-banner minimal-banner-success">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="minimal-form-grid">
            <div>
              <label className="minimal-label">Full name</label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="minimal-input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="minimal-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="minimal-input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="minimal-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="minimal-input"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              className="button-primary"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="minimal-links">
            <span className="minimal-note">
              Already have an account?{" "}
              <Link href="/auth/signin" className="minimal-link">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
