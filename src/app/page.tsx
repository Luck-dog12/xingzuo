import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { ZodiacAtlasCard } from "@/components/zodiac-atlas-card";
import { getLatestPublishedArticle, getPublishedArticles } from "@/lib/content";
import { zodiacSigns } from "@/lib/zodiac";

export default async function Home() {
  const [daily, weekly, monthly, recent] = await Promise.all([
    getLatestPublishedArticle("daily_horoscope"),
    getLatestPublishedArticle("weekly_horoscope"),
    getLatestPublishedArticle("monthly_horoscope"),
    getPublishedArticles(undefined, 6),
  ]);

  return (
    <div>
      <section className="star-field relative min-h-[76vh] border-b border-[#d8c9b6]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,44,42,0.04),rgba(248,244,238,0.18)_72%,#f8f4ee_100%)]" />
        <div className="relative mx-auto flex min-h-[76vh] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-normal text-[#f8f4ee] sm:text-7xl">
              十二星座公共运势
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#eadfcc]">
              围绕十二星座与星象知识，提供今日、本周、本月运势与长期百科内容。适合轻松阅读，也适合在日常节奏里做温和参考。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/daily-horoscope"
                className="inline-flex items-center gap-2 rounded-md bg-[#f8f4ee] px-5 py-3 text-sm font-semibold text-[#132c2a] shadow-sm transition hover:bg-white"
              >
                查看今日运势
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/zodiac"
                className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-[#f8f4ee] backdrop-blur transition hover:bg-white/18"
              >
                星座百科
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">运势入口</p>
            <h2 className="mt-2 text-3xl font-semibold">当前运势入口</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {daily && <ArticleCard article={daily} />}
          {weekly && <ArticleCard article={weekly} />}
          {monthly && <ArticleCard article={monthly} />}
        </div>
      </section>

      <section className="bg-[#eadfcc] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">十二星座图鉴</p>
              <h2 className="mt-2 text-3xl font-semibold">十二星座百科</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-700">
                每个星座都以黑底星图呈现，搭配专属符号和中英文星座名称。
              </p>
            </div>
            <Link href="/zodiac" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a8179] hover:underline">
              查看全部
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {zodiacSigns.map((sign) => (
              <ZodiacAtlasCard key={sign.slug} sign={sign} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="mb-6">
          <p className="eyebrow">最新内容</p>
          <h2 className="mt-2 text-3xl font-semibold">近期发布</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
