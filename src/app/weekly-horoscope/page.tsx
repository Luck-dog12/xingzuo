import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { ArticleViewPage } from "@/components/article-view";
import { getLatestPublishedArticle, getPublishedArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "本周十二星座运势",
  description: "本周十二星座公共运势总页，包含周主题、重点日期和十二星座分项建议。",
};

export default async function WeeklyHoroscopePage() {
  const [latest, archives] = await Promise.all([
    getLatestPublishedArticle("weekly_horoscope"),
    getPublishedArticles("weekly_horoscope", 12),
  ]);

  if (!latest) return null;

  return (
    <div>
      <ArticleViewPage article={latest} backHref="/" />
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="mb-5 text-2xl font-semibold">周运归档</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {archives.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
