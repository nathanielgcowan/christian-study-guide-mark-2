import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Christian Study Guide",
    short_name: "Study Guide",
    description:
      "Scripture reading, prayer, devotionals, memorization, and deeper Bible study in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f2",
    theme_color: "#111111",
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        url: "/dashboard",
      },
      {
        name: "Reading Plans",
        short_name: "Plans",
        url: "/reading-plans",
      },
      {
        name: "Verse Images",
        short_name: "Images",
        url: "/user/verse-generator",
      },
    ],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
