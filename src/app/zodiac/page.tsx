import type { Metadata } from "next";
import { ZodiacAtlasCard } from "@/components/zodiac-atlas-card";
import { zodiacSigns } from "@/lib/zodiac";

export const metadata: Metadata = {
  title: "十二星座百科",
  description: "十二星座百科总页，整理每个星座的日期、元素、关系模式和成长建议。",
};

export default function ZodiacPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-teal-800">长期内容资产</p>
        <h1 className="mt-2 text-4xl font-semibold">十二星座百科</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-700">
          用黑底星图进入每个星座页面，阅读日期范围、元素属性、关系模式和成长建议。
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {zodiacSigns.map((sign) => (
          <ZodiacAtlasCard key={sign.slug} sign={sign} />
        ))}
      </div>
    </div>
  );
}
