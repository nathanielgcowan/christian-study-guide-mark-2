import React from "react";

const getShareUrl = (platform: string, url: string, text: string) => {
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
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

const SocialShare: React.FC<SocialShareProps> = ({ url, text }) => {
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || "Check this out!";

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <a
        href={getShareUrl("facebook", shareUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <span role="img" aria-label="Facebook">
          📘
        </span>
      </a>
      <a
        href={getShareUrl("twitter", shareUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
      >
        <span role="img" aria-label="Twitter">
          🐦
        </span>
      </a>
      <a
        href={getShareUrl("whatsapp", shareUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
      >
        <span role="img" aria-label="WhatsApp">
          💬
        </span>
      </a>
      <a
        href={getShareUrl("linkedin", shareUrl, shareText)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <span role="img" aria-label="LinkedIn">
          💼
        </span>
      </a>
    </div>
  );
};

export default SocialShare;
