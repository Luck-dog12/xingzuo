import type { GenerationInput, LlmArticleOutput } from "@/lib/agent/schema";
import { zodiacSigns } from "@/lib/zodiac";

const defaultLlmModel = "agnes-2.0-flash";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

function contentTypeFor(input: GenerationInput) {
  if (input.generation_type === "daily") return "daily_horoscope";
  if (input.generation_type === "weekly") return "weekly_horoscope";
  if (input.generation_type === "monthly") return "monthly_horoscope";
  if (input.generation_type === "astrology_calendar") return "astrology_calendar";
  return "zodiac_guide";
}

function canonicalPathHintFor(input: GenerationInput) {
  if (input.generation_type === "weekly") {
    return `/weekly-horoscope/${input.date_range.start}_${input.date_range.end}`;
  }
  if (input.generation_type === "monthly") {
    return `/monthly-horoscope/${input.target_date.slice(0, 7)}`;
  }
  if (input.generation_type === "astrology_calendar") {
    return "/astrology-calendar";
  }
  if (input.generation_type === "zodiac_guide") {
    return "/astrology-guide/[descriptive-slug]";
  }
  return `/daily-horoscope/${input.target_date}`;
}

function buildLlmMessages(input: GenerationInput) {
  const systemPrompt = [
    "You are an expert bilingual astrology content editor for a public horoscope website.",
    "Return only valid JSON. Do not wrap the response in markdown fences or add explanatory text.",
    "Write original, publishable zh-CN and en-US content for entertainment and reflection.",
    "Do not make absolute predictions. Do not provide medical, legal, financial, investment, or major life decision advice.",
    "Use only astrology events present in input. If input.astro_events is empty, do not invent concrete planetary events, retrogrades, full moons, aspects, or transits.",
    "The Chinese body must include practical reader value and, except for astrology_calendar, all 12 zodiac signs.",
    "Avoid keyword-stuffing labels such as '关键词：' inside article body content.",
  ].join("\n");

  const userPrompt = {
    task: "Generate one complete article JSON object that matches this exact contract.",
    input,
    required_output_shape: {
      generation_type: input.generation_type,
      article_category: input.article_category,
      target_date: input.target_date,
      date_range: input.date_range,
      article: {
        title: "string, zh-CN, at least 6 chars",
        slug: "lowercase URL slug, at least 3 chars",
        seo_title: "string, zh-CN, at least 6 chars",
        seo_description: "string, zh-CN, 30-180 chars",
        excerpt: "string, zh-CN, at least 20 chars",
        canonical_path: canonicalPathHintFor(input),
        indexable: true,
        content_type: contentTypeFor(input),
        tags: ["string"],
        body_markdown: "string, zh-CN markdown. daily >= 1200 Chinese chars, weekly >= 2200, monthly >= 2600, astrology_calendar >= 1000.",
        disclaimer: "string, zh-CN, entertainment/reflection only and not professional advice",
      },
      article_en: {
        title: "string, en-US, at least 6 chars",
        seo_title: "string, en-US, at least 6 chars",
        seo_description: "string, en-US, 30-180 chars",
        excerpt: "string, en-US, at least 20 chars",
        tags: ["string"],
        body_markdown: "string, en-US markdown, at least 500 words for horoscope content or 300 words for calendar content",
        disclaimer: "string, en-US, entertainment/reflection only and not professional advice",
      },
      structured_sections: [{ heading: "string", content: "string" }],
      zodiac_summaries:
        input.generation_type === "astrology_calendar"
          ? []
          : zodiacSigns.map((sign) => ({
              sign: sign.name,
              keyword: "string",
              summary: "string",
              general: "string",
              love: "string",
              career: "string",
              money: "string",
              health: "string",
              advice: "string",
            })),
      key_signs: [{ sign: "string", reason: "string" }],
      internal_links_used: input.internal_links.slice(0, 3),
      quality_check: {
        safe_to_publish: true,
        is_too_thin: false,
        is_repetitive: false,
        has_fake_astro_event: false,
        has_absolute_prediction: false,
        has_medical_or_financial_advice: false,
        has_clear_user_value: true,
        has_disclaimer: true,
        notes: "string",
      },
    },
  };

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(userPrompt) },
  ];
}

