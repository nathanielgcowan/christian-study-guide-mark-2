"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Admin Sign In</h1>
        <p className="mb-6 text-sm text-slate-600">
          Sign in to access the admin analytics dashboard. Use your admin email
          and password.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const email = String(formData.get("email") || "");
            const password = String(formData.get("password") || "");
            signIn("credentials", {
              email,
              password,
              callbackUrl: "/admin/analytics",
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-500">
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
