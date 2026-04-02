"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { familyMemoryVerses, familyPlans } from "@/lib/family-mode";
import { createClient } from "@/lib/supabase/client";
import { FamilyModeState, getFamilyModeState, saveFamilyModeState } from "@/lib/client-features";

function getInitialState(): FamilyModeState {
  return {
    activePlanId: familyPlans[0]?.id ?? "",
    completedParentDays: [],
    completedChildDays: [],
    masteredVerseIds: [],
  };
}

export default function FamilyPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [syncReady, setSyncReady] = useState(false);
  const [state, setState] = useState<FamilyModeState>(getInitialState);

  useEffect(() => {
    async function loadState() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSignedIn(Boolean(session));
      } catch {
        setSignedIn(false);
      }

      try {
        const saved = getFamilyModeState();
        if (saved) {
          setState({ ...getInitialState(), ...saved });
        }
      } catch {
        // Ignore malformed saved state and keep defaults.
      } finally {
        setSyncReady(true);
      }
    }

    void loadState();
  }, []);

  useEffect(() => {
    if (!syncReady) return;
    saveFamilyModeState(state);
  }, [state, syncReady]);

  const activePlan = useMemo(
    () => familyPlans.find((plan) => plan.id === state.activePlanId) ?? familyPlans[0],
    [state.activePlanId],
  );

  const parentProgress = activePlan
    ? Math.round((state.completedParentDays.length / activePlan.durationDays) * 100)
    : 0;
  const childProgress = activePlan
    ? Math.round((state.completedChildDays.length / activePlan.durationDays) * 100)
    : 0;

  function toggleDay(day: number, role: "parent" | "child") {
    setState((current) => {
      const key =
        role === "parent" ? "completedParentDays" : "completedChildDays";
      const currentDays = current[key];
      const nextDays = currentDays.includes(day)
        ? currentDays.filter((entry) => entry !== day)
        : [...currentDays, day].sort((left, right) => left - right);

      return {
        ...current,
        [key]: nextDays,
      };
    });
  }

  function toggleVerseMastery(verseId: string) {
    setState((current) => ({
      ...current,
      masteredVerseIds: current.masteredVerseIds.includes(verseId)
        ? current.masteredVerseIds.filter((entry) => entry !== verseId)
        : [...current.masteredVerseIds, verseId],
    }));
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Family mode</p>
        <h1>Build one shared household rhythm for reading and memory.</h1>
        <p className="content-lead">
          Family mode gives parents and children a simple place to follow the
          same reading plan, track each side of the rhythm, and keep memory
          verses visible together.
        </p>
        <div className="content-chip-row">
          <span className="content-chip">{familyPlans.length} family plans</span>
          <span className="content-chip">{familyMemoryVerses.length} shared memory verses</span>
          <span className="content-chip">Parent and child check-ins</span>
          <span className="content-chip">
            {signedIn ? "Syncing across signed-in devices" : "Local until sign-in"}
          </span>
        </div>
      </section>

      <section className="content-card">
        <div className="content-section-heading">
          <p className="eyebrow">Household sync</p>
          <h2>Keep family mode available across devices</h2>
        </div>
        <div className="content-card-note">
          <strong>
            {signedIn
              ? "Family progress is now part of your synced study account."
              : "Sign in to sync this household view across devices."}
          </strong>
          <p>
            The active family plan, parent and child check-ins, and mastered memory verses
            now use the shared sync layer instead of staying in one browser only.
          </p>
        </div>
        <div className="content-actions">
          <Link href={signedIn ? "/sync" : "/auth/signin"} className="button-secondary">
            {signedIn ? "Open sync tools" : "Sign in to sync"}
          </Link>
        </div>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Household plans</p>
            <h2>Choose one rhythm for the family</h2>
          </div>
          <div className="content-stack">
            {familyPlans.map((plan) => (
              <article key={plan.id} className="content-card-note">
                <strong>{plan.title}</strong>
                <p>{plan.summary}</p>
                <p>
                  {plan.cadence} · {plan.durationDays} daily steps
                </p>
                <button
                  type="button"
                  className={state.activePlanId === plan.id ? "button-primary" : "button-secondary"}
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      activePlanId: plan.id,
                      completedParentDays: [],
                      completedChildDays: [],
                    }))
                  }
                >
                  {state.activePlanId === plan.id ? "Current family plan" : "Use this plan"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Shared progress</p>
            <h2>See how the household is moving together</h2>
          </div>
          <div className="content-grid-two">
            <article className="content-stat">
              <span>Parent progress</span>
              <strong>{parentProgress}%</strong>
            </article>
            <article className="content-stat">
              <span>Child progress</span>
              <strong>{childProgress}%</strong>
            </article>
          </div>
          <div className="content-card-note">
            <strong>Current plan</strong>
            <p>{activePlan?.title}</p>
          </div>
          <div className="content-actions">
            <Link href="/reading-plans" className="button-secondary">
              Reading plans
            </Link>
            <Link href="/scripture-memory" className="button-secondary">
              Scripture memory
            </Link>
          </div>
        </section>
      </section>

      {activePlan ? (
        <section className="content-section-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">Daily family guide</p>
            <h2>{activePlan.title}</h2>
          </div>
          <div className="content-stack">
            {activePlan.days.map((day) => (
              <article key={`${activePlan.id}-${day.day}`} className="content-card">
                <div className="content-chip-row">
                  <span className="content-badge">Day {day.day}</span>
                  <span className="content-card-meta">{day.reading}</span>
                </div>
                <div className="content-grid-two">
                  <div className="content-card-note">
                    <strong>Parent prompt</strong>
                    <p>{day.parentPrompt}</p>
                  </div>
                  <div className="content-card-note">
                    <strong>Child prompt</strong>
                    <p>{day.childPrompt}</p>
                  </div>
                </div>
                <div className="content-card-note">
                  <strong>Prayer focus</strong>
                  <p>{day.prayerFocus}</p>
                </div>
                <div className="content-actions">
                  <Link
                    href={`/passage/${encodeURIComponent(day.reading)}`}
                    className="button-secondary"
                  >
                    Open reading
                  </Link>
                  <button
                    type="button"
                    className={
                      state.completedParentDays.includes(day.day)
                        ? "button-primary"
                        : "button-secondary"
                    }
                    onClick={() => toggleDay(day.day, "parent")}
                  >
                    {state.completedParentDays.includes(day.day)
                      ? "Parent checked in"
                      : "Mark parent done"}
                  </button>
                  <button
                    type="button"
                    className={
                      state.completedChildDays.includes(day.day)
                        ? "button-primary"
                        : "button-secondary"
                    }
                    onClick={() => toggleDay(day.day, "child")}
                  >
                    {state.completedChildDays.includes(day.day)
                      ? "Child checked in"
                      : "Mark child done"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="content-section-card content-stack">
        <div className="content-section-heading">
          <p className="eyebrow">Parent and child memory</p>
          <h2>Keep the same verses in front of both generations</h2>
        </div>
        <div className="content-grid-two">
          {familyMemoryVerses.map((verse) => (
            <article key={verse.id} className="content-card">
              <div className="content-chip-row">
                <span className="content-badge">{verse.reference}</span>
                {state.masteredVerseIds.includes(verse.id) ? (
                  <span className="content-card-meta">Family mastered</span>
                ) : null}
              </div>
              <div className="content-card-note">
                <strong>Verse</strong>
                <p>{verse.text}</p>
              </div>
              <div className="content-grid-two">
                <div className="content-card-note">
                  <strong>Parent cue</strong>
                  <p>{verse.parentCue}</p>
                </div>
                <div className="content-card-note">
                  <strong>Child cue</strong>
                  <p>{verse.childCue}</p>
                </div>
              </div>
              <div className="content-actions">
                <Link
                  href={`/passage/${encodeURIComponent(verse.reference)}`}
                  className="button-secondary"
                >
                  Study verse
                </Link>
                <button
                  type="button"
                  className={
                    state.masteredVerseIds.includes(verse.id)
                      ? "button-primary"
                      : "button-secondary"
                  }
                  onClick={() => toggleVerseMastery(verse.id)}
                >
                  {state.masteredVerseIds.includes(verse.id)
                    ? "Marked mastered"
                    : "Mark family mastered"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
