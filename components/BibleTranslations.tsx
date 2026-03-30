"use client";
import { useEffect, useState } from "react";

interface Translation {
  id: string;
  name: string;
  abbreviation: string;
  language: { name: string };
}

export default function BibleTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/bible/translations")
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data.translations || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load translations");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading translations...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Available Bible Translations</h2>
      <ul className="space-y-2">
        {translations.map((t) => (
          <li key={t.id} className="p-2 bg-blue-50 rounded">
            <span className="font-semibold">{t.abbreviation}</span> - {t.name}{" "}
            <span className="text-slate-500">({t.language.name})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
