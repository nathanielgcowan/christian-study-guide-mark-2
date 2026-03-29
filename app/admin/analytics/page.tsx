"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface UserMetric {
  id: number;
  email: string;
  lastActive: string;
  sessions: number;
  prayersLogged: number;
  pagesVisited: number;
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<UserMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = status === "authenticated" && session?.user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);

    fetch("/api/admin/analytics")
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Failed to fetch metrics");
        }
        return res.json();
      })
      .then((data) => {
        setMetrics(data.metrics);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Back to Homepage
        </Link>
      </div>

      {status === "loading" && <p>Loading session...</p>}

      {status === "unauthenticated" && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-rose-800">
          <h2 className="text-xl font-semibold">Not signed in</h2>
          <p className="mt-2">Sign in as an admin to access analytics.</p>
        </div>
      )}

      {status === "authenticated" && !isAdmin && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-rose-800">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="mt-2">You are not an admin.</p>
        </div>
      )}

      {isAdmin && (
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <div className="text-xs uppercase tracking-wider text-slate-300">
                Active Users
              </div>
              <div className="mt-2 text-3xl font-bold">{totals.users}</div>
            </div>
            <div className="rounded-xl bg-blue-600 p-4 text-white">
              <div className="text-xs uppercase tracking-wider text-blue-100">
                Total Sessions
              </div>
              <div className="mt-2 text-3xl font-bold">{totals.sessions}</div>
            </div>
            <div className="rounded-xl bg-emerald-600 p-4 text-white">
              <div className="text-xs uppercase tracking-wider text-emerald-100">
                Prayers Logged
              </div>
              <div className="mt-2 text-3xl font-bold">{totals.prayers}</div>
            </div>
            <div className="rounded-xl bg-indigo-600 p-4 text-white">
              <div className="text-xs uppercase tracking-wider text-indigo-100">
                Pages Visited
              </div>
              <div className="mt-2 text-3xl font-bold">{totals.pages}</div>
            </div>
          </div>

          {error && <div className="text-rose-600">{error}</div>}
          {loading && <div>Loading analytics..</div>}

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">User</th>
                  <th className="px-4 py-3 text-sm font-semibold">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold">Sessions</th>
                  <th className="px-4 py-3 text-sm font-semibold">Prayers</th>
                  <th className="px-4 py-3 text-sm font-semibold">Pages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric) => (
                  <tr key={metric.id}>
                    <td className="px-4 py-3">{metric.email}</td>
                    <td className="px-4 py-3">{metric.lastActive}</td>
                    <td className="px-4 py-3">{metric.sessions}</td>
                    <td className="px-4 py-3">{metric.prayersLogged}</td>
                    <td className="px-4 py-3">{metric.pagesVisited}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
