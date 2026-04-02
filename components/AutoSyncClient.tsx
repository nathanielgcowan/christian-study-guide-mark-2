"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  applySyncedFeaturesState,
  AUTO_SYNC_EVENT,
  getSyncedFeaturesState,
  getSyncMeta,
  SyncedFeaturesState,
  markSyncPushed,
} from "@/lib/client-features";

type SyncResponse = {
  syncState: SyncedFeaturesState;
};

export default function AutoSyncClient() {
  const initializedRef = useRef(false);
  const pushingRef = useRef(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let isSignedIn = false;
    let supabase: ReturnType<typeof createClient> | null = null;

    try {
      supabase = createClient();
    } catch {
      return;
    }

    async function pushLocal() {
      if (cancelled || !isSignedIn || pushingRef.current) return;

      pushingRef.current = true;

      try {
        const response = await fetch("/api/user/sync-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getSyncedFeaturesState()),
        });

        if (!response.ok) return;

        const data = (await response.json()) as SyncResponse;
        if (data.syncState.updatedAt) {
          markSyncPushed(data.syncState.updatedAt);
        }
      } catch {
        // Ignore transient sync failures and try again on the next local update.
      } finally {
        pushingRef.current = false;
      }
    }

    async function reconcileRemote() {
      if (cancelled || !isSignedIn) return;

      try {
        const response = await fetch("/api/user/sync-state", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as SyncResponse;
        const remote = data.syncState;
        const local = getSyncedFeaturesState();
        const syncMeta = getSyncMeta();

        const remoteUpdatedAt = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
        const localChangedAt = syncMeta.lastLocalChangeAt
          ? Date.parse(syncMeta.lastLocalChangeAt)
          : 0;
        const remoteAppliedAt = syncMeta.lastRemoteAppliedAt
          ? Date.parse(syncMeta.lastRemoteAppliedAt)
          : 0;
        const hasMeaningfulCollections =
          local.collections.some(
            (collection) =>
              collection.id !== "collection-default" || collection.items.length > 0,
          );
        const localHasData =
          hasMeaningfulCollections ||
          local.recentPassages.length > 0 ||
          local.memoryVerses.length > 0 ||
          local.sermonNotes.length > 0 ||
          Boolean(local.familyMode);

        if (!initializedRef.current) {
          initializedRef.current = true;
        }

        if (remoteUpdatedAt > Math.max(localChangedAt, remoteAppliedAt) && remoteUpdatedAt > 0) {
          applySyncedFeaturesState(remote);
          return;
        }

        if (localHasData && localChangedAt >= remoteUpdatedAt) {
          await pushLocal();
        }
      } catch {
        // Keep the app usable even when sync is unavailable.
      }
    }

    function schedulePush() {
      if (!initializedRef.current || !isSignedIn) return;
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        void pushLocal();
      }, 1200);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void reconcileRemote();
      }
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      isSignedIn = Boolean(data.session);
      if (isSignedIn) {
        void reconcileRemote();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      isSignedIn = Boolean(session);
      initializedRef.current = false;
      if (isSignedIn) {
        void reconcileRemote();
      }
    });

    window.addEventListener(AUTO_SYNC_EVENT, schedulePush);
    window.addEventListener("focus", reconcileRemote);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.removeEventListener(AUTO_SYNC_EVENT, schedulePush);
      window.removeEventListener("focus", reconcileRemote);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return null;
}
