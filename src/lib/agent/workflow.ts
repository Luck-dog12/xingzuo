import { revalidatePath } from "next/cache";
import {
  ArticleStatus as PrismaArticleStatus,
  ContentType as PrismaContentType,
  RiskLevel as PrismaRiskLevel,
} from "@prisma/client";
import { callConfiguredLlm, generateFallbackArticle } from "@/lib/agent/generator";
import {
  generationInputSchema,
  llmArticleOutputSchema,
  type GenerationInput,
} from "@/lib/agent/schema";
import { evaluateArticleQuality } from "@/lib/agent/quality";
import { getMonthKey, getShanghaiToday, getWeekRange, isShanghaiFirstDayOfMonth } from "@/lib/dates";
import { getPrisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

type GenerationJobType = "daily" | "weekly" | "monthly" | "astrology_calendar";

function inputForJob(jobType: GenerationJobType): GenerationInput {
  const today = getShanghaiToday();
  const week = getWeekRange();
  const month = getMonthKey();

  if (jobType === "weekly") {
    return {
      generation_type: "weekly",
      target_date: today,
      date_range: { start: week.start, end: week.end },
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      output_languages: ["zh-CN", "en-US"],
      content_intent: "publish_to_website",
      article_category: "weekly_horoscope",
      astro_events: [],
      weekly_context: {
        theme: "本周关系沟通与边界感是重点",
        notes: "生成周运内容时需要体现一周内的趋势，而不是单日提醒。",
      },
      internal_links: [],
      site_name: siteConfig.name,
      site_base_url: siteConfig.baseUrl,
    };
  }

  if (jobType === "monthly") {
    return {
      generation_type: "monthly",
      target_date: `${month}-01`,
      date_range: { start: `${month}-01`, end: `${month}-28` },
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      output_languages: ["zh-CN", "en-US"],
      content_intent: "publish_to_website",
      article_category: "monthly_horoscope",
      astro_events: [],
      internal_links: [],
      site_name: siteConfig.name,
      site_base_url: siteConfig.baseUrl,
    };
  }

  if (jobType === "astrology_calendar") {
    return {
      generation_type: "astrology_calendar",
      target_date: today,
      date_range: { start: week.start, end: week.end },
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      output_languages: ["zh-CN", "en-US"],
      content_intent: "publish_to_website",
      article_category: "astrology_guide",
      astro_events: [],
      internal_links: [],
      site_name: siteConfig.name,
      site_base_url: siteConfig.baseUrl,
    };
  }

  return {
    generation_type: "daily",
    target_date: today,
    date_range: { start: today, end: today },
    timezone: "Asia/Shanghai",
    language: "zh-CN",
    output_languages: ["zh-CN", "en-US"],
    content_intent: "publish_to_website",
    article_category: "daily_horoscope",
    astro_events: [],
    weekly_context: {
      theme: "今日承接本周沟通与边界主题",
      notes: "日运需要简洁但不能生成十二句薄内容。",
    },
    internal_links: [],
    site_name: siteConfig.name,
    site_base_url: siteConfig.baseUrl,
  };
}

function jobKey(input: GenerationInput) {
  return `${input.generation_type}:${input.date_range.start}:${input.date_range.end}`;
}

function statusForScore(score: number, safeToPublish: boolean) {
  if (safeToPublish) return "published";
  if (score >= 75) return "checked";
  if (score >= 60) return "rewrite_required";
  return "rejected";
}

async function hydrateInput(input: GenerationInput) {
  const prisma = getPrisma();
  if (!prisma) return input;

  const [astroEvents, internalLinks] = await Promise.all([
    prisma.astroEvent.findMany({
      where: {
        status: "approved",
        date: {
          gte: new Date(`${input.date_range.start}T00:00:00+08:00`),
          lte: new Date(`${input.date_range.end}T00:00:00+08:00`),
        },
      },
      orderBy: { date: "asc" },
    }),
    prisma.internalLink.findMany({
      where: { isActive: true },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 12,
    }),
  ]);

  return generationInputSchema.parse({
    ...input,
    astro_events: astroEvents.map((event) => ({
      date: event.date.toISOString().slice(0, 10),
      event_type: event.eventType,
      planet_1: event.planet1,
      planet_2: event.planet2,
      sign: event.sign,
      aspect: event.aspect,
      description: event.description,
      source: event.source,
    })),
    internal_links: internalLinks.map((link) => ({
      anchor: link.anchor,
      url: link.url,
    })),
  });
}

export async function runGenerationWorkflow(jobType: GenerationJobType) {
  if (jobType === "monthly" && !isShanghaiFirstDayOfMonth()) {
    return { skipped: true, reason: "Monthly generation only runs on Shanghai day 1." };
  }

  const prisma = getPrisma();
  const input = await hydrateInput(inputForJob(jobType));
  const idempotencyKey = jobKey(input);

  const cronRun = prisma
    ? await prisma.cronRun.create({
        data: { jobName: jobType, status: "running", metadata: { idempotencyKey } },
      })
    : null;

  const job = prisma
    ? await prisma.generationJob.upsert({
        where: { idempotencyKey },
        update: { status: "running", attempts: { increment: 1 }, errorMessage: null },
        create: {
          jobType,
          targetDate: new Date(`${input.target_date}T00:00:00+08:00`),
          dateRangeStart: new Date(`${input.date_range.start}T00:00:00+08:00`),
          dateRangeEnd: new Date(`${input.date_range.end}T00:00:00+08:00`),
          status: "running",
          idempotencyKey,
          inputPayload: input,
          attempts: 1,
        },
      })
    : null;

  try {
    const rawOutput = await callConfiguredLlm(input);
    const parsedOutput = llmArticleOutputSchema.safeParse(rawOutput);
    const output = parsedOutput.success
      ? parsedOutput.data
      : llmArticleOutputSchema.parse(generateFallbackArticle(input));
    const quality = evaluateArticleQuality(output, input);
    const status = statusForScore(quality.score, quality.safeToPublish);
    const prismaContentType = output.article.content_type as PrismaContentType;
    const prismaArticleStatus = status as PrismaArticleStatus;
    const prismaRiskLevel = quality.riskLevel as PrismaRiskLevel;

    if (!prisma) {
      return { article: output.article, quality, status, persisted: false };
    }

    const article = await prisma.article.upsert({
      where: { canonicalPath: output.article.canonical_path },
      update: {
        title: output.article.title,
        titleEn: output.article_en.title,
        slug: output.article.slug,
        seoTitle: output.article.seo_title,
        seoTitleEn: output.article_en.seo_title,
        seoDescription: output.article.seo_description,
        seoDescriptionEn: output.article_en.seo_description,
        excerpt: output.article.excerpt,
        excerptEn: output.article_en.excerpt,
        bodyMarkdown: output.article.body_markdown,
        bodyMarkdownEn: output.article_en.body_markdown,
        contentType: prismaContentType,
        articleCategory: input.article_category,
        canonicalPath: output.article.canonical_path,
        indexable: output.article.indexable && quality.score >= 75,
        status: prismaArticleStatus,
        qualityScore: quality.score,
        riskLevel: prismaRiskLevel,
        sourceAstroEvents: input.astro_events,
        tags: output.article.tags,
        tagsEn: output.article_en.tags,
        publishedAt: status === "published" ? new Date() : null,
      },
      create: {
        title: output.article.title,
        titleEn: output.article_en.title,
        slug: output.article.slug,
        seoTitle: output.article.seo_title,
        seoTitleEn: output.article_en.seo_title,
        seoDescription: output.article.seo_description,
        seoDescriptionEn: output.article_en.seo_description,
        excerpt: output.article.excerpt,
        excerptEn: output.article_en.excerpt,
        bodyMarkdown: output.article.body_markdown,
        bodyMarkdownEn: output.article_en.body_markdown,
        contentType: prismaContentType,
        articleCategory: input.article_category,
        targetDate: new Date(`${input.target_date}T00:00:00+08:00`),
        dateRangeStart: new Date(`${input.date_range.start}T00:00:00+08:00`),
        dateRangeEnd: new Date(`${input.date_range.end}T00:00:00+08:00`),
        canonicalPath: output.article.canonical_path,
        indexable: output.article.indexable && quality.score >= 75,
        status: prismaArticleStatus,
        qualityScore: quality.score,
        riskLevel: prismaRiskLevel,
        sourceAstroEvents: input.astro_events,
        tags: output.article.tags,
        tagsEn: output.article_en.tags,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    await prisma.$transaction([
      prisma.zodiacSummary.deleteMany({ where: { articleId: article.id } }),
      prisma.qualityCheck.deleteMany({ where: { articleId: article.id } }),
      prisma.articleAstroEvent.deleteMany({ where: { articleId: article.id } }),
    ]);

    await prisma.zodiacSummary.createMany({
      data: output.zodiac_summaries.map((summary) => ({
        articleId: article.id,
        sign: summary.sign,
        keyword: "",
        summary: summary.summary,
        general: summary.general,
        love: summary.love,
        career: summary.career,
        money: summary.money,
        health: summary.health,
        advice: summary.advice,
      })),
    });

    await prisma.qualityCheck.create({
      data: {
        articleId: article.id,
        isTooThin: quality.checks.isTooThin,
        isRepetitive: quality.checks.isRepetitive,
        hasFakeAstroEvent: quality.checks.hasFakeAstroEvent,
        hasAbsolutePrediction: quality.checks.hasAbsolutePrediction,
        hasMedicalOrFinancialAdvice: quality.checks.hasMedicalOrFinancialAdvice,
        hasDisclaimer: quality.checks.hasDisclaimer,
        hasClearUserValue: quality.checks.hasClearUserValue,
        safeToPublish: quality.safeToPublish,
        score: quality.score,
        notes: quality.notes,
      },
    });

    await prisma.generationJob.update({
      where: { id: job!.id },
      data: {
        status:
          status === "published" || status === "checked"
            ? "completed"
            : status === "rewrite_required"
              ? "rewrite_required"
              : "rejected",
        llmOutput: output,
        completedAt: new Date(),
      },
    });

    if (cronRun) {
      await prisma.cronRun.update({
        where: { id: cronRun.id },
        data: { status: "completed", completedAt: new Date(), metadata: { idempotencyKey, articleId: article.id } },
      });
    }

    revalidatePath("/");
    revalidatePath(output.article.canonical_path);
    revalidatePath("/sitemap.xml");

    return { article, quality, status, persisted: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    if (prisma) {
      if (job) {
        await prisma.generationJob.update({
          where: { id: job.id },
          data: { status: "failed", errorMessage: message },
        });
      }
      if (cronRun) {
        await prisma.cronRun.update({
          where: { id: cronRun.id },
          data: { status: "failed", completedAt: new Date(), errorMessage: message },
        });
      }
    }
    throw error;
  }
}