function parseJsonFromModelContent(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonText = fenced ? fenced[1] : trimmed;

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    const firstBrace = jsonText.indexOf("{");
    const lastBrace = jsonText.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(jsonText.slice(firstBrace, lastBrace + 1));
    }
    throw error;
  }
}

const disclaimer =
  "本文为十二星座公共运势与娱乐性内容，不构成医疗、投资、法律或重大人生决策建议。";
const disclaimerEn =
  "This article is public zodiac content for entertainment and reflection. It is not medical, financial, legal, or major life decision advice.";

function zodiacBlocks(period: string) {
  return zodiacSigns
    .map(
      (sign) => `### ${sign.name}

${period}可以参考这条公共星座描述：${sign.summary}

综合：适合观察真实节奏，不必急着给自己贴标签。

爱情：关系互动中建议先表达感受，再讨论具体安排。

事业：适合把任务拆成可执行的小步骤，避免一次承担过多。

财运：消费和预算更适合保持弹性，先确认必要性。

健康：这里仅作生活节奏提醒，建议留意休息、饮水和作息，不替代专业意见。

建议：不妨选择一个最容易完成的小行动，让状态逐步稳定。`,
    )
    .join("\n\n");
}

function zodiacBlocksEn(period: string) {
  return zodiacSigns
    .map(
      (sign) => `### ${sign.englishName} (${sign.name})

For ${period}, use this section as a gentle reflection prompt rather than a fixed judgement. Read the sign through its public zodiac profile and your real-life context.

General: Notice the pace of the day before deciding what needs action.

Relationships: Start with clear feelings, then move into practical plans.

Work: Break larger tasks into smaller steps and protect attention from overload.

Money: Keep budgeting flexible and check whether a purchase is truly needed.

Wellbeing: This is only a lifestyle reminder. Prioritize rest, hydration, and a steady routine when possible.

Suggestion: Choose one small action that can make the day feel more grounded.`,
    )
    .join("\n\n");
}

function titleFor(input: GenerationInput) {
  if (input.generation_type === "weekly") {
    return `${input.date_range.start} 至 ${input.date_range.end} 十二星座本周运势：边界、协作与复盘`;
  }
  if (input.generation_type === "monthly") {
    return `${input.target_date.slice(0, 7)} 十二星座本月运势：长期节奏与自我照顾`;
  }
  if (input.generation_type === "astrology_calendar") {
    return `${input.date_range.start} 至 ${input.date_range.end} 星象日历：公共节奏参考`;
  }
  return `${input.target_date} 十二星座今日运势：沟通、节奏与关系整理`;
}

function titleForEn(input: GenerationInput) {
  if (input.generation_type === "weekly") {
    return `${input.date_range.start} to ${input.date_range.end} Weekly Horoscope for the 12 Zodiac Signs`;
  }
  if (input.generation_type === "monthly") {
    return `${input.target_date.slice(0, 7)} Monthly Horoscope for the 12 Zodiac Signs`;
  }
  if (input.generation_type === "astrology_calendar") {
    return `${input.date_range.start} to ${input.date_range.end} Astrology Calendar and Public Rhythm Guide`;
  }
  return `${input.target_date} Daily Horoscope for the 12 Zodiac Signs`;
}

function canonicalPathFor(input: GenerationInput) {
  if (input.generation_type === "weekly") {
    return `/weekly-horoscope/${input.date_range.start}_${input.date_range.end}`;
  }
  if (input.generation_type === "monthly") {
    return `/monthly-horoscope/${input.target_date.slice(0, 7)}`;
  }
  if (input.generation_type === "astrology_calendar") {
    return "/astrology-calendar";
  }
  return `/daily-horoscope/${input.target_date}`;
}

function introFor(input: GenerationInput) {
  if (input.astro_events.length === 0) {
    return "本篇内容以十二星座基础资料为参考，未提供具体星象数据，因此不会声称任何具体行星、相位或逆行正在产生影响。";
  }

  const events = input.astro_events
    .map((event) => `- ${event.date}：${event.event_type}。${event.description}`)
    .join("\n");

  return `本篇内容参考以下已提供星象数据，并只在这些信息范围内进行公共解释：\n\n${events}`;
}

