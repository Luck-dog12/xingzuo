import { getShanghaiToday, getWeekRange, getMonthKey } from "@/lib/dates";
import type { ArticleView, SitePageView } from "@/lib/types";
import { zodiacSigns } from "@/lib/zodiac";

const today = getShanghaiToday();
const week = getWeekRange();
const month = getMonthKey();

function zodiacSummaryMarkdown(type: "今日" | "本周" | "本月") {
  return zodiacSigns
    .map(
      (sign) =>
        `### ${sign.name}\n\n${type}可以参考这条公共星座描述：${sign.summary} 建议把星座内容当作复盘工具，先留意真实感受，再决定下一步行动。`,
    )
    .join("\n\n");
}

function zodiacSummaryMarkdownEn(type: "today" | "this week" | "this month") {
  return zodiacSigns
    .map(
      (sign) =>
        `### ${sign.englishName} (${sign.name})\n\nFor ${type}, read this as a public zodiac reflection rather than a fixed judgement. Notice the real pace of the day, then decide one practical next step.`,
    )
    .join("\n\n");
}

export const fallbackArticles: ArticleView[] = [
  {
    id: "fallback-daily",
    title: `${today} 十二星座今日运势：沟通、节奏与关系整理`,
    titleEn: `${today} Daily Horoscope for the 12 Zodiac Signs`,
    slug: `daily-${today}`,
    seoTitle: `${today}十二星座今日运势：沟通、节奏与关系整理`,
    seoTitleEn: `${today} Daily Horoscope for the 12 Zodiac Signs`,
    seoDescription:
      "查看今日十二星座公共运势，包含整体主题、十二星座提醒、重点星座展开和娱乐性免责声明。",
    seoDescriptionEn:
      "Read today's public horoscope for the 12 zodiac signs with an overall theme and practical reflection prompts.",
    excerpt: "今日适合把注意力放回沟通节奏、关系边界和日常安排，不妨先观察再行动。",
    excerptEn:
      "Today is useful for slowing down communication, noticing boundaries, and choosing one practical next step.",
    bodyMarkdown: `# ${today} 十二星座今日运势\n\n## 今日整体主题\n\n今天适合整理沟通节奏、检查待办优先级，并在关系互动中保留更清晰的边界。\n\n## 今日适合做什么\n\n适合复盘近期计划、补齐沟通信息、把复杂任务拆成更小步骤。对情绪较敏感的人来说，可以先记录感受，再选择表达方式。\n\n## 十二星座今日提醒\n\n${zodiacSummaryMarkdown("今日")}\n\n## 重点星座\n\n白羊座、天秤座和双鱼座今日更适合关注表达方式。白羊座可以放慢回应速度，天秤座适合避免过度迎合，双鱼座适合把感受转化为具体请求。`,
    bodyMarkdownEn: `# ${today} Daily Horoscope for the 12 Zodiac Signs\n\n## Overall Theme\n\nToday is a good day to review communication pace, clarify priorities, and leave more room for boundaries in relationships.\n\n## What to Lean Into\n\nReview recent plans, fill in missing information, and break complex work into smaller steps. If emotions feel sensitive, write down what you feel before choosing how to express it.\n\n## Guidance for the 12 Zodiac Signs\n\n${zodiacSummaryMarkdownEn("today")}\n\n## Signs to Notice\n\nAries, Libra, and Pisces may benefit from clearer expression today. Aries can slow the response pace, Libra can avoid unnecessary accommodation, and Pisces can turn feelings into clearer requests.\n\nThis article is public zodiac content for entertainment and reflection, not medical, financial, legal, or major life decision advice.`,
    contentType: "daily_horoscope",
    articleCategory: "daily_horoscope",
    targetDate: new Date(`${today}T00:00:00+08:00`),
    canonicalPath: `/daily-horoscope/${today}`,
    indexable: true,
    status: "published",
    qualityScore: 90,
    riskLevel: "low",
    tags: ["十二星座", "今日运势", "星座运势"],
    tagsEn: ["12 Zodiac Signs", "Daily Horoscope", "Horoscope"],
    publishedAt: new Date(),
  },
  {
    id: "fallback-weekly",
    title: `${week.start} 至 ${week.end} 十二星座本周运势：边界、协作与复盘`,
    titleEn: `${week.start} to ${week.end} Weekly Horoscope for the 12 Zodiac Signs`,
    slug: `weekly-${week.key}`,
    seoTitle: `${week.start}至${week.end}十二星座本周运势`,
    seoTitleEn: `${week.start} to ${week.end} Weekly Horoscope`,
    seoDescription:
      "查看本周十二星座公共运势，包含整体主题、重点日期、十二星座分项提醒和轻量生活建议。",
    seoDescriptionEn:
      "Read this week's public horoscope for the 12 zodiac signs, including themes, timing notes, and gentle suggestions.",
    excerpt: "本周适合把关系协作与个人边界放在同一张清单里看，避免用情绪替代沟通。",
    excerptEn:
      "This week is useful for reviewing collaboration and personal boundaries without letting emotion replace communication.",
    bodyMarkdown: `# 本周十二星座运势\n\n## 本周整体主题\n\n本周重点放在关系协作、边界感和阶段复盘。没有具体星象数据时，文章不会编造行星换座、相位或逆行信息。\n\n## 本周重点日期\n\n建议在周初确认任务边界，周中处理沟通细节，周末复盘关系与工作节奏。\n\n## 十二星座本周运势\n\n${zodiacSummaryMarkdown("本周")}\n\n## 本周建议\n\n把“我应该立刻回应”改成“我需要先确认信息”，能减少很多不必要的误会。`,
    bodyMarkdownEn: `# Weekly Horoscope for the 12 Zodiac Signs\n\n## Overall Theme\n\nThis week centers on collaboration, boundaries, and review. When no concrete astrology data is provided, the article does not invent planetary ingresses, aspects, or retrogrades.\n\n## Timing Notes\n\nUse the start of the week to confirm task boundaries, the middle of the week to handle communication details, and the weekend to review relationships and work rhythm.\n\n## Guidance for the 12 Zodiac Signs\n\n${zodiacSummaryMarkdownEn("this week")}\n\n## Weekly Suggestion\n\nReplace "I should respond immediately" with "I need to confirm the information first." That single pause can reduce unnecessary misunderstanding.\n\nThis article is public zodiac content for entertainment and reflection, not medical, financial, legal, or major life decision advice.`,
    contentType: "weekly_horoscope",
    articleCategory: "weekly_horoscope",
    dateRangeStart: new Date(`${week.start}T00:00:00+08:00`),
    dateRangeEnd: new Date(`${week.end}T00:00:00+08:00`),
    canonicalPath: `/weekly-horoscope/${week.key}`,
    indexable: true,
    status: "published",
    qualityScore: 90,
    riskLevel: "low",
    tags: ["十二星座", "本周运势", "周运"],
    tagsEn: ["12 Zodiac Signs", "Weekly Horoscope", "Weekly"],
    publishedAt: new Date(),
  },
  {
    id: "fallback-monthly",
    title: `${month} 十二星座本月运势：长期节奏、选择与自我照顾`,
    titleEn: `${month} Monthly Horoscope for the 12 Zodiac Signs`,
    slug: `monthly-${month}`,
    seoTitle: `${month}十二星座本月运势：长期节奏与成长建议`,
    seoTitleEn: `${month} Monthly Horoscope for the 12 Zodiac Signs`,
    seoDescription:
      "查看本月十二星座公共运势，包含月度主题、重点阶段、十二星座趋势和娱乐性免责声明。",
    seoDescriptionEn:
      "Read this month's public horoscope for the 12 zodiac signs with monthly themes and gentle reflection prompts.",
    excerpt: "本月适合用更长期的眼光安排节奏，把目标、关系和自我照顾放在一起平衡。",
    excerptEn:
      "This month favors a longer view of rhythm, balancing goals, relationships, and self-care.",
    bodyMarkdown: `# ${month} 十二星座本月运势\n\n## 本月整体主题\n\n本月适合用作月度复盘和生活节奏参考。没有具体星象数据时，文章不会声称某个具体天象正在影响读者。\n\n## 本月重点阶段\n\n月初适合设定边界，月中适合推进协作，月末适合总结得失并调整节奏。\n\n## 十二星座月度趋势\n\n${zodiacSummaryMarkdown("本月")}\n\n## 本月建议\n\n长期计划不需要一次完成，适合每周保留一个小复盘节点，让选择更贴近真实状态。`,
    bodyMarkdownEn: `# ${month} Monthly Horoscope for the 12 Zodiac Signs\n\n## Overall Theme\n\nThis month works well as a monthly review and lifestyle rhythm reference. When no concrete astrology data is available, the article does not claim that a specific sky event is influencing readers.\n\n## Monthly Phases\n\nThe start of the month is useful for setting boundaries, the middle for moving collaboration forward, and the end for reviewing gains and losses before adjusting pace.\n\n## Guidance for the 12 Zodiac Signs\n\n${zodiacSummaryMarkdownEn("this month")}\n\n## Monthly Suggestion\n\nLong-term plans do not need to be completed at once. Keep one small review point each week so decisions stay closer to real conditions.\n\nThis article is public zodiac content for entertainment and reflection, not medical, financial, legal, or major life decision advice.`,
    contentType: "monthly_horoscope",
    articleCategory: "monthly_horoscope",
    dateRangeStart: new Date(`${month}-01T00:00:00+08:00`),
    canonicalPath: `/monthly-horoscope/${month}`,
    indexable: true,
    status: "published",
    qualityScore: 90,
    riskLevel: "low",
    tags: ["十二星座", "本月运势", "月运"],
    tagsEn: ["12 Zodiac Signs", "Monthly Horoscope", "Monthly"],
    publishedAt: new Date(),
  },
  {
    id: "fallback-calendar",
    title: "星象日历：如何温和理解公共星象主题",
    titleEn: "Astrology Calendar: A Gentle Guide to Public Astrology Themes",
    slug: "astrology-calendar-guide",
    seoTitle: "星象日历：公共星象主题与生活节奏参考",
    seoTitleEn: "Astrology Calendar: Public Astrology Themes and Daily Rhythm",
    seoDescription:
      "了解星象日历的使用方式，学习如何把公共星象主题作为情绪、沟通和行动节奏的参考。",
    seoDescriptionEn:
      "Learn how to read the astrology calendar as a public rhythm guide for communication, planning, and reflection.",
    excerpt: "星象日历用于解释公共主题，不用于恐吓式预测或个人命盘判断。",
    excerptEn:
      "The astrology calendar explains public themes without fear-based forecasts or personal birth-chart judgments.",
    bodyMarkdown: `# 星象日历\n\n星象日历用于整理公开星象事件，并解释它们可能对应的公共情绪、沟通、人际和行动节奏。\n\n## 阅读方式\n\n可以把星象日历视为观察节奏的工具。适合关注沟通是否顺畅、计划是否需要调整、关系是否需要边界。`,
    bodyMarkdownEn: `# Astrology Calendar\n\nThe astrology calendar organizes public astrology events and explains how they may correspond to collective themes around mood, communication, relationships, and action rhythm.\n\n## How to Read It\n\nUse the calendar as a rhythm-observation tool. It can help you notice whether communication feels clear, whether plans need adjustment, or whether relationships may benefit from clearer boundaries.\n\n## Safety Note\n\nThis page is for entertainment and reflection. It is not a personal birth-chart reading, a certainty-based forecast, or professional advice.`,
    contentType: "astrology_calendar",
    articleCategory: "astrology_guide",
    canonicalPath: "/astrology-calendar",
    indexable: true,
    status: "published",
    qualityScore: 88,
    riskLevel: "low",
    tags: ["星象日历", "星象解释"],
    tagsEn: ["Astrology Calendar", "Astrology Guide"],
    publishedAt: new Date(),
  },
];

