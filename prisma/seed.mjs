import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

const zodiacSigns = [
  ["白羊座", "aries", "白羊座重视主动、速度和直接表达，适合把热情投入清晰目标。"],
  ["金牛座", "taurus", "金牛座重视安全感、节奏和积累，适合稳步推进长期计划。"],
  ["双子座", "gemini", "双子座重视信息、学习和交流，适合用好好奇心与表达力。"],
  ["巨蟹座", "cancer", "巨蟹座重视情绪、安全感和归属，适合整理生活与关系边界。"],
  ["狮子座", "leo", "狮子座重视创造、自信和认可，适合展示作品与稳定自我价值。"],
  ["处女座", "virgo", "处女座重视细节、效率和复盘，适合优化流程与健康习惯。"],
  ["天秤座", "libra", "天秤座重视合作、审美和关系平衡，适合练习清晰沟通。"],
  ["天蝎座", "scorpio", "天蝎座重视信任、洞察和转化，适合处理长期压抑的问题。"],
  ["射手座", "sagittarius", "射手座重视自由、学习和远方，适合打开视野但保留边界。"],
  ["摩羯座", "capricorn", "摩羯座重视目标、结构和长期主义，适合拆解任务稳步完成。"],
  ["水瓶座", "aquarius", "水瓶座重视独立、社群和新想法，适合更新方法与协作方式。"],
  ["双鱼座", "pisces", "双鱼座重视共情、想象和灵感，适合温柔表达并建立边界。"],
];

const sitePages = [
  {
    slug: "about",
    title: "关于我们",
    seoTitle: "关于我们 | 十二星座公共运势",
    seoDescription: "了解本站的内容定位：公共星座运势、星象解释与娱乐性参考，不提供个人命盘或重大决策建议。",
    bodyMarkdown:
      "本站专注十二星座公共运势、星象解释和星座百科内容。我们不收集出生时间、出生地点、真实姓名、职业、感情状态等隐私信息，也不提供个人命盘分析。\n\n所有内容以娱乐性参考和轻量生活建议为主，帮助读者用更温和的方式观察情绪、关系、沟通与日常节奏。",
  },
  {
    slug: "contact",
    title: "联系我们",
    seoTitle: "联系我们 | 十二星座公共运势",
    seoDescription: "如需反馈内容错误、版权问题或合作信息，可通过联系页面与我们取得联系。",
    bodyMarkdown:
      "如果你希望反馈内容错误、页面问题、版权问题或合作信息，请发送邮件至：contact@example.com。\n\n我们会优先处理涉及准确性、安全表达和用户体验的问题。",
  },
  {
    slug: "privacy-policy",
    title: "隐私政策",
    seoTitle: "隐私政策 | 十二星座公共运势",
    seoDescription: "本站不要求用户提交出生信息、真实姓名或个人隐私画像，说明基础访问数据与 Cookie 使用方式。",
    bodyMarkdown:
      "本站不要求用户提交出生年月日、出生时间、出生地点、真实姓名、性别、年龄、职业、感情状态等隐私信息。\n\n未来如接入统计或广告服务，仅用于了解页面访问表现和支持网站运营，并会遵守相应平台政策。",
  },
  {
    slug: "cookie-policy",
    title: "Cookie 政策",
    seoTitle: "Cookie 政策 | 十二星座公共运势",
    seoDescription: "说明本站可能使用 Cookie 的目的，包括基础功能、访问分析和未来广告服务。",
    bodyMarkdown:
      "本站可能使用必要 Cookie 支持基础功能。未来如接入访问分析或 Google AdSense，相关服务可能使用 Cookie 衡量访问效果和投放广告。\n\n你可以通过浏览器设置管理或清除 Cookie。",
  },
  {
    slug: "disclaimer",
    title: "免责声明",
    seoTitle: "免责声明 | 十二星座公共运势",
    seoDescription: "本站内容为十二星座公共运势与娱乐性参考，不构成医疗、投资、法律或重大人生决策建议。",
    bodyMarkdown:
      "本站内容为十二星座公共运势、星象解释和娱乐性参考，不构成医疗、投资、法律、婚恋或重大人生决策建议。\n\n请不要将本站内容作为确定性预测或唯一决策依据。遇到专业问题，应咨询具备资质的专业人士。",
  },
];

async function main() {
  await prisma.internalLink.createMany({
    data: zodiacSigns.map(([name, slug]) => ({
      anchor: `${name}性格分析`,
      url: `/zodiac/${slug}`,
      category: "zodiac_guide",
      priority: 10,
      isActive: true,
    })),
    skipDuplicates: true,
  });

  for (const [name, slug, summary] of zodiacSigns) {
    await prisma.article.upsert({
      where: { canonicalPath: `/zodiac/${slug}` },
      update: {},
      create: {
        title: `${name}百科：关系模式、生活节奏与成长建议`,
        slug: `zodiac-${slug}`,
        seoTitle: `${name}百科：性格特点、爱情事业与成长建议`,
        seoDescription: `系统了解${name}的性格特点、优势风险、爱情模式、事业风格、金钱观和成长建议。`,
        excerpt: summary,
        bodyMarkdown: `# ${name}百科\n\n${summary}\n\n## 星座概览\n\n下面内容围绕常见星座解读展开，适合轻松阅读，也可以作为日常复盘的参考。\n\n## 生活节奏\n\n${name}适合把注意力放回日常安排、关系边界和长期节奏。遇到选择时，可以先观察当下状态，再决定是否调整计划。\n\n## 爱情、事业与金钱观\n\n在关系中，${name}适合练习清晰表达；在事业中，适合找到稳定节奏；在金钱观上，建议保留弹性和长期规划。\n\n## 成长建议\n\n不妨把星座内容当作轻量参考，不要只凭一段星座内容做决定。本文为十二星座公共内容与娱乐性参考，不构成医疗、投资、法律或重大人生决策建议。`,
        contentType: "zodiac_guide",
        articleCategory: "zodiac_guide",
        canonicalPath: `/zodiac/${slug}`,
        indexable: true,
        status: "published",
        qualityScore: 90,
        riskLevel: "low",
        tags: ["十二星座", name, "星座百科"],
        publishedAt: new Date(),
      },
    });
  }

  for (const page of sitePages) {
    await prisma.sitePage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  await prisma.adSlot.createMany({
    data: [
      {
        key: "home_mid",
        label: "首页中段广告位",
        placement: "home",
        enabled: false,
        description: "AdSense 审核前默认关闭，避免首屏被广告占据。",
      },
      {
        key: "article_after_intro",
        label: "文章导语后广告位",
        placement: "article",
        enabled: false,
        description: "仅在正文内容足够长时开启，不伪装成内容。",
      },
      {
        key: "article_footer",
        label: "文章文末广告位",
        placement: "article",
        enabled: false,
        description: "文末弱干扰广告位，可在 AdSense 通过后启用。",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
