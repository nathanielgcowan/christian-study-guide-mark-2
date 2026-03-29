"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  user: { name: string | null; email: string };
  prayerCount: number;
  createdAt: string;
}

export default function PrayerRequestsPage() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const response = await fetch("/api/user/prayer-requests");
    if (response.ok) {
      const data = await response.json();
      setRequests(data.prayerRequests);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "authenticated") {
      alert("Please sign in first");
      return;
    }

    const response = await fetch("/api/user/prayer-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, isPublic: true }),
    });

    if (response.ok) {
      setFormData({ title: "", description: "" });
      setShowForm(false);
      fetchRequests();
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Prayer Requests</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back home
        </Link>
      </div>

      {status === "authenticated" && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Submit Prayer Request"}
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Request title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            />
            <textarea
              placeholder="Describe your prayer request"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={4}
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading prayer requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-slate-600">No prayer requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-bold">{request.title}</h3>
              <p className="mb-3 text-slate-600">{request.description}</p>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>By {request.user.name || request.user.email}</span>
                <span>{request.prayerCount} people praying</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
