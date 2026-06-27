import type { GenerationInput, LlmArticleOutput } from "@/lib/agent/schema";
import { zodiacNames } from "@/lib/zodiac";

const blockedPhrases = [
  "一定会",
  "必然发生",
  "注定",
  "百分百",
  "绝对不能",
  "马上分手",
  "必定破财",
  "会生病",
  "必须辞职",
  "必须投资",
  "灾难",
  "无法避免",
];

const professionalAdvicePhrases = [
  "医疗诊断",
  "投资建议",
  "法律判断",
  "必须买入",
  "必须卖出",
  "必须离婚",
  "必须分手",
  "必须辞职",
  "必须投资",
];

const concreteAstroTerms = [
  "水星逆行",
  "水逆",
  "满月",
  "新月",
  "金星进入",
  "火星进入",
  "木星进入",
  "土星进入",
  "合相",
  "刑相",
  "冲相",
  "拱相",
  "六合",
];

const publicKeywordLabels = ["关键词：", "关键词:", "核心关键词", "性格关键词", "今日关键词", "本周关键词"];

function countChineseLikeChars(value: string) {
  return Array.from(value.replace(/\s/g, "")).length;
}

function hasAny(value: string, phrases: string[]) {
  return phrases.some((phrase) => value.includes(phrase));
}

function hasAllZodiacSigns(value: string) {
  return zodiacNames.every((name) => value.includes(name));
}

function hasFakeAstroEvent(value: string, input: GenerationInput) {
  if (input.astro_events.length > 0) {
    return false;
  }
  return hasAny(value, concreteAstroTerms);
}

function hasRepetitiveSections(value: string) {
  const paragraphs = value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 20);
  const unique = new Set(paragraphs);
  return paragraphs.length > 6 && unique.size / paragraphs.length < 0.75;
}

export function evaluateArticleQuality(output: LlmArticleOutput, input: GenerationInput) {
  const body = output.article.body_markdown;
  const bodyEn = output.article_en.body_markdown;
  const text = `${output.article.title}\n${output.article.seo_description}\n${body}`;
  const length = countChineseLikeChars(body);
  const minimumLength =
    input.generation_type === "monthly"
      ? 2400
      : input.generation_type === "weekly"
        ? 2000
        : input.generation_type === "zodiac_guide"
          ? 1600
          : 1000;

  const checks = {
    isTooThin: length < minimumLength,
    hasAllZodiac: hasAllZodiacSigns(body),
    hasDisclaimer: body.includes("不构成") || output.article.disclaimer.includes("不构成"),
    hasAbsolutePrediction: hasAny(text, blockedPhrases),
    hasMedicalOrFinancialAdvice: hasAny(text, professionalAdvicePhrases),
    hasFakeAstroEvent: hasFakeAstroEvent(body, input),
    isRepetitive: hasRepetitiveSections(body),
    hasPublicKeywordLabel: hasAny(body, publicKeywordLabels),
    hasSeo: Boolean(output.article.seo_title && output.article.seo_description),
    hasEnglishArticle: Boolean(
      output.article_en.title &&
        output.article_en.seo_title &&
        output.article_en.seo_description &&
        output.article_en.excerpt &&
        output.article_en.tags.length > 0 &&
        bodyEn.length >= 300,
    ),
    hasClearUserValue: body.includes("建议") || body.includes("适合") || body.includes("留意"),
    hasInternalLinks: output.internal_links_used.length > 0 || input.internal_links.length === 0,
  };

  let score = 100;
  if (checks.isTooThin) score -= 25;
  if (!checks.hasAllZodiac && input.generation_type !== "astrology_calendar") score -= 15;
  if (!checks.hasDisclaimer) score -= 10;
  if (checks.hasAbsolutePrediction) score -= 20;
  if (checks.hasMedicalOrFinancialAdvice) score -= 25;
  if (checks.hasFakeAstroEvent) score -= 25;
  if (checks.isRepetitive) score -= 10;
  if (checks.hasPublicKeywordLabel) score -= 20;
  if (!checks.hasSeo) score -= 10;
  if (!checks.hasEnglishArticle) score -= 20;
  if (!checks.hasClearUserValue) score -= 10;
  if (!checks.hasInternalLinks) score -= 5;

  const blocking =
    checks.hasAbsolutePrediction ||
    checks.hasMedicalOrFinancialAdvice ||
    checks.hasFakeAstroEvent ||
    checks.hasPublicKeywordLabel;

  return {
    score: Math.max(0, score),
    riskLevel: blocking ? "blocking" : score >= 90 ? "low" : score >= 75 ? "medium" : "high",
    safeToPublish: score >= 90 && !blocking,
    notes: [
      `字数约 ${length}。`,
      checks.isTooThin ? "内容偏薄。" : "正文长度达标。",
      checks.hasAllZodiac ? "十二星座完整。" : "十二星座不完整。",
      checks.hasFakeAstroEvent ? "疑似编造未提供星象。" : "未发现编造星象。",
      checks.hasAbsolutePrediction ? "存在绝对化表达。" : "未发现绝对化表达。",
      checks.hasMedicalOrFinancialAdvice ? "存在专业建议风险。" : "未发现医疗/投资/法律建议风险。",
      checks.hasPublicKeywordLabel ? "正文出现关键词标签。" : "未发现关键词标签。",
      checks.hasEnglishArticle ? "英文版本完整。" : "英文版本缺失或过短。",
    ].join(" "),
    checks,
  };
}
