import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { LocalizedText } from "@/components/localized-content";
import type { ArticleView } from "@/lib/types";

export function ArticleCard({ article }: { article: ArticleView }) {
  const tone = toneForCategory(article.articleCategory);
  const categoryLabel = labelForCategory(article.articleCategory);
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null;

  return (
    <article className={`group relative overflow-hidden rounded-md border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${tone.shell}`}>
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-8 top-8 size-1 rounded-full bg-white/70" />
        <div className="absolute right-12 top-14 size-1.5 rounded-full bg-white/50" />
        <div className="absolute bottom-16 left-1/2 size-1 rounded-full bg-white/45" />
      </div>
      <div className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} />
      <div className="relative mb-4 flex items-center justify-between gap-3 text-xs font-semibold text-white/72">
        <span className="rounded-md border border-white/16 bg-white/8 px-2.5 py-1">
          <LocalizedText zh={categoryLabel.zh} en={categoryLabel.en} />
        </span>
        <ArrowUpRight className="size-4 opacity-0 transition group-hover:opacity-100" aria-hidden />
      </div>
      <h2 className="relative text-xl font-semibold leading-8 text-white">
        <Link href={article.canonicalPath}>
          <LocalizedText zh={article.title} en={article.titleEn} />
        </Link>
      </h2>
      <p className="relative mt-3 line-clamp-3 text-sm leading-7 text-white/74">
        <LocalizedText zh={article.excerpt} en={article.excerptEn} />
      </p>
      <div className="relative mt-5 flex items-center justify-between gap-4 border-t border-white/14 pt-4 text-xs text-white/58">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-4" aria-hidden />
          <LocalizedText
            zh={publishedDate ? publishedDate.toLocaleDateString("zh-CN") : "待发布"}
            en={publishedDate ? publishedDate.toLocaleDateString("en-US") : "Pending"}
          />
        </span>
        <Link href={article.canonicalPath} className="font-medium text-[#f0c96a] hover:underline">
          <LocalizedText zh="查看详情" en="Read more" />
        </Link>
      </div>
    </article>
  );
}

function toneForCategory(category: string) {
  const tones: Record<string, { shell: string; bar: string }> = {
    daily_horoscope: {
      shell:
        "border-[#2b5b62] bg-[radial-gradient(circle_at_82%_18%,rgba(99,214,202,.24),transparent_32%),linear-gradient(135deg,#071a24,#102f38_52%,#162a43)]",
      bar: "bg-[linear-gradient(90deg,#65d6ca,#d8b45f)]",
    },
    weekly_horoscope: {
      shell:
        "border-[#51447c] bg-[radial-gradient(circle_at_80%_16%,rgba(149,120,255,.26),transparent_32%),linear-gradient(135deg,#11132b,#251a48_52%,#3a2443)]",
      bar: "bg-[linear-gradient(90deg,#8c7cff,#d8b45f)]",
    },
    monthly_horoscope: {
      shell:
        "border-[#6c4f2a] bg-[radial-gradient(circle_at_82%_18%,rgba(216,180,95,.28),transparent_32%),linear-gradient(135deg,#17120c,#30220e_50%,#462318)]",
      bar: "bg-[linear-gradient(90deg,#d8b45f,#c05a45)]",
    },
    astrology_guide: {
      shell:
        "border-[#433563] bg-[radial-gradient(circle_at_82%_18%,rgba(205,166,255,.22),transparent_32%),linear-gradient(135deg,#0f1022,#21152b_52%,#2a1734)]",
      bar: "bg-[linear-gradient(90deg,#cda6ff,#d8b45f)]",
    },
  };

  return (
    tones[category] ?? {
      shell:
        "border-[#244d4a] bg-[radial-gradient(circle_at_82%_18%,rgba(10,129,121,.24),transparent_32%),linear-gradient(135deg,#071b1a,#132c2a_52%,#211c18)]",
      bar: "bg-[linear-gradient(90deg,#0a8179,#d8b45f)]",
    }
  );
}

function labelForCategory(category: string) {
  const labels: Record<string, { zh: string; en: string }> = {
    daily_horoscope: { zh: "今日运势", en: "Daily" },
    weekly_horoscope: { zh: "本周运势", en: "Weekly" },
    monthly_horoscope: { zh: "本月运势", en: "Monthly" },
    zodiac_guide: { zh: "星座百科", en: "Zodiac Guide" },
    astrology_guide: { zh: "星象知识", en: "Astrology Guide" },
  };

  return labels[category] ?? { zh: category.replaceAll("_", " "), en: category.replaceAll("_", " ") };
}
