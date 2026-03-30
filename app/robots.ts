import type { MetadataRoute } from "next";

function getBaseUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/user/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
