"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, BookOpen, Heart, LayoutGrid } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserMetric {
  id: number;
  email: string;
  lastActive: string;
  sessions: number;
  prayersLogged: number;
  pagesVisited: number;
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<UserMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      setError(null);
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSignedIn(false);
        setLoading(false);
        return;
      }

      setSignedIn(true);

      const profileResponse = await fetch("/api/profile");
      if (!profileResponse.ok) {
        setLoading(false);
        return;
      }

      const profile = (await profileResponse.json()) as {
        role?: string | null;
      };

      const adminAccess =
        profile.role === "admin" || profile.role === "super_admin";
      setIsAdmin(adminAccess);

      if (!adminAccess) {
        setLoading(false);
        return;
      }

      const metricsResponse = await fetch("/api/admin/analytics");

      if (!metricsResponse.ok) {
        const body = (await metricsResponse.json()) as { error?: string };
        setError(body.error || "Failed to fetch metrics");
        setLoading(false);
        return;
      }

      const data = (await metricsResponse.json()) as { metrics: UserMetric[] };
      setMetrics(data.metrics);
      setLoading(false);
    }

    void loadMetrics();
  }, []);

  const totals = useMemo(() => {
    return metrics.reduce(
      (agg, metric) => ({
        users: metrics.length,
        sessions: agg.sessions + metric.sessions,
        prayers: agg.prayers + metric.prayersLogged,
        pages: agg.pages + metric.pagesVisited,
      }),
      { users: 0, sessions: 0, prayers: 0, pages: 0 },
    );
  }, [metrics]);

  const statTiles = [
    { label: "Active users", value: totals.users, icon: LayoutGrid },
    { label: "Study sessions", value: totals.sessions, icon: BookOpen },
    { label: "Prayers logged", value: totals.prayers, icon: Heart },
    { label: "Page activity", value: totals.pages, icon: Activity },
  ];

  return (
    <main className="minimal-shell">
      <section className="minimal-grid">
        <div className="minimal-section-heading">
          <div className="minimal-hero">
            <p className="eyebrow">Admin View</p>
            <h1>Analytics with less dashboard noise.</h1>
            <p>
              A clearer read on usage and engagement without crowded panels or
              aggressive color blocking.
            </p>
          </div>
          <Link href="/" className="button-secondary">
            Back to home
          </Link>
        </div>

        {loading && <p>Loading session...</p>}

        {!loading && !signedIn && (
          <section className="minimal-card minimal-status">
            <h2>Not signed in</h2>
            <p className="minimal-note">
              Sign in as an admin to access analytics.
            </p>
          </section>
        )}

        {!loading && signedIn && !isAdmin && (
          <section className="minimal-card minimal-status">
            <h2>Access denied</h2>
            <p className="minimal-note">
              Your account is signed in but does not currently have admin access.
            </p>
          </section>
        )}

        {!loading && isAdmin && (
          <>
            <section className="minimal-stat-grid">
              {statTiles.map(({ label, value, icon: Icon }) => (
                <article key={label} className="minimal-card stat-tile">
                  <span className="minimal-badge">
                    <Icon size={14} />
                    {label}
                  </span>
                  <strong>{value}</strong>
                </article>
              ))}
            </section>

            {error ? <div className="minimal-banner minimal-banner-error">{error}</div> : null}

            <section className="minimal-table-wrap">
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Last active</th>
                    <th>Sessions</th>
                    <th>Prayers</th>
                    <th>Pages</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric.id}>
                      <td>{metric.email}</td>
                      <td>{new Date(metric.lastActive).toLocaleString()}</td>
                      <td>{metric.sessions}</td>
                      <td>{metric.prayersLogged}</td>
                      <td>{metric.pagesVisited}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
