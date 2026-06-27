import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleViewPage } from "@/components/article-view";
import { getArticleByCanonicalPath } from "@/lib/content";

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const article = await getArticleByCanonicalPath(`/daily-horoscope/${date}`);
  return {
    title: article?.seoTitle ?? "日运归档",
    description: article?.seoDescription ?? "十二星座日运归档页面。",
    robots: {
      index: Boolean(article?.indexable),
      follow: true,
    },
  };
}

export default async function DailyArchivePage({ params }: Props) {
  const { date } = await params;
  const article = await getArticleByCanonicalPath(`/daily-horoscope/${date}`);
  if (!article) notFound();

  return <ArticleViewPage article={article} backHref="/daily-horoscope" />;
}
