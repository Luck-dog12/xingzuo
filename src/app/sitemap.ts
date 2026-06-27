import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { zodiacSigns } from "@/lib/zodiac";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles(undefined, 500);
  const staticPaths = [
    "",
    "/daily-horoscope",
    "/weekly-horoscope",
    "/monthly-horoscope",
    "/zodiac",
    "/astrology-calendar",
    "/astrology-guide",
    "/about",
    "/contact",
    "/privacy-policy",
    "/cookie-policy",
    "/disclaimer",
    ...zodiacSigns.map((sign) => `/zodiac/${sign.slug}`),
  ];

  const staticEntries = staticPaths.map((path) => ({
    url: `${siteConfig.baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const articleEntries = articles
    .filter((article) => article.indexable && article.status === "published")
    .map((article) => ({
      url: `${siteConfig.baseUrl}${article.canonicalPath}`,
      lastModified: article.publishedAt ?? new Date(),
      changeFrequency: article.contentType === "daily_horoscope" ? ("daily" as const) : ("weekly" as const),
      priority: article.contentType === "zodiac_guide" ? 0.9 : 0.75,
    }));

  return [...staticEntries, ...articleEntries];
}
