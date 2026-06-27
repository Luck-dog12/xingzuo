import { unstable_noStore as noStore } from "next/cache";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Article as PrismaArticle, ZodiacSummary } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { fallbackArticles, fallbackSitePages } from "@/lib/static-content";
import { getShanghaiToday } from "@/lib/dates";
import type { ArticleStatus, ArticleView, ContentType, RiskLevel, SitePageView } from "@/lib/types";

type PrismaArticleWithSummaries = PrismaArticle & {
  zodiacSummaries?: ZodiacSummary[];
};

function mapArticle(article: PrismaArticleWithSummaries): ArticleView {
  return {
    id: article.id,
    title: article.title,
    titleEn: article.titleEn,
    slug: article.slug,
    seoTitle: article.seoTitle,
    seoTitleEn: article.seoTitleEn,
    seoDescription: article.seoDescription,
    seoDescriptionEn: article.seoDescriptionEn,
    excerpt: article.excerpt,
    excerptEn: article.excerptEn,
    bodyMarkdown: article.bodyMarkdown,
    bodyMarkdownEn: article.bodyMarkdownEn,
    contentType: article.contentType as ContentType,
    articleCategory: article.articleCategory,
    targetDate: article.targetDate,
    dateRangeStart: article.dateRangeStart,
    dateRangeEnd: article.dateRangeEnd,
    canonicalPath: article.canonicalPath,
    indexable: article.indexable,
    status: article.status as ArticleStatus,
    qualityScore: article.qualityScore,
    riskLevel: article.riskLevel as RiskLevel,
    tags: article.tags ?? [],
    tagsEn: article.tagsEn ?? [],
    publishedAt: article.publishedAt,
    zodiacSummaries:
      article.zodiacSummaries?.map((summary) => ({
        ...summary,
        keyword: "",
      })) ?? [],
  };
}

function getLocalGeneratedDailyArticle(): ArticleView | null {
  const today = getShanghaiToday();
  const generatedPath = path.join(process.cwd(), "generated", `daily-horoscope-${today}-agent.md`);
  if (!existsSync(generatedPath)) return null;

  const bodyMarkdown = readFileSync(generatedPath, "utf8");
  const title = bodyMarkdown.match(/^#\s+(.+)$/m)?.[1] ?? `${today} 十二星座今日运势`;

  return {
    id: `local-generated-daily-${today}`,
    title,
    titleEn: `${today} Daily Horoscope for the 12 Zodiac Signs`,
    slug: `daily-${today}`,
    seoTitle: title,
    seoTitleEn: `${today} Daily Horoscope for the 12 Zodiac Signs`,
    seoDescription: `${today} 十二星座今日运势，包含整体氛围与白羊座到双鱼座的综合、关系和行动建议。`,
    seoDescriptionEn: `${today} daily horoscope for the 12 zodiac signs with practical reflection prompts.`,
    excerpt: "今日适合把注意力放回沟通、关系节奏和小步行动，温和观察自己的状态。",
    excerptEn: "A gentle daily horoscope for reflection, communication, and practical next steps.",
    bodyMarkdown,
    bodyMarkdownEn: null,
    contentType: "daily_horoscope",
    articleCategory: "daily_horoscope",
    targetDate: new Date(`${today}T00:00:00+08:00`),
    dateRangeStart: new Date(`${today}T00:00:00+08:00`),
    dateRangeEnd: new Date(`${today}T00:00:00+08:00`),
    canonicalPath: `/daily-horoscope/${today}`,
    indexable: true,
    status: "published",
    qualityScore: 90,
    riskLevel: "low",
    tags: ["十二星座", "今日运势", "AI生成"],
    tagsEn: ["12 Zodiac Signs", "Daily Horoscope", "AI Generated"],
    publishedAt: new Date(),
    zodiacSummaries: [],
  };
}

function getFallbackArticlesWithLocalGenerated() {
  const localDaily = getLocalGeneratedDailyArticle();
  if (!localDaily) return fallbackArticles;
  return [localDaily, ...fallbackArticles.filter((article) => article.canonicalPath !== localDaily.canonicalPath)];
}

export async function getPublishedArticles(contentType?: ContentType, limit = 12) {
  const prisma = getPrisma();

  if (!prisma) {
    return getFallbackArticlesWithLocalGenerated()
      .filter((article) => !contentType || article.contentType === contentType)
      .slice(0, limit);
  }

  const articles = await prisma.article.findMany({
    where: {
      status: "published",
      ...(contentType ? { contentType } : {}),
    },
    include: { zodiacSummaries: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return articles.map(mapArticle);
}

export async function getLatestPublishedArticle(contentType: ContentType) {
  const [article] = await getPublishedArticles(contentType, 1);
  return article ?? null;
}

export async function getArticleByCanonicalPath(path: string) {
  const prisma = getPrisma();

  if (!prisma) {
    return getFallbackArticlesWithLocalGenerated().find((article) => article.canonicalPath === path) ?? null;
  }

  const article = await prisma.article.findFirst({
    where: {
      canonicalPath: path,
      status: "published",
    },
    include: { zodiacSummaries: true },
  });

  return article ? mapArticle(article) : null;
}

export async function getArticleBySlug(slug: string) {
  const prisma = getPrisma();

  if (!prisma) {
    return getFallbackArticlesWithLocalGenerated().find((article) => article.slug === slug) ?? null;
  }

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "published",
    },
    include: { zodiacSummaries: true },
  });

  return article ? mapArticle(article) : null;
}

export async function getSitePage(slug: string): Promise<SitePageView | null> {
  const prisma = getPrisma();

  if (!prisma) {
    return fallbackSitePages.find((page) => page.slug === slug) ?? null;
  }

  return prisma.sitePage.findUnique({ where: { slug } });
}

export async function getAdminArticles() {
  noStore();
  const prisma = getPrisma();
  if (!prisma) {
    return getFallbackArticlesWithLocalGenerated();
  }

  const articles = await prisma.article.findMany({
    orderBy: [{ updatedAt: "desc" }],
    take: 100,
  });

  return articles.map(mapArticle);
}

export async function getAdminStats() {
  noStore();
  const prisma = getPrisma();
  if (!prisma) {
    return {
      articles: fallbackArticles.length,
      published: fallbackArticles.length,
      pendingReview: 0,
      jobs: 0,
      qualityAverage: 89,
    };
  }

  const [articles, published, pendingReview, jobs, quality] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "published" } }),
    prisma.article.count({ where: { status: { in: ["checked", "approved"] } } }),
    prisma.generationJob.count(),
    prisma.article.aggregate({ _avg: { qualityScore: true } }),
  ]);

  return {
    articles,
    published,
    pendingReview,
    jobs,
    qualityAverage: Math.round(quality._avg.qualityScore ?? 0),
  };
}
