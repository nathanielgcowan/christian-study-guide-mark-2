"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellRing, MailCheck, Newspaper, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  BrowserPushSubscriptionRecord,
  EmailPreferences,
  getDefaultEmailPrefs,
} from "@/lib/notification-prefs";

interface DevotionalPreview {
  title: string;
  verse: {
    text: string;
    reference: string;
  };
  reflection: string[];
  prayer: string;
}

export default function NotificationsPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | "unsupported">(
    typeof window === "undefined" || !("Notification" in window)
      ? "unsupported"
      : Notification.permission,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<EmailPreferences>(getDefaultEmailPrefs());
  const [preview, setPreview] = useState<DevotionalPreview | null>(null);
  const [pushSupported, setPushSupported] = useState(false);
  const [subscriptionBusy, setSubscriptionBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPushSupported("serviceWorker" in navigator && "PushManager" in window);
  }, []);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      setSignedIn(true);

      const [prefsResponse, previewResponse] = await Promise.all([
        fetch("/api/user/email-prefs"),
        fetch("/api/devotionals/today"),
      ]);

      if (prefsResponse.ok) {
        const data = (await prefsResponse.json()) as { emailPrefs: EmailPreferences };
        setPrefs(data.emailPrefs);
      }

      if (previewResponse.ok) {
        const data = (await previewResponse.json()) as { devotional: DevotionalPreview | null };
        setPreview(data.devotional);
      }

      if (typeof window !== "undefined" && "Notification" in window) {
        setBrowserPermission(Notification.permission);
      }

      setLoading(false);
    }

    void load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setStatusMessage(null);
    const response = await fetch("/api/user/email-prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });

    setSaving(false);
    setStatusMessage(response.ok ? "Notification preferences saved." : "Unable to save preferences right now.");
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }

    return navigator.serviceWorker.register("/sw.js");
  }

  function subscriptionToRecord(
    subscription: PushSubscription,
  ): BrowserPushSubscriptionRecord {
    const json = subscription.toJSON();
    return {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime ?? null,
      keys: {
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  function base64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  async function enableBrowserNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatusMessage("This browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    setBrowserPermission(permission);

    if (permission === "granted") {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
      if (!pushSupported || !vapidPublicKey) {
        setPrefs((current) => ({
          ...current,
          browserPushEnabled: true,
          dailyDevotionalChannel:
            current.dailyDevotionalChannel === "email" ? "both" : "browser",
        }));
        setStatusMessage(
          vapidPublicKey
            ? "Browser notifications enabled, but push subscription support is limited in this browser."
            : "Browser notifications enabled. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY to activate true scheduled push delivery.",
        );
        return;
      }

      try {
        setSubscriptionBusy(true);
        const registration = await registerServiceWorker();
        const existingSubscription = await registration.pushManager.getSubscription();
        const nextSubscription =
          existingSubscription ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64ToUint8Array(vapidPublicKey),
          }));

        const response = await fetch("/api/user/push-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriptionToRecord(nextSubscription)),
        });

        const data = (await response.json()) as { emailPrefs?: EmailPreferences; error?: string };
        if (!response.ok || !data.emailPrefs) {
          setStatusMessage(data.error ?? "Unable to save push subscription.");
          return;
        }

        setPrefs(data.emailPrefs);
        setStatusMessage("Scheduled browser push is now enabled for daily devotionals.");
      } catch (error) {
        setStatusMessage(error instanceof Error ? error.message : "Unable to enable browser push.");
      } finally {
        setSubscriptionBusy(false);
      }
      return;
    }

    setStatusMessage("Browser notifications were not granted.");
  }

  async function disableBrowserNotifications() {
    try {
      setSubscriptionBusy(true);

      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration("/sw.js");
        const existingSubscription = await registration?.pushManager.getSubscription();

        if (existingSubscription) {
          await fetch("/api/user/push-subscription", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: existingSubscription.endpoint }),
          });
          await existingSubscription.unsubscribe();
        }
      }

      setPrefs((current) => ({
        ...current,
        browserPushEnabled: false,
        pushSubscriptions: [],
        dailyDevotionalChannel:
          current.dailyDevotionalChannel === "both" ? "email" : current.dailyDevotionalChannel,
      }));
      setStatusMessage("Browser push subscription removed.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to disable browser push right now.",
      );
    } finally {
      setSubscriptionBusy(false);
    }
  }

  function sendBrowserPreview() {
    if (!preview) {
      setStatusMessage("No devotional preview is available yet.");
      return;
    }

    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatusMessage("This browser does not support notifications.");
      return;
    }

    if (Notification.permission !== "granted") {
      setStatusMessage("Enable browser notifications first.");
      return;
    }

    const body = `${preview.verse.reference}\n${preview.reflection[0] ?? preview.prayer}`;
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistration("/sw.js").then((registration) => {
        if (registration) {
          return registration.showNotification(preview.title, {
            body,
            tag: "daily-devotional-preview",
            icon: "/favicon.svg",
            badge: "/favicon.svg",
            data: {
              url: "/devotionals/daily",
            },
          });
        }

        new Notification(preview.title, {
          body,
          tag: "daily-devotional-preview",
        });
      });
    } else {
      new Notification(preview.title, {
        body,
        tag: "daily-devotional-preview",
      });
    }
    setStatusMessage("Browser devotional preview sent.");
  }

  if (loading) {
    return (
      <main className="page-shell content-shell-narrow">
        <section className="content-card">
          <h2>Loading notifications...</h2>
        </section>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="page-shell content-shell-narrow content-stack">
        <section className="content-hero">
          <p className="eyebrow">Notifications</p>
          <h1>Sign in to manage your reminder flow.</h1>
        </section>
        <section className="content-card">
          <div className="content-actions">
            <Link href="/auth/signin" className="button-primary">
              Sign in
            </Link>
            <Link href="/auth/register" className="button-secondary">
              Create account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="page-shell content-shell content-stack">
      <section className="content-hero">
        <p className="eyebrow">Notifications</p>
        <h1>Deliver a daily verse and reflection by email or browser notification.</h1>
        <p className="content-lead">
          Choose how the daily devotional should reach you, set a preferred
          delivery time, and preview what that reminder feels like before you
          commit to it.
        </p>
      </section>

      <section className="content-grid-two">
        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Daily devotional delivery</p>
            <h2>Choose the channel and timing</h2>
          </div>
          <div className="content-stack">
            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Daily devotional</strong>
                <p>Send today's verse and one reflection prompt on a steady schedule.</p>
              </span>
              <span className="minimal-badge">
                <MailCheck size={14} />
                <input
                  type="checkbox"
                  checked={prefs.dailyDevotional}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      dailyDevotional: event.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <div>
              <label className="minimal-label">Delivery channel</label>
              <select
                value={prefs.dailyDevotionalChannel}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    dailyDevotionalChannel: event.target.value as EmailPreferences["dailyDevotionalChannel"],
                  })
                }
                className="minimal-select"
              >
                <option value="email">Email</option>
                <option value="browser">Browser notification</option>
                <option value="both">Email and browser</option>
              </select>
            </div>

            <div>
              <label className="minimal-label">Preferred delivery time</label>
              <input
                type="time"
                value={prefs.dailyDevotionalTime}
                onChange={(event) =>
                  setPrefs({
                    ...prefs,
                    dailyDevotionalTime: event.target.value,
                  })
                }
                className="minimal-input"
              />
            </div>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Prayer updates</strong>
                <p>Follow activity around your prayer rhythm.</p>
              </span>
              <span className="minimal-badge">
                <BellRing size={14} />
                <input
                  type="checkbox"
                  checked={prefs.prayerUpdates}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      prayerUpdates: event.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>

            <label className="minimal-item">
              <span>
                <strong className="minimal-link">Newsletter</strong>
                <p>Hear about new tools, content, and featured study tracks.</p>
              </span>
              <span className="minimal-badge">
                <Newspaper size={14} />
                <input
                  type="checkbox"
                  checked={prefs.newsletter}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      newsletter: event.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />
              </span>
            </label>
          </div>
          <div className="content-actions">
            <button
              type="button"
              className="button-primary"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save reminders"}
            </button>
            <Link href="/devotionals/daily" className="button-secondary">
              Open today's devotional
            </Link>
          </div>
        </section>

        <section className="content-card">
          <div className="content-section-heading">
            <p className="eyebrow">Browser notifications</p>
            <h2>Push-style delivery for daily devotionals</h2>
          </div>
          <div className="content-stack">
            <div className="content-card-note">
              <strong>Browser status</strong>
              <p>
                {browserPermission === "unsupported"
                  ? "This browser does not support notifications."
                  : `Permission is currently ${browserPermission}.`}
              </p>
            </div>
            <div className="content-card-note">
              <strong>What this does</strong>
              <p>
                Register this browser for scheduled devotional delivery through
                a real service worker and web-push subscription, especially
                helpful on desktop or an installed PWA.
              </p>
            </div>
            <div className="content-card-note">
              <strong>Push infrastructure</strong>
              <p>
                {process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                  ? `${prefs.pushSubscriptions.length} browser subscription${prefs.pushSubscriptions.length === 1 ? "" : "s"} saved for this account.`
                  : "Add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to turn on scheduled browser push delivery."}
              </p>
            </div>
            <div className="content-actions">
              <button
                type="button"
                className="button-primary"
                onClick={() => void enableBrowserNotifications()}
                disabled={subscriptionBusy}
              >
                {subscriptionBusy ? "Working..." : "Enable browser notifications"}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => void disableBrowserNotifications()}
                disabled={subscriptionBusy || !prefs.browserPushEnabled}
              >
                Remove browser subscription
              </button>
              <button type="button" className="button-secondary" onClick={sendBrowserPreview}>
                Send preview notification
              </button>
            </div>
            <span className="content-badge">
              <Smartphone size={14} />
              PWA-ready direction
            </span>
          </div>
        </section>
      </section>

      {preview ? (
        <section className="content-section-card content-stack">
          <div className="content-section-heading">
            <p className="eyebrow">Today's preview</p>
            <h2>See what your devotional delivery will include</h2>
          </div>
          <div className="content-grid-two">
            <article className="content-card">
              <div className="content-card-note">
                <strong>{preview.title}</strong>
                <p>{preview.verse.reference}</p>
              </div>
              <div className="content-card-note">
                <strong>Verse</strong>
                <p>{preview.verse.text}</p>
              </div>
            </article>
            <article className="content-card">
              <div className="content-card-note">
                <strong>Reflection</strong>
                <p>{preview.reflection[0] ?? preview.prayer}</p>
              </div>
              <div className="content-card-note">
                <strong>Prayer</strong>
                <p>{preview.prayer}</p>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      {statusMessage ? <p className="share-status">{statusMessage}</p> : null}
    </main>
  );
}
