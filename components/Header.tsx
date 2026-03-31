"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const primaryLinks = [
  { href: "/bible", label: "Bible" },
  { href: "/characters", label: "Characters" },
  { href: "/timeline", label: "Timeline" },
  { href: "/dictionary", label: "Dictionary" },
  { href: "/reading-plans", label: "Reading Plans" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/maps", label: "Atlas" },
  { href: "/groups", label: "Groups" },
  { href: "/resources", label: "Resources" },
];

export default function Header() {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    try {
      const supabase = createClient();

      void supabase.auth.getSession().then(({ data }) => {
        if (!mounted) return;
        setSignedIn(Boolean(data.session));
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        setSignedIn(Boolean(session));
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch {}

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setSignedIn(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link
          href="/"
          className="brand-mark"
          aria-label="Christian Study Guide home"
        >
          <span className="brand-mark-chip">CSG</span>
          <span className="brand-mark-text">
            <strong>Christian Study Guide</strong>
            <small>Scripture, prayer, and formation</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions" aria-label="Quick actions">
          <Link
            href="/dashboard"
            className="button-secondary button-small"
          >
            Dashboard
          </Link>
          <Link
            href="/prayer-journal"
            className="button-secondary button-small"
          >
            Prayer Journal
          </Link>
          {signedIn ? (
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="button-primary button-small"
              aria-label="Sign out of your account"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/register"
              className="button-primary button-small"
              aria-label="Create an account and get started"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
