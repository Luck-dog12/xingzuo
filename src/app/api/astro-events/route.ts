import { json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = getPrisma();
  if (!prisma) return json({ astro_events: [] });

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

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
