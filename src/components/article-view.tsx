import Link from "next/link";
import { ArrowLeft, Tags } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { LocalizedMarkdown, LocalizedText } from "@/components/localized-content";
import type { ArticleView } from "@/lib/types";

export function ArticleViewPage({ article, backHref }: { article: ArticleView; backHref: string }) {
  return (
    <div className="relative overflow-hidden bg-[#070b18]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,129,121,.34),transparent_28%),radial-gradient(circle_at_82%_6%,rgba(240,201,106,.18),transparent_24%),linear-gradient(135deg,#070b18_0%,#111833_48%,#1f1631_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(255,255,255,.72)_1px,transparent_1.5px)] [background-size:34px_34px]" />
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-[#f0c96a] hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          <LocalizedText zh="返回栏目" en="Back to section" />
        </Link>
        <article className="relative mt-6 overflow-hidden rounded-md border border-white/12 bg-[linear-gradient(145deg,rgba(10,18,39,.94),rgba(20,29,58,.92)_48%,rgba(33,24,49,.94))] p-6 shadow-[0_24px_90px_rgba(0,0,0,.34)] sm:p-9">
          <div className="pointer-events-none absolute right-8 top-8 size-28 rounded-full border border-[#f0c96a]/18" />
          <div className="pointer-events-none absolute right-20 top-20 size-1.5 rounded-full bg-white/70" />
          <div className="pointer-events-none absolute left-10 top-14 size-1 rounded-full bg-white/60" />
          <div className="pointer-events-none absolute bottom-12 right-1/4 size-1 rounded-full bg-[#f0c96a]/70" />
          <div className="relative mb-6 flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md border border-white/14 bg-white/8 px-2.5 py-1 text-xs font-medium text-[#f7e7b6]"
              >
                <Tags className="size-3" aria-hidden />
                <LocalizedText zh={tag} en={article.tagsEn?.[index]} />
              </span>
            ))}
          </div>
          <div className="relative">
            <LocalizedMarkdown zh={article.bodyMarkdown} en={article.bodyMarkdownEn} tone="dark" />
          </div>
        </article>
        <div className="mt-8">
          <AdSlot label="文章文末广告位" />
        </div>
      </div>
    </div>
  );
}
