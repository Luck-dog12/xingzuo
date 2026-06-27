import type { Metadata } from "next";
import { BookOpen, Moon, Orbit, Sparkles, Sun } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { getPublishedArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "星象知识",
  description: "星象知识文章列表，解释公共星象主题、星象日历和生活节奏参考。",
};

export default async function AstrologyGuidePage() {
  const articles = await getPublishedArticles("astrology_guide", 12);
  const calendar = await getPublishedArticles("astrology_calendar", 3);
  const list = [...articles, ...calendar];

  return (
    <div>
      <section className="bg-[radial-gradient(circle_at_76%_18%,rgba(202,168,92,.22),transparent_30%),linear-gradient(135deg,#111629,#21152b_50%,#2a171d)] px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#d7b76d]">
            <BookOpen className="size-4" aria-hidden />
            Astrology Guide
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">星象知识</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/74">
            用更容易理解的方式解释月亮、行星、相位和月相，让运势文章里的星象依据不再只是术语。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {guideCards.map((card) => (
            <article key={card.title} className="rounded-md border border-[#d8c9b6] bg-[#fffaf2] p-6 shadow-sm">
              <card.icon className="mb-4 size-6 text-[#9a6a18]" aria-hidden />
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-700">{card.description}</p>
              <div className="mt-5 grid gap-2">
                {card.items.map((item) => (
                  <div key={item} className="rounded-md bg-white px-3 py-2 text-sm text-zinc-700">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">相关阅读</p>
            <h2 className="mt-2 text-3xl font-semibold">星象文章</h2>
          </div>
        </div>
        {list.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-[#d8c9b6] bg-white p-6 text-sm leading-7 text-zinc-700">
            相关星象文章正在整理中。后续会在这里展示新月、满月、行星换座和相位解释。
          </div>
        )}
      </section>
    </div>
  );
}

const guideCards = [
  {
    title: "月亮与日常节奏",
    description: "月亮常用于理解短周期情绪、习惯和安全感。日运文章里出现月亮主题时，可以先看它对应的是哪类日常状态。",
    icon: Moon,
    items: ["月亮换座：一两天内的情绪氛围变化", "满月：阶段结果、整理和释放", "新月：计划开始、愿望和新习惯"],
  },
  {
    title: "太阳、金星与火星",
    description: "不同星体对应不同生活主题。它们不是确定性预测，而是帮助读者理解文章的叙事重点。",
    icon: Sun,
    items: ["太阳：目标、能量和自我表达", "金星：关系、审美、消费与吸引力", "火星：行动方式、效率和冲突处理"],
  },
  {
    title: "行星相位怎么读",
    description: "相位描述的是两个主题之间的互动方式。阅读时可以把它理解成顺畅、压力、拉扯或协助。",
    icon: Orbit,
    items: ["合相：主题被强化", "拱相/六合：更容易获得协助", "刑相/冲相：需要调整或看见拉扯"],
  },
  {
    title: "星象日历的作用",
    description: "星象日历负责记录具体日期和事件，运势文章可以引用这些记录来解释当期主题。",
    icon: Sparkles,
    items: ["先看日期，再看事件类型", "有来源的星象才进入日历", "没有记录时不编造具体天象"],
  },
] as const;
