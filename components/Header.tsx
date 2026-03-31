"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react";

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
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        <button
          type="button"
          className="site-menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>

        <div
          id="site-mobile-nav"
          className={`site-header-panel${menuOpen ? " is-open" : ""}`}
        >
          <nav className="site-nav" aria-label="Primary navigation">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={pathname === link.href ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header-actions" aria-label="Quick actions">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={`button-secondary button-small${
                pathname === "/dashboard" ? " is-active" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/prayer-journal"
              onClick={() => setMenuOpen(false)}
              className={`button-secondary button-small${
                pathname === "/prayer-journal" ? " is-active" : ""
              }`}
            >
              Prayer Journal
            </Link>
            {signedIn ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void handleSignOut();
                }}
                className="button-primary button-small"
                aria-label="Sign out of your account"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="button-primary button-small"
                aria-label="Create an account and get started"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
