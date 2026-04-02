export interface BrowserPushSubscriptionRecord {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailPreferences {
  dailyDevotional: boolean;
  prayerUpdates: boolean;
  newsletter: boolean;
  dailyDevotionalChannel: "email" | "browser" | "both";
  dailyDevotionalTime: string;
  browserPushEnabled: boolean;
  pushSubscriptions: BrowserPushSubscriptionRecord[];
}

export function getDefaultEmailPrefs(): EmailPreferences {
  return {
    dailyDevotional: false,
    prayerUpdates: false,
    newsletter: false,
    dailyDevotionalChannel: "email",
    dailyDevotionalTime: "07:00",
    browserPushEnabled: false,
    pushSubscriptions: [],
  };
}
