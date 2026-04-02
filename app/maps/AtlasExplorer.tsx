"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AtlasJourney, BibleLocation } from "@/lib/bible-atlas";
import AtlasMapPanel from "./AtlasMapPanel";

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export default function AtlasExplorer({
  locations,
  journeys,
}: {
  locations: BibleLocation[];
  journeys: AtlasJourney[];
}) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedEra, setSelectedEra] = useState("all");
  const [selectedJourneySlug, setSelectedJourneySlug] = useState("all");

  const regions = useMemo(
    () => uniqueSorted(locations.map((location) => location.region)),
    [locations],
  );
  const eras = useMemo(
    () => uniqueSorted(locations.map((location) => location.era)),
    [locations],
  );

  const selectedJourney = useMemo(
    () => journeys.find((journey) => journey.slug === selectedJourneySlug) ?? null,
    [journeys, selectedJourneySlug],
  );

  const filteredLocations = useMemo(
    () =>
      locations.filter((location) => {
        const regionMatch =
          selectedRegion === "all" || location.region === selectedRegion;
        const eraMatch = selectedEra === "all" || location.era === selectedEra;
        const journeyMatch =
          !selectedJourney || selectedJourney.stops.includes(location.slug);

        return regionMatch && eraMatch && journeyMatch;
      }),
    [locations, selectedEra, selectedJourney, selectedRegion],
  );

  const routeStops = useMemo(
    () =>
      (selectedJourney?.stops ?? [])
        .map((slug) => locations.find((location) => location.slug === slug))
        .filter((location): location is BibleLocation => Boolean(location)),
    [locations, selectedJourney],
  );

  return (
    <section className="content-section-card content-stack">
      <div className="content-section-heading">
        <p className="eyebrow">Atlas explorer</p>
        <h2>Filter by region, era, or a larger biblical route</h2>
      </div>

      <div className="content-grid-three">
        <div className="content-card">
          <label className="minimal-label" htmlFor="atlas-region">
            Region
          </label>
          <select
            id="atlas-region"
            value={selectedRegion}
            onChange={(event) => setSelectedRegion(event.target.value)}
            className="minimal-select"
          >
            <option value="all">All regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div className="content-card">
          <label className="minimal-label" htmlFor="atlas-era">
            Era
          </label>
          <select
            id="atlas-era"
            value={selectedEra}
            onChange={(event) => setSelectedEra(event.target.value)}
            className="minimal-select"
          >
            <option value="all">All eras</option>
            {eras.map((era) => (
              <option key={era} value={era}>
                {era}
              </option>
            ))}
          </select>
        </div>
        <div className="content-card">
          <label className="minimal-label" htmlFor="atlas-journey">
            Journey
          </label>
          <select
            id="atlas-journey"
            value={selectedJourneySlug}
            onChange={(event) => setSelectedJourneySlug(event.target.value)}
            className="minimal-select"
          >
            <option value="all">All journeys</option>
            {journeys.map((journey) => (
              <option key={journey.slug} value={journey.slug}>
                {journey.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="content-grid-two">
        <article className="content-stat">
          <span>Visible locations</span>
          <strong>{filteredLocations.length}</strong>
        </article>
        <article className="content-stat">
          <span>Journey stops</span>
          <strong>{routeStops.length || "All"}</strong>
        </article>
      </section>

      <AtlasMapPanel
        locations={filteredLocations.length > 0 ? filteredLocations : locations}
        selectedJourney={selectedJourney}
      />

      {selectedJourney ? (
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Route view</p>
            <h3 className="content-card-title">{selectedJourney.title}</h3>
          </div>
          <p>{selectedJourney.summary}</p>
          <p className="content-card-meta">{selectedJourney.focus}</p>
          <div className="content-chip-row">
            {routeStops.map((stop, index) => (
              <span key={`${selectedJourney.slug}-${stop.slug}`} className="content-chip">
                {index + 1}. {stop.name}
              </span>
            ))}
          </div>
          <div className="atlas-route-diagram">
            {routeStops.map((stop, index) => (
              <div key={`${selectedJourney.slug}-${stop.slug}-diagram`} className="atlas-route-step">
                <span className="atlas-route-step-number">{index + 1}</span>
                <div>
                  <strong>{stop.name}</strong>
                  <p>
                    {stop.region} · {stop.mapLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="content-grid-two">
            {routeStops.map((stop, index) => (
              <article key={`${selectedJourney.slug}-${stop.slug}-card`} className="content-card-note">
                <strong>
                  Stop {index + 1}: {stop.name}
                </strong>
                <p>
                  {stop.region} · {stop.era}
                </p>
                <p>{stop.summary}</p>
                <div className="dictionary-link-list">
                  <Link href={`/maps/${stop.slug}`} className="button-secondary">
                    Open atlas entry
                  </Link>
                  <Link
                    href={`/passage/${encodeURIComponent(stop.keyReferences[0])}`}
                    className="button-secondary"
                  >
                    Read key passage
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="atlas-grid">
        {filteredLocations.map((location) => (
          <article key={location.slug} className="content-card atlas-card">
            <div className="content-section-heading">
              <p className="eyebrow">{location.region}</p>
              <h3 className="content-card-title">{location.name}</h3>
            </div>
            <p className="content-card-meta">{location.era}</p>
            <p>{location.summary}</p>
            <div className="content-card-note">
              <strong>Map anchor</strong>
              <p>{location.mapLabel}</p>
            </div>
            <div className="dictionary-chip-group">
              {location.relatedCharacters.slice(0, 3).map((person) => (
                <span key={`${location.slug}-${person}`} className="content-chip">
                  {person.replace(/-/g, " ")}
                </span>
              ))}
            </div>
            <div className="dictionary-link-list">
              <Link href={`/maps/${location.slug}`} className="button-secondary">
                Open atlas entry
              </Link>
              <Link
                href={`/passage/${encodeURIComponent(location.keyReferences[0])}`}
                className="button-secondary"
              >
                Read key passage
              </Link>
            </div>
          </article>
        ))}
      </section>

      {filteredLocations.length === 0 ? (
        <div className="content-card-note">
          No atlas entries match that combination yet. Try widening the region,
          era, or journey filter.
        </div>
      ) : null}
    </section>
  );
}
