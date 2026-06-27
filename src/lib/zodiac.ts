export type ZodiacSign = {
  name: string;
  shortName: string;
  englishName: string;
  slug: string;
  glyph: string;
  element: string;
  dateRange: string;
  summary: string;
  strengths: string[];
  cautions: string[];
};

export const zodiacSigns: ZodiacSign[] = [
  {
    name: "白羊座",
    shortName: "白羊",
    englishName: "Aries",
    slug: "aries",
    glyph: "♈",
    element: "火象",
    dateRange: "3月21日 - 4月19日",
    summary: "白羊座重视主动、速度和直接表达，适合把热情投入清晰目标。",
    strengths: ["行动力", "开创精神", "直接坦率"],
    cautions: ["冲动", "急躁", "容易忽略细节"],
  },
  {
    name: "金牛座",
    shortName: "金牛",
    englishName: "Taurus",
    slug: "taurus",
    glyph: "♉",
    element: "土象",
    dateRange: "4月20日 - 5月20日",
    summary: "金牛座重视安全感、节奏和积累，适合稳步推进长期计划。",
    strengths: ["耐心", "审美", "稳定执行"],
    cautions: ["固执", "拖延", "抗拒变化"],
  },
  {
    name: "双子座",
    shortName: "双子",
    englishName: "Gemini",
    slug: "gemini",
    glyph: "♊",
    element: "风象",
    dateRange: "5月21日 - 6月21日",
    summary: "双子座重视信息、学习和交流，适合用好好奇心与表达力。",
    strengths: ["学习力", "表达力", "适应力"],
    cautions: ["分心", "信息过载", "想太多"],
  },
  {
    name: "巨蟹座",
    shortName: "巨蟹",
    englishName: "Cancer",
    slug: "cancer",
    glyph: "♋",
    element: "水象",
    dateRange: "6月22日 - 7月22日",
    summary: "巨蟹座重视情绪、安全感和归属，适合整理生活与关系边界。",
    strengths: ["共情", "照顾力", "记忆力"],
    cautions: ["敏感", "情绪化", "边界不清"],
  },
  {
    name: "狮子座",
    shortName: "狮子",
    englishName: "Leo",
    slug: "leo",
    glyph: "♌",
    element: "火象",
    dateRange: "7月23日 - 8月22日",
    summary: "狮子座重视创造、自信和认可，适合展示作品与稳定自我价值。",
    strengths: ["创造力", "领导感", "感染力"],
    cautions: ["逞强", "面子压力", "过度戏剧化"],
  },
  {
    name: "处女座",
    shortName: "处女",
    englishName: "Virgo",
    slug: "virgo",
    glyph: "♍",
    element: "土象",
    dateRange: "8月23日 - 9月22日",
    summary: "处女座重视细节、效率和复盘，适合优化流程与健康习惯。",
    strengths: ["分析力", "执行细节", "服务意识"],
    cautions: ["焦虑", "过度挑剔", "完美主义"],
  },
  {
    name: "天秤座",
    shortName: "天秤",
    englishName: "Libra",
    slug: "libra",
    glyph: "♎",
    element: "风象",
    dateRange: "9月23日 - 10月23日",
    summary: "天秤座重视合作、审美和关系平衡，适合练习清晰沟通。",
    strengths: ["协调", "审美", "公平感"],
    cautions: ["犹豫", "讨好", "回避冲突"],
  },
  {
    name: "天蝎座",
    shortName: "天蝎",
    englishName: "Scorpio",
    slug: "scorpio",
    glyph: "♏",
    element: "水象",
    dateRange: "10月24日 - 11月22日",
    summary: "天蝎座重视信任、洞察和转化，适合处理长期压抑的问题。",
    strengths: ["洞察", "专注", "韧性"],
    cautions: ["多疑", "控制感", "情绪压抑"],
  },
  {
    name: "射手座",
    shortName: "射手",
    englishName: "Sagittarius",
    slug: "sagittarius",
    glyph: "♐",
    element: "火象",
    dateRange: "11月23日 - 12月21日",
    summary: "射手座重视自由、学习和远方，适合打开视野但保留边界。",
    strengths: ["乐观", "探索", "学习热情"],
    cautions: ["粗心", "说话过满", "不耐烦"],
  },
  {
    name: "摩羯座",
    shortName: "摩羯",
    englishName: "Capricorn",
    slug: "capricorn",
    glyph: "♑",
    element: "土象",
    dateRange: "12月22日 - 1月19日",
    summary: "摩羯座重视目标、结构和长期主义，适合拆解任务稳步完成。",
    strengths: ["责任感", "耐力", "现实规划"],
    cautions: ["压力", "紧绷", "过度自我要求"],
  },
  {
    name: "水瓶座",
    shortName: "水瓶",
    englishName: "Aquarius",
    slug: "aquarius",
    glyph: "♒",
    element: "风象",
    dateRange: "1月20日 - 2月18日",
    summary: "水瓶座重视独立、社群和新想法，适合更新方法与协作方式。",
    strengths: ["创新", "理性", "社群意识"],
    cautions: ["疏离", "过度冷静", "忽略感受"],
  },
  {
    name: "双鱼座",
    shortName: "双鱼",
    englishName: "Pisces",
    slug: "pisces",
    glyph: "♓",
    element: "水象",
    dateRange: "2月19日 - 3月20日",
    summary: "双鱼座重视共情、想象和灵感，适合温柔表达并建立边界。",
    strengths: ["共情", "想象力", "艺术感"],
    cautions: ["逃避", "边界感弱", "过度理想化"],
  },
];

export function getZodiacBySlug(slug: string) {
  return zodiacSigns.find((sign) => sign.slug === slug);
}

export function getZodiacByName(name: string) {
  return zodiacSigns.find((sign) => sign.name === name);
}

export const zodiacNames = zodiacSigns.map((sign) => sign.name);
