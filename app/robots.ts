import type { MetadataRoute } from "next";

const SITE_URL = "https://viral-insight-webapp-user-behavior.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
