import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleViewPage } from "@/components/article-view";
import { getArticleByCanonicalPath } from "@/lib/content";

type Props = { params: Promise<{ month: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { month } = await params;
  const article = await getArticleByCanonicalPath(`/monthly-horoscope/${month}`);
  return {
    title: article?.seoTitle ?? "月运归档",
    description: article?.seoDescription ?? "十二星座月运归档页面。",
    robots: { index: Boolean(article?.indexable), follow: true },
  };
}

export default async function MonthlyArchivePage({ params }: Props) {
  const { month } = await params;
  const article = await getArticleByCanonicalPath(`/monthly-horoscope/${month}`);
  if (!article) notFound();
  return <ArticleViewPage article={article} backHref="/monthly-horoscope" />;
}
