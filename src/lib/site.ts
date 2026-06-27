export const siteConfig = {
  name: "十二星座运势",
  description:
    "提供十二星座公共运势、星象解释和星座百科的中文内容站，适合日常阅读与节奏参考。",
  baseUrl: process.env.SITE_BASE_URL ?? "http://localhost:3000",
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
};

export const navItems = [
  { href: "/daily-horoscope", label: "今日运势" },
  { href: "/weekly-horoscope", label: "本周运势" },
  { href: "/monthly-horoscope", label: "本月运势" },
  { href: "/zodiac", label: "星座百科" },
  { href: "/astrology-calendar", label: "星象日历" },
  { href: "/astrology-guide", label: "星象知识" },
];

export const footerItems = [
  { href: "/about", label: "关于我们" },
  { href: "/contact", label: "联系我们" },
  { href: "/privacy-policy", label: "隐私政策" },
  { href: "/cookie-policy", label: "Cookie 政策" },
  { href: "/disclaimer", label: "免责声明" },
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.baseUrl).toString();
}
