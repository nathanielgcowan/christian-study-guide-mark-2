"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const name = String(formData.get("name") || "").trim();

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Failed to register.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/auth/signin"), 1200);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Create an Account</h1>
        {error && (
          <div className="mb-4 rounded-lg bg-rose-100 p-3 text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-emerald-100 p-3 text-emerald-700">
            Account created. Redirecting to sign-in...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name (optional)
            </label>
            <input
              name="name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
