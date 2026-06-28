import { z } from "zod";

const sectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
});

const keySignSchema = z.object({
  sign: z.string(),
  reason: z.string(),
});

function normalizeStructuredSections(value: unknown) {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    return Object.entries(value).map(([heading, content]) => ({
      heading,
      content:
        typeof content === "string"
          ? content
          : content && typeof content === "object" && "content" in content
            ? String((content as { content: unknown }).content)
            : JSON.stringify(content),
    }));
  }

  return [];
}

function normalizeKeySigns(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    if (typeof item === "string") {
      return { sign: item, reason: "模型未提供原因，需人工复核。" };
    }
    return item;
  });
}

export const generationTypeSchema = z.enum([
  "daily",
  "weekly",
  "monthly",
  "zodiac_guide",
  "astrology_calendar",
]);

export const articleCategorySchema = z.enum([
  "daily_horoscope",
  "weekly_horoscope",
  "monthly_horoscope",
  "zodiac_guide",
  "astrology_guide",
]);

export const astroEventInputSchema = z.object({
  date: z.string(),
  event_type: z.string(),
  planet_1: z.string().nullable().optional(),
  planet_2: z.string().nullable().optional(),
  sign: z.string().nullable().optional(),
  aspect: z.string().nullable().optional(),
  description: z.string(),
  source: z.string().optional(),
});

export const generationInputSchema = z.object({
  generation_type: generationTypeSchema,
  target_date: z.string(),
  date_range: z.object({
    start: z.string(),
    end: z.string(),
  }),
  timezone: z.literal("Asia/Shanghai"),
  language: z.literal("zh-CN"),
  output_languages: z.tuple([z.literal("zh-CN"), z.literal("en-US")]),
  content_intent: z.literal("publish_to_website"),
  article_category: articleCategorySchema,
  astro_events: z.array(astroEventInputSchema),
  weekly_context: z
    .object({
      theme: z.string(),
      notes: z.string(),
    })
    .optional(),
  internal_links: z.array(
    z.object({
      anchor: z.string(),
      url: z.string(),
    }),
  ),
  site_name: z.string(),
  site_base_url: z.string(),
});

export const llmArticleOutputSchema = z.object({
  generation_type: generationTypeSchema,
  article_category: articleCategorySchema,
  target_date: z.string(),
  date_range: z.object({
    start: z.string(),
    end: z.string(),
  }),
  article: z.object({
    title: z.string().min(6),
    slug: z.string().min(3),
    seo_title: z.string().min(6),
    seo_description: z.string().min(30).max(180),
    excerpt: z.string().min(20),
    canonical_path: z.string().startsWith("/"),
    indexable: z.boolean(),
    content_type: z.string(),
    tags: z.array(z.string()),
    body_markdown: z.string().min(500),
    disclaimer: z.string().min(20),
  }),
  article_en: z.object({
    title: z.string().min(6),
    seo_title: z.string().min(6),
    seo_description: z.string().min(30).max(180),
    excerpt: z.string().min(20),
    tags: z.array(z.string()),
    body_markdown: z.string().min(300),
    disclaimer: z.string().min(20),
  }),
  structured_sections: z.preprocess(normalizeStructuredSections, z.array(sectionSchema)),
  zodiac_summaries: z.array(
    z.object({
      sign: z.string(),
      keyword: z.string().optional(),
      summary: z.string(),
      general: z.string().optional(),
      love: z.string().optional(),
      career: z.string().optional(),
      money: z.string().optional(),
      health: z.string().optional(),
      advice: z.string(),
    }),
  ),
  key_signs: z.preprocess(normalizeKeySigns, z.array(keySignSchema)),
  internal_links_used: z.array(
    z.object({
      anchor: z.string(),
      url: z.string(),
    }),
  ),
  quality_check: z.object({
    safe_to_publish: z.boolean(),
    is_too_thin: z.boolean(),
    is_repetitive: z.boolean(),
    has_fake_astro_event: z.boolean(),
    has_absolute_prediction: z.boolean(),
    has_medical_or_financial_advice: z.boolean(),
    has_clear_user_value: z.boolean(),
    has_disclaimer: z.boolean(),
    notes: z.string(),
  }),
});

export type GenerationInput = z.infer<typeof generationInputSchema>;
export type LlmArticleOutput = z.infer<typeof llmArticleOutputSchema>;
