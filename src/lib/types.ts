export type ArticleStatus =
  | "draft"
  | "generated"
  | "checked"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "rewrite_required"
  | "archived";

export type ContentType =
  | "daily_horoscope"
  | "weekly_horoscope"
  | "monthly_horoscope"
  | "zodiac_guide"
  | "astrology_guide"
  | "astrology_calendar"
  | "basic_page";

export type RiskLevel = "low" | "medium" | "high" | "blocking";

export type ZodiacSummaryView = {
  sign: string;
  keyword: string;
  summary: string;
  general?: string | null;
  love?: string | null;
  career?: string | null;
  money?: string | null;
  health?: string | null;
  advice: string;
};

export type ArticleView = {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  seoTitle: string;
  seoTitleEn?: string | null;
  seoDescription: string;
  seoDescriptionEn?: string | null;
  excerpt: string;
  excerptEn?: string | null;
  bodyMarkdown: string;
  bodyMarkdownEn?: string | null;
  contentType: ContentType;
  articleCategory: string;
  targetDate?: Date | null;
  dateRangeStart?: Date | null;
  dateRangeEnd?: Date | null;
  canonicalPath: string;
  indexable: boolean;
  status: ArticleStatus;
  qualityScore: number;
  riskLevel: RiskLevel;
  tags: string[];
  tagsEn?: string[];
  publishedAt?: Date | null;
  zodiacSummaries?: ZodiacSummaryView[];
};

export type SitePageView = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  bodyMarkdown: string;
  indexable: boolean;
};