function introForEn(input: GenerationInput) {
  if (input.astro_events.length === 0) {
    return "This article uses general zodiac reference material only. Because no concrete astrology events were provided, it does not claim that a specific planet, aspect, retrograde, new moon, or full moon is influencing readers.";
  }

  const events = input.astro_events
    .map((event) => `- ${event.date}: ${event.event_type}. ${event.description}`)
    .join("\n");

  return `This article only interprets the following provided astrology events as public context:\n\n${events}`;
}

export function generateFallbackArticle(input: GenerationInput): LlmArticleOutput {
  const title = titleFor(input);
  const titleEn = titleForEn(input);
  const canonicalPath = canonicalPathFor(input);
  const period =
    input.generation_type === "weekly"
      ? "本周"
      : input.generation_type === "monthly"
        ? "本月"
        : "今天";
  const periodEn =
    input.generation_type === "weekly"
      ? "this week"
      : input.generation_type === "monthly"
        ? "this month"
        : "today";

  const body =
    input.generation_type === "astrology_calendar"
      ? `# ${title}

## 星象日历说明

${introFor(input)}

星象日历适合用来观察公共情绪、沟通、人际和行动节奏，而不是进行恐吓式预测或个人命盘判断。

## 使用建议

可以把星象主题当作复盘工具：先记录真实感受，再决定要调整沟通、计划还是休息安排。`
      : `# ${title}

## 整体主题

${introFor(input)}

${period}适合把注意力放在沟通节奏、关系边界和日常安排上。星座内容更适合作为温和的自我观察工具，而不是确定性判断。

## 适合做什么

适合复盘计划、补齐信息、整理待办优先级，并在关系互动中给彼此留下更清楚的表达空间。

## 需要注意什么

避免用情绪替代沟通，也不要把一时状态解读成固定结果。更稳妥的方式是先观察，再用具体行动调整节奏。

## 十二星座提醒

${zodiacBlocks(period)}

## 重点星座

白羊座适合放慢回应速度，天秤座适合减少过度迎合，双鱼座适合把感受转化为具体请求。这些提醒来自公共星座原型，不涉及任何个人隐私或命盘信息。

## ${period}建议

把“马上解决所有问题”换成“先完成一个清晰步骤”，更有助于稳定节奏。`;
  const bodyEn =
    input.generation_type === "astrology_calendar"
      ? `# ${titleEn}

## How to Read This Calendar

${introForEn(input)}

The astrology calendar is designed to organize public sky events and translate them into light, readable themes around communication, relationships, planning, and daily rhythm. It should not be used as a fear-based forecast or as a personal birth-chart judgement.

## Practical Use

Treat each theme as a reflection tool. Notice what feels clear, what needs more time, and where a conversation or plan may benefit from a calmer pace. If no event data is available, the page stays general and avoids inventing specific planetary claims.

## Safety Note

Use this content as entertainment and self-reflection. For health, finance, legal, relationship, or career decisions, rely on qualified information and your own real-life context.`
      : `# ${titleEn}

## Overall Theme

${introForEn(input)}

For ${periodEn}, the useful focus is communication pace, relationship boundaries, and everyday planning. Zodiac content works best as a soft mirror for reflection, not as a fixed prediction about what must happen.

## What to Lean Into

Review recent plans, fill in missing information, simplify priorities, and leave room for clearer expression in conversations. When emotions feel strong, pause long enough to name what is happening before choosing the next step.

## What to Watch

Avoid replacing communication with assumptions. A temporary mood should not be treated as a permanent conclusion. A steadier approach is to observe first, then adjust with one concrete action.

## Guidance for the 12 Zodiac Signs

${zodiacBlocksEn(periodEn)}

## Signs to Notice

Aries may benefit from slowing the response pace, Libra from reducing unnecessary accommodation, and Pisces from turning feelings into clear requests. These notes are based on public zodiac reference material and do not use private or birth-chart information.

## Gentle Suggestion

Replace "I need to solve everything now" with "I can complete one clear step first." That shift is often enough to make the rhythm feel steadier.

${disclaimerEn}`;

  return {
    generation_type: input.generation_type,
    article_category: input.article_category,
    target_date: input.target_date,
    date_range: input.date_range,
    article: {
      title,
      slug: canonicalPath.replace(/^\//, "").replaceAll("/", "-").replaceAll("_", "-"),
      seo_title: title,
      seo_description:
        input.generation_type === "astrology_calendar"
          ? "查看星象日历和公共节奏解释，了解如何温和使用星象信息进行生活复盘。"
          : "查看十二星座公共运势，包含整体主题、十二星座提醒、重点星座展开和娱乐性免责声明。",
      excerpt:
        "本篇内容以公共星座原型与已提供星象数据为基础，提供温和、可执行的生活节奏参考。",
      canonical_path: canonicalPath,
      indexable: input.generation_type !== "daily" || body.length > 1600,
      content_type:
        input.generation_type === "daily"
          ? "daily_horoscope"
          : input.generation_type === "weekly"
            ? "weekly_horoscope"
            : input.generation_type === "monthly"
              ? "monthly_horoscope"
              : "astrology_calendar",
      tags: ["十二星座", "星座运势", "公共运势"],
      body_markdown: body,
      disclaimer,
    },
    article_en: {
      title: titleEn,
      seo_title: titleEn,
      seo_description:
        input.generation_type === "astrology_calendar"
          ? "Read the astrology calendar as a public rhythm guide for reflection, planning, and gentle everyday awareness."
          : "Read public horoscope guidance for the 12 zodiac signs, including an overall theme and practical reflection prompts.",
      excerpt:
        "A bilingual public horoscope article for gentle reflection, based on zodiac reference material and any provided astrology events.",
      tags:
        input.generation_type === "astrology_calendar"
          ? ["Astrology Calendar", "Astrology Guide"]
          : ["12 Zodiac Signs", "Horoscope", "Public Astrology"],
      body_markdown: bodyEn,
      disclaimer: disclaimerEn,
    },
    structured_sections: [
      { heading: "整体主题", content: introFor(input) },
      { heading: "十二星座提醒", content: "包含十二星座综合提醒和具体建议。" },
    ],
    zodiac_summaries: zodiacSigns.map((sign) => ({
      sign: sign.name,
      keyword: "",
      summary: sign.summary,
      general: `${period}适合结合自身节奏做温和观察。`,
      love: "建议先表达感受，再讨论安排。",
      career: "适合拆解任务，稳步推进。",
      money: "适合保留预算弹性。",
      health: "仅作生活节奏提醒，留意休息与作息。",
      advice: "选择一个最小行动，让状态逐步稳定。",
    })),
    key_signs: [
      { sign: "白羊座", reason: "适合调整行动速度，避免过快回应。" },
      { sign: "天秤座", reason: "适合关注关系边界和沟通平衡。" },
      { sign: "双鱼座", reason: "适合把感受转化为具体请求。" },
    ],
    internal_links_used: input.internal_links.slice(0, 3),
    quality_check: {
      safe_to_publish: true,
      is_too_thin: false,
      is_repetitive: false,
      has_fake_astro_event: false,
      has_absolute_prediction: false,
      has_medical_or_financial_advice: false,
      has_clear_user_value: true,
      has_disclaimer: true,
      notes:
        input.astro_events.length === 0
          ? "未提供具体星象，因此文章基于十二星座常见解读生成，没有声称具体星象影响。"
          : "文章基于输入星象数据生成。",
    },
  };
}

export async function callConfiguredLlm(input: GenerationInput) {
  if (!process.env.LLM_API_URL || !process.env.LLM_API_KEY) {
    return generateFallbackArticle(input);
  }

  const model = process.env.LLM_MODEL || defaultLlmModel;
  const response = await fetch(process.env.LLM_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: buildLlmMessages(input),
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM response did not include choices[0].message.content.");
  }

  return parseJsonFromModelContent(content);
}
