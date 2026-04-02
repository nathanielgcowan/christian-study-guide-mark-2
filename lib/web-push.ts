import webpush from "web-push";
import type { BrowserPushSubscriptionRecord } from "@/lib/notification-prefs";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export function getPublicVapidKey() {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
}

function getWebPushConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
  const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
  const subject = process.env.VAPID_SUBJECT ?? "mailto:noreply@example.com";

  if (!publicKey || !privateKey) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

export function isWebPushConfigured() {
  return Boolean(getWebPushConfig());
}

function configureWebPush() {
  const config = getWebPushConfig();
  if (!config) {
    return null;
  }

  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return config;
}

export async function sendBrowserPush(
  subscription: BrowserPushSubscriptionRecord,
  payload: PushPayload,
) {
  const config = configureWebPush();
  if (!config) {
    return { ok: false, error: "Missing VAPID configuration." };
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
      },
      JSON.stringify(payload),
      {
        TTL: 60 * 60,
        urgency: "normal",
      },
    );

    return { ok: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Push delivery failed.";
    return { ok: false, error: message };
  }
}
