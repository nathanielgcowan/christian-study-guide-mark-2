declare module "web-push" {
  type PushSubscription = {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      p256dh: string;
      auth: string;
    };
  };

  type PushOptions = {
    TTL?: number;
    urgency?: "very-low" | "low" | "normal" | "high";
  };

  const webpush: {
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    sendNotification(
      subscription: PushSubscription,
      payload?: string,
      options?: PushOptions,
    ): Promise<unknown>;
  };

  export default webpush;
}
