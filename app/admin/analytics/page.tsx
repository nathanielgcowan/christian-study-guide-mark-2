"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const ADMIN_EMAIL = "nathaniel.g.cowan@gmail.com";

interface UserMetric {
  id: number;
  email: string;
  lastActive: string;
  sessions: number;
  prayersLogged: number;
  pagesVisited: number;
}

const MOCK_METRICS: UserMetric[] = [
  {
    id: 1,
    email: "alice@example.com",
    lastActive: "2026-03-27 19:18",
    sessions: 17,
    prayersLogged: 7,
    pagesVisited: 53,
  },
  {
    id: 2,
    email: "ben@example.com",
    lastActive: "2026-03-28 06:08",
    sessions: 24,
    prayersLogged: 14,
    pagesVisited: 81,
  },
  {
    id: 3,
    email: "carla@example.com",
    lastActive: "2026-03-28 08:43",
    sessions: 9,
    prayersLogged: 3,
    pagesVisited: 27,
  },
];

export default function AdminAnalyticsPage() {
  const [activeAdminEmail, setActiveAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("currentUserEmail");
    if (stored) setActiveAdminEmail(stored);
  }, []);

  const isAdmin = activeAdminEmail === ADMIN_EMAIL;

  const totals = useMemo(() => {
    return {
      users: MOCK_METRICS.length,
      sessions: MOCK_METRICS.reduce((sum, item) => sum + item.sessions, 0),
      prayers: MOCK_METRICS.reduce((sum, item) => sum + item.prayersLogged, 0),
      pages: MOCK_METRICS.reduce((sum, item) => sum + item.pagesVisited, 0),
    };
  }, []);

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

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p>
          This page is restricted to admin users. Set{" "}
          <code>currentUserEmail</code> in
          <code>localStorage</code> to <strong>{ADMIN_EMAIL}</strong> and
          refresh.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Example:
          <code>localStorage.setItem("currentUserEmail", "{ADMIN_EMAIL}")</code>
        </p>
      </div>

      {!isAdmin && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-rose-800">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="mt-2">
            You are not signed in as an admin. Current user:{" "}
            <strong>{activeAdminEmail || "not set"}</strong>
          </p>
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
                {MOCK_METRICS.map((metric) => (
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
