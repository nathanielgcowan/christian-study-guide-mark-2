"use client";

import { Globe, BriefcaseBusiness, MessageCircle, Send } from "lucide-react";

const getShareUrl = (platform: string, url: string, text: string) => {
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`;
    case "linkedin":
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    default:
      return url;
  }
};

interface SocialShareProps {
  url?: string;
  text?: string;
}

const platforms = [
  {
    id: "facebook",
    label: "Facebook",
    Icon: Globe,
  },
  {
    id: "twitter",
    label: "X",
    Icon: Send,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    Icon: MessageCircle,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: BriefcaseBusiness,
  },
] as const;

export default function SocialShare({ url, text }: SocialShareProps) {
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || "Check this out!";

  return (
    <div className="social-share" aria-label="Share this page">
      {platforms.map(({ id, label, Icon }) => (
        <a
          key={id}
          href={getShareUrl(id, shareUrl, shareText)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="social-share-link"
        >
          <span className="social-share-icon" aria-hidden="true">
            <Icon size={15} strokeWidth={2} />
          </span>
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}