export const fallbackSitePages: SitePageView[] = [
  {
    slug: "about",
    title: "关于我们",
    seoTitle: "关于我们 | 十二星座运势",
    seoDescription: "了解本站的公共星座内容定位，以及不做个人命盘、不采集隐私的原则。",
    bodyMarkdown:
      "本站专注十二星座公共运势、星象解释和星座百科内容。我们不要求用户输入出生时间、出生地点、姓名、职业或感情状态。\n\n内容仅作娱乐性参考，帮助读者温和地观察日常节奏。",
    indexable: true,
  },
  {
    slug: "contact",
    title: "联系我们",
    seoTitle: "联系我们 | 十二星座运势",
    seoDescription: "反馈内容、页面、版权或合作问题，可通过联系页面与本站沟通。",
    bodyMarkdown: "如需反馈内容错误、页面问题、版权问题或合作信息，请发送邮件至 contact@example.com。",
    indexable: true,
  },
  {
    slug: "privacy-policy",
    title: "隐私政策",
    seoTitle: "隐私政策 | 十二星座运势",
    seoDescription: "本站不收集出生信息或隐私画像，说明基础访问数据和 Cookie 使用原则。",
    bodyMarkdown:
      "本站不要求用户提交出生年月日、出生时间、出生地点、真实姓名、性别、年龄、职业、感情状态等隐私信息。",
    indexable: true,
  },
  {
    slug: "cookie-policy",
    title: "Cookie 政策",
    seoTitle: "Cookie 政策 | 十二星座运势",
    seoDescription: "说明本站可能使用 Cookie 支持基础功能、访问分析和未来广告服务。",
    bodyMarkdown:
      "本站可能使用必要 Cookie 支持基础功能。未来如接入访问分析或广告服务，相关服务可能使用 Cookie。",
    indexable: true,
  },
  {
    slug: "disclaimer",
    title: "免责声明",
    seoTitle: "免责声明 | 十二星座运势",
    seoDescription: "本站内容为公共星座运势与娱乐性参考，不构成专业建议。",
    bodyMarkdown:
      "本站内容为十二星座公共运势、星象解释和娱乐性参考，不构成医疗、投资、法律、婚恋或重大人生决策建议。",
    indexable: true,
  },
];
