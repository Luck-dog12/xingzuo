import type { Metadata } from "next";
import { CalendarDays, Moon, Orbit, Sparkles } from "lucide-react";
import { calculateAstroEventCandidates } from "@/lib/astro-event-importer";
import { getMonthKey } from "@/lib/dates";
import { getPrisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "星象日历",
  description: "按月份查看已收录的公开星象事件、日期和简要解释。",
};

type CalendarEvent = {
  id: string;
  date: Date;
  eventType: string;
  description: string;
  planet1?: string | null;
  planet2?: string | null;
  sign?: string | null;
  aspect?: string | null;
};

type CalendarDay = {
  key: string;
  label: number;
  inMonth: boolean;
};

export default async function AstrologyCalendarPage() {
  const monthKey = getMonthKey();
  const days = getCalendarDays(monthKey);
  const events = await getMonthEvents(monthKey);
  const eventsByDate = groupEventsByDate(events);

  return (
    <div>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_72%_12%,rgba(202,168,92,.24),transparent_30%),linear-gradient(135deg,#090b18,#111a32_46%,#21152b)] px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#d7b76d]">
            <Moon className="size-4" aria-hidden />
            {monthKey.replace("-", "年")}月
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">星象日历</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
            这里按日期展示已收录的公开星象事件，适合在阅读日运、周运和月运前先了解当期节奏。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-md border border-[#d8c9b6] bg-[#fffaf2] shadow-sm">
          <div className="grid grid-cols-7 border-b border-[#e6d8c4] bg-[#f0e2c9] text-center text-xs font-semibold text-[#5e4a2a]">
            {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
              <div key={day} className="py-3">
                周{day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div
                key={day.key}
                className={`min-h-28 border-b border-r border-[#eadfce] p-2 ${
                  day.inMonth ? "bg-[#fffaf2]" : "bg-[#f3eadc] text-zinc-400"
                }`}
              >
                <div className="text-sm font-semibold">{day.label}</div>
                <div className="mt-2 grid gap-1">
                  {(eventsByDate[day.key] ?? []).slice(0, 2).map((event) => (
                    <div key={event.id} className="rounded-md bg-[#161a31] px-2 py-1 text-[11px] leading-4 text-white">
                      {event.eventType}
                    </div>
                  ))}
                  {day.inMonth && !eventsByDate[day.key]?.length && (
                    <span className="text-[11px] text-zinc-400">暂无收录</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-[#d8c9b6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <CalendarDays className="size-5 text-[#9a6a18]" aria-hidden />
              本月星象记录
            </div>
            {events.length > 0 ? (
              <div className="grid gap-4">
                {events.map((event) => (
                  <div key={event.id} className="border-l-2 border-[#c18221] pl-3">
                    <p className="text-sm font-semibold">{formatDate(event.date)} · {event.eventType}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-700">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-7 text-zinc-700">
                本月暂未收录具体星象事件。录入后，这里会按日期展示事件名称和说明。
              </p>
            )}
          </div>

          <div className="rounded-md border border-[#d8c9b6] bg-[#211c18] p-5 text-[#f8f4ee] shadow-sm">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Orbit className="size-5 text-[#d7b76d]" aria-hidden />
              日历怎么读
            </div>
            <div className="grid gap-3 text-sm leading-7 text-[#e6d9c4]">
              <p>有具体事件时，日期格会显示星象名称。</p>
              <p>没有收录事件的日期会保持为空白状态，不编造行星换座、相位或逆行。</p>
              <p>阅读运势文章时，可以用这里的记录理解当期主题。</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["月亮换座", "常用于观察一两天内的情绪氛围与日常安排。"],
            ["新月与满月", "适合对应开始、整理、阶段结果和情绪释放。"],
            ["行星相位", "用于描述主题之间的顺畅、压力、拉扯或协助。"],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-[#d8c9b6] bg-white p-5 shadow-sm">
              <Sparkles className="mb-3 size-5 text-[#c18221]" aria-hidden />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-700">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

async function getMonthEvents(monthKey: string): Promise<CalendarEvent[]> {
  const prisma = getPrisma();

  const start = new Date(`${monthKey}-01T00:00:00+08:00`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);

  if (!prisma) {
    return calculateAstroEventCandidates(`${monthKey}-01`, toKey(end)).map((event) => ({
      id: event.eventKey,
      date: event.date,
      eventType: event.eventType,
      description: event.description,
      planet1: event.planet1,
      planet2: event.planet2,
      sign: event.sign,
      aspect: event.aspect,
    }));
  }

  return prisma.astroEvent.findMany({
    where: { status: "approved", date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });
}

function getCalendarDays(monthKey: string) {
  const start = new Date(`${monthKey}-01T00:00:00+08:00`);
  const year = start.getFullYear();
  const month = start.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (start.getDay() + 6) % 7;
  const cells: CalendarDay[] = [];

  for (let index = 0; index < leading; index += 1) {
    const date = new Date(year, month, 1 - leading + index);
    cells.push({ key: toKey(date), label: date.getDate(), inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({ key: toKey(date), label: day, inMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const last = new Date(`${cells[cells.length - 1].key}T00:00:00+08:00`);
    last.setDate(last.getDate() + 1);
    cells.push({ key: toKey(last), label: last.getDate(), inMonth: false });
  }

  return cells;
}

function groupEventsByDate(events: CalendarEvent[]) {
  return events.reduce<Record<string, CalendarEvent[]>>((result, event) => {
    const key = toKey(event.date);
    result[key] = [...(result[key] ?? []), event];
    return result;
  }, {});
}

function toKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "long",
    day: "numeric",
  }).format(date);
}
