"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check system preference or localStorage
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && systemDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="ml-4 rounded px-3 py-1 border border-slate-300 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600 transition"
      type="button"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
