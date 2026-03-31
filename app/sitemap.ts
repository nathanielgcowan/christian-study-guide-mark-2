import type { MetadataRoute } from "next";
import { getBibleCharacters, getBibleLocations } from "@/lib/bible-atlas";
import { BIBLE_BOOKS } from "@/lib/bible";
import { blogSlugs, publicStaticRoutes } from "@/lib/site-routes";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const routes: MetadataRoute.Sitemap = publicStaticRoutes.map((route) => ({
    url: `${baseUrl}${route || "/"}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const characterRoutes: MetadataRoute.Sitemap = getBibleCharacters().map((character) => ({
    url: `${baseUrl}/characters/${character.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const atlasRoutes: MetadataRoute.Sitemap = getBibleLocations().map((location) => ({
    url: `${baseUrl}/maps/${location.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const bibleBookRoutes: MetadataRoute.Sitemap = BIBLE_BOOKS.map((book) => ({
    url: `${baseUrl}/bible/${encodeURIComponent(book.name)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...routes, ...blogRoutes, ...characterRoutes, ...atlasRoutes, ...bibleBookRoutes];
}
