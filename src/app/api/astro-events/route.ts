import { calculateAstroEventCandidates } from "@/lib/astro-event-importer";
import { getMonthKey } from "@/lib/dates";
import { json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = getPrisma();
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!prisma) {
    const month = getMonthKey();
    const fallbackStart = start ?? `${month}-01`;
    const fallbackEnd = end ?? endOfMonth(month);
    const events = calculateAstroEventCandidates(fallbackStart, fallbackEnd).map((event) => ({
      id: event.eventKey,
      eventKey: event.eventKey,
      date: event.date,
      eventType: event.eventType,
      planet1: event.planet1,
      planet2: event.planet2,
      sign: event.sign,
      aspect: event.aspect,
      description: event.description,
      source: event.source,
      status: "approved",
    }));
    return json({ astro_events: events });
  }

  const events = await prisma.astroEvent.findMany({
    where:
      start && end
        ? {
            status: "approved",
            date: {
              gte: new Date(`${start}T00:00:00+08:00`),
              lte: new Date(`${end}T00:00:00+08:00`),
            },
          }
        : { status: "approved" },
    orderBy: { date: "asc" },
  });

  return json({ astro_events: events });
}

function endOfMonth(monthKey: string) {
  const date = new Date(`${monthKey}-01T00:00:00+08:00`);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
