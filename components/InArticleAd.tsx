"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type InArticleAdProps = {
  slot?: string;
  className?: string;
};

export default function InArticleAd({
  slot,
  className = "",
}: InArticleAdProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT;

  useEffect(() => {
    if (!client || !adSlot || typeof window === "undefined") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense in-article ad failed to initialize:", error);
    }
  }, [client, adSlot]);

  if (!client || !adSlot) {
    return null;
  }

  return (
    <aside className={`in-article-ad ${className}`.trim()} aria-label="Advertisement">
      <div className="in-article-ad-label">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={client}
        data-ad-slot={adSlot}
      />
    </aside>
  );
}
