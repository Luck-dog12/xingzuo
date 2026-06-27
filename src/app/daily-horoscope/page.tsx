import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { ArticleViewPage } from "@/components/article-view";
import { getLatestPublishedArticle, getPublishedArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "今日十二星座运势",
  description: "今日十二星座公共运势总页，提供整体主题、十二星座提醒和娱乐性参考建议。",
};

export default async function DailyHoroscopePage() {
  const [latest, archives] = await Promise.all([
    getLatestPublishedArticle("daily_horoscope"),
    getPublishedArticles("daily_horoscope", 12),
  ]);

  if (!latest) {
    return <EmptyColumn title="今日运势正在准备中" />;
  }

  return (
    <div>
      <ArticleViewPage article={latest} backHref="/" />
      <ArchiveGrid title="日运归档" articles={archives} />
    </div>
  );
}

function ArchiveGrid({ title, articles }: { title: string; articles: Awaited<ReturnType<typeof getPublishedArticles>> }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

function EmptyColumn({ title }: { title: string }) {
  return <div className="mx-auto max-w-4xl px-4 py-16 text-2xl font-semibold sm:px-6">{title}</div>;
}
