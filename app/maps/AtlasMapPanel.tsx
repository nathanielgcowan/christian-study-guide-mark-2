import Link from "next/link";
import type { AtlasJourney, BibleLocation } from "@/lib/bible-atlas";

function buildRoutePath(stops: BibleLocation[]) {
  if (stops.length === 0) return "";

  return stops
    .map((stop, index) => `${index === 0 ? "M" : "L"} ${stop.coordinates.x} ${stop.coordinates.y}`)
    .join(" ");
}

export default function AtlasMapPanel({
  locations,
  highlightedSlug,
  selectedJourney,
}: {
  locations: BibleLocation[];
  highlightedSlug?: string;
  selectedJourney?: AtlasJourney | null;
}) {
  const highlighted = highlightedSlug
    ? locations.find((location) => location.slug === highlightedSlug) ?? null
    : null;
  const routeStops = (selectedJourney?.stops ?? [])
    .map((slug) => locations.find((location) => location.slug === slug))
    .filter((location): location is BibleLocation => Boolean(location));
  const routeStopSet = new Set(routeStops.map((stop) => stop.slug));
  const path = buildRoutePath(routeStops);

  return (
    <section className="atlas-map-panel">
      <div className="content-section-heading">
        <p className="eyebrow">Atlas visual</p>
        <h2>{selectedJourney ? `${selectedJourney.title} route` : "Story-world map"}</h2>
      </div>
      <div className="atlas-map-canvas">
        <div className="atlas-map-backdrop" />
        <svg viewBox="0 0 100 100" className="atlas-map-svg" aria-hidden="true">
          <defs>
            <linearGradient id="atlasRoute" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#855d36" />
              <stop offset="100%" stopColor="#d2b48c" />
            </linearGradient>
          </defs>
          {path ? (
            <path
              d={path}
              fill="none"
              stroke="url(#atlasRoute)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>

        {locations.map((location) => {
          const isHighlighted = highlighted?.slug === location.slug;
          const isRouteStop = routeStopSet.has(location.slug);

          return (
            <Link
              key={location.slug}
              href={`/maps/${location.slug}`}
              className={`atlas-map-pin${isHighlighted ? " atlas-map-pin-highlighted" : ""}${isRouteStop ? " atlas-map-pin-route" : ""}`}
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
              }}
            >
              <span className="atlas-map-pin-dot" />
              <span className="atlas-map-pin-label">{location.name}</span>
            </Link>
          );
        })}
      </div>

      {selectedJourney ? (
        <div className="atlas-map-legend">
          <span className="content-chip">{routeStops.length} routed stops</span>
          <span className="content-chip">{selectedJourney.era}</span>
          <span className="content-chip">{selectedJourney.focus}</span>
        </div>
      ) : highlighted ? (
        <div className="atlas-map-legend">
          <span className="content-chip">{highlighted.region}</span>
          <span className="content-chip">{highlighted.era}</span>
          <span className="content-chip">{highlighted.mapLabel}</span>
        </div>
      ) : (
        <div className="atlas-map-legend">
          <span className="content-chip">Routes, regions, and story anchors</span>
          <span className="content-chip">Click any pin</span>
        </div>
      )}
    </section>
  );
}
