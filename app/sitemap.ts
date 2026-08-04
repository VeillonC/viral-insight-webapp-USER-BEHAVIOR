import type { MetadataRoute } from "next";

const SITE_URL = "https://viral-insight-webapp-user-behavior.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/analyze", "/variant-lab", "/history", "/insights"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
