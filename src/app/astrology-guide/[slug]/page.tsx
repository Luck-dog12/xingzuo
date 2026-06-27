import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleViewPage } from "@/components/article-view";
import { getArticleBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return {
    title: article?.seoTitle ?? "星象知识",
    description: article?.seoDescription ?? "星象知识文章。",
    robots: { index: Boolean(article?.indexable), follow: true },
  };
}

export default async function AstrologyGuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleViewPage article={article} backHref="/astrology-guide" />;
}
