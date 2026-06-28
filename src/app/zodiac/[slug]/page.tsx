import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ZodiacConstellation } from "@/components/zodiac-atlas-card";
import { MarkdownContent } from "@/lib/markdown";
import { getZodiacBySlug } from "@/lib/zodiac";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sign = getZodiacBySlug(slug);
  return {
    title: sign ? `${sign.name}百科` : "星座百科",
    description: sign?.summary ?? "十二星座百科页面。",
  };
}

export default async function ZodiacDetailPage({ params }: Props) {
  const { slug } = await params;
  const sign = getZodiacBySlug(slug);
  if (!sign) notFound();

  const markdown = `# ${sign.name}百科

${sign.summary}

## 基本信息

- 日期范围：${sign.dateRange}
- 元素：${sign.element}

## 星座概览

${sign.summary}

下面内容围绕常见星座解读展开，适合轻松阅读，也可以作为日常复盘的参考。

## 生活节奏

${sign.name}适合把注意力放回日常安排、关系边界和长期节奏。遇到选择时，可以先观察当下状态，再决定是否调整计划。

## 需要留意

面对压力、关系分歧或工作变化时，更建议回到事实、沟通和可执行步骤，不要只凭一段星座内容做决定。

## 关系模式

在亲密关系中，${sign.name}适合练习把真实需求说清楚。星座内容可以提供一个阅读角度，但不能替代关系中的具体沟通。

## 事业风格

${sign.name}适合把自身节奏转化为可执行的工作方法。建议关注节奏、边界和复盘，而不是追求一次性解决所有问题。

## 金钱观

金钱议题更适合结合预算、真实需求和长期目标来看。本站不提供投资建议，也不会鼓励任何确定性财务决策。

## 人际关系

适合观察自己在合作、表达和倾听中的习惯。必要时可以先暂停，再回应。

## 成长建议

把星座内容当作轻量复盘工具，不妨每周选择一个小行动来调整状态。

本文为十二星座公共内容与娱乐性参考，不构成医疗、投资、法律或重大人生决策建议。`;

  return (
    <div className="relative overflow-hidden bg-[#070b18]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(16,129,121,.3),transparent_26%),radial-gradient(circle_at_82%_12%,rgba(240,201,106,.16),transparent_24%),linear-gradient(135deg,#070b18_0%,#121936_50%,#24182f_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle,rgba(255,255,255,.72)_1px,transparent_1.5px)] [background-size:34px_34px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/zodiac" className="inline-flex items-center gap-2 text-sm font-medium text-[#f0c96a] hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          返回十二星座百科
        </Link>
        <div className="mt-6 space-y-6">
          <section className="overflow-hidden rounded-md border border-white/12 bg-[#090d1d] shadow-[0_24px_90px_rgba(0,0,0,.34)]">
            <ZodiacConstellation sign={sign} className="aspect-[16/9] min-h-[320px] sm:aspect-[21/9] lg:min-h-[420px]" />
            <div className="grid gap-4 border-t border-white/12 bg-[linear-gradient(135deg,rgba(10,18,39,.96),rgba(20,29,58,.94))] p-5 text-white sm:grid-cols-3 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#f0c96a]">Date Range</p>
                <p className="mt-2 text-lg font-semibold">{sign.dateRange}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#f0c96a]">Element</p>
                <p className="mt-2 text-lg font-semibold">{sign.element}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#f0c96a]">Profile</p>
                <p className="mt-2 text-lg font-semibold">
                  {sign.englishName} / {sign.shortName}
                </p>
              </div>
            </div>
          </section>

          <article className="relative overflow-hidden rounded-md border border-white/12 bg-[linear-gradient(145deg,rgba(10,18,39,.94),rgba(20,29,58,.92)_48%,rgba(33,24,49,.94))] px-5 py-7 shadow-[0_24px_90px_rgba(0,0,0,.34)] sm:px-8 sm:py-9 lg:px-12">
            <div className="pointer-events-none absolute right-8 top-8 size-28 rounded-full border border-[#f0c96a]/18" />
            <div className="pointer-events-none absolute right-20 top-20 size-1.5 rounded-full bg-white/70" />
            <div className="pointer-events-none absolute left-10 top-14 size-1 rounded-full bg-white/60" />
            <div className="relative mx-auto max-w-4xl">
              <MarkdownContent content={markdown} tone="dark" />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
