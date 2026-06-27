import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleViewPage } from "@/components/article-view";
import { getArticleByCanonicalPath } from "@/lib/content";

type Props = { params: Promise<{ week: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params;
  const article = await getArticleByCanonicalPath(`/weekly-horoscope/${week}`);
  return {
    title: article?.seoTitle ?? "周运归档",
    description: article?.seoDescription ?? "十二星座周运归档页面。",
    robots: { index: Boolean(article?.indexable), follow: true },
  };
}

export default async function WeeklyArchivePage({ params }: Props) {
  const { week } = await params;
  const article = await getArticleByCanonicalPath(`/weekly-horoscope/${week}`);
  if (!article) notFound();
  return <ArticleViewPage article={article} backHref="/weekly-horoscope" />;
}
