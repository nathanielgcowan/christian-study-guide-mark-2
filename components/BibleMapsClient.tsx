import React from "react";

type MapType = {
  title: string;
  summary: string;
  places: string[];
  accent: string;
};

export default function BibleMapsClient({ maps }: { maps: MapType[] }) {
  return (
    <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl">
      <span className="text-gray-600">
        [Bible Maps Interactive Placeholder]
        <br />
        {maps && maps.length > 0 && (
          <ul className="mt-2 text-xs text-left">
            {maps.map((m) => (
              <li key={m.title}>
                {m.title}: {m.summary}
              </li>
            ))}
          </ul>
        )}
      </span>
    </div>
  );
}
