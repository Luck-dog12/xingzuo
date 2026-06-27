import * as Astronomy from "astronomy-engine";
import { revalidatePath } from "next/cache";
import { getRequiredPrisma } from "@/lib/prisma";

type Candidate = {
  eventKey: string;
  date: Date;
  eventType: string;
  planet1?: string | null;
  planet2?: string | null;
  sign?: string | null;
  aspect?: string | null;
  description: string;
  source: string;
};

type ImportSummary = {
  generated: number;
  created: number;
  updated: number;
  approved: number;
  range: {
    start: string;
    end: string;
  };
};

type ImportOptions = {
  autoApprove?: boolean;
  reviewedBy?: string;
};

const source = "astronomy-engine@2.1.19";
const dayMs = 24 * 60 * 60 * 1000;

const zodiacSigns = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
] as const;

const planetBodies = [
  { body: Astronomy.Body.Mercury, name: "水星" },
  { body: Astronomy.Body.Venus, name: "金星" },
  { body: Astronomy.Body.Mars, name: "火星" },
  { body: Astronomy.Body.Jupiter, name: "木星" },
  { body: Astronomy.Body.Saturn, name: "土星" },
] as const;

const moonQuarterNames = ["新月", "上弦月", "满月", "下弦月"] as const;

export async function importAstroEventsForRange(
  startKey: string,
  endKey: string,
  options: ImportOptions = {},
): Promise<ImportSummary> {
  const prisma = getRequiredPrisma();
  const candidates = calculateAstroEventCandidates(startKey, endKey);
  let created = 0;
  let updated = 0;
  let approved = 0;

  for (const candidate of candidates) {
    const existing = await prisma.astroEvent.findUnique({ where: { eventKey: candidate.eventKey } });
    const shouldAutoApprove = Boolean(options.autoApprove && existing?.status !== "rejected");
    const reviewData = shouldAutoApprove
      ? {
          status: "approved" as const,
          reviewedAt: new Date(),
          reviewedBy: options.reviewedBy ?? "system",
        }
      : {};

    await prisma.astroEvent.upsert({
      where: { eventKey: candidate.eventKey },
      update: {
        date: candidate.date,
        eventType: candidate.eventType,
        planet1: candidate.planet1 ?? null,
        planet2: candidate.planet2 ?? null,
        sign: candidate.sign ?? null,
        aspect: candidate.aspect ?? null,
        description: candidate.description,
        source: candidate.source,
        ...reviewData,
      },
      create: {
        ...candidate,
        status: options.autoApprove ? "approved" : "pending",
        reviewedAt: options.autoApprove ? new Date() : null,
        reviewedBy: options.autoApprove ? (options.reviewedBy ?? "system") : null,
      },
    });

    if (options.autoApprove && existing?.status !== "rejected") {
      approved += 1;
    }
    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  revalidatePath("/admin/astro-events");
  revalidatePath("/astrology-calendar");

  return {
    generated: candidates.length,
    created,
    updated,
    approved,
    range: { start: startKey, end: endKey },
  };
}

export function calculateAstroEventCandidates(startKey: string, endKey: string): Candidate[] {
  const start = fromShanghaiDate(startKey);
  const endExclusive = new Date(fromShanghaiDate(endKey).getTime() + dayMs);
  const candidates = [
    ...calculateMoonQuarters(start, endExclusive),
    ...calculateSunIngresses(start, endExclusive),
    ...calculatePlanetIngresses(start, endExclusive),
  ];

  return candidates
    .filter((candidate) => candidate.date >= fromShanghaiDate(startKey) && candidate.date < endExclusive)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.eventType.localeCompare(b.eventType, "zh-CN"));
}

function calculateMoonQuarters(start: Date, endExclusive: Date): Candidate[] {
  const candidates: Candidate[] = [];
  let quarter = Astronomy.SearchMoonQuarter(new Date(start.getTime() - 2 * dayMs));

  while (quarter.time.date < endExclusive) {
    const exact = quarter.time.date;
    if (exact >= start && exact < endExclusive) {
      const name = moonQuarterNames[quarter.quarter] ?? "月相";
      const dateKey = toShanghaiDateKey(exact);
      candidates.push({
        eventKey: `moon-quarter:${quarter.quarter}:${dateKey}:${exact.toISOString().slice(0, 16)}`,
        date: fromShanghaiDate(dateKey),
        eventType: name,
        planet1: "月亮",
        aspect: "月相",
        description: `${name}发生在北京时间 ${formatShanghaiTime(exact)} 左右，适合记录阶段主题和日常节奏。`,
        source,
      });
    }
    quarter = Astronomy.NextMoonQuarter(quarter);
  }

  return candidates;
}

function calculateSunIngresses(start: Date, endExclusive: Date): Candidate[] {
  const candidates: Candidate[] = [];
  const searchStart = new Date(start.getTime() - 36 * dayMs);
  const limitDays = Math.ceil((endExclusive.getTime() - searchStart.getTime()) / dayMs) + 36;

  zodiacSigns.forEach((sign, index) => {
    const time = Astronomy.SearchSunLongitude(index * 30, searchStart, limitDays);
    if (!time || time.date < start || time.date >= endExclusive) return;

    const dateKey = toShanghaiDateKey(time.date);
    candidates.push({
      eventKey: `sun-ingress:${sign}:${dateKey}`,
      date: fromShanghaiDate(dateKey),
      eventType: `太阳进入${sign}`,
      planet1: "太阳",
      sign,
      aspect: "换座",
      description: `太阳进入${sign}，精确时间约为北京时间 ${formatShanghaiTime(time.date)}。这是太阳黄经进入该星座区间的记录。`,
      source,
    });
  });

  return candidates;
}

function calculatePlanetIngresses(start: Date, endExclusive: Date): Candidate[] {
  const candidates: Candidate[] = [];
  const stepHours = 6;

  for (const planet of planetBodies) {
    let previous = new Date(start.getTime() - dayMs);
    let previousSign = signIndexForBody(planet.body, previous);

    for (let current = addHours(previous, stepHours); current <= endExclusive; current = addHours(current, stepHours)) {
      const currentSign = signIndexForBody(planet.body, current);
      if (currentSign !== previousSign) {
        const exact = refineIngressTime(planet.body, previous, current, previousSign);
        if (exact >= start && exact < endExclusive) {
          const sign = zodiacSigns[currentSign];
          const dateKey = toShanghaiDateKey(exact);
          candidates.push({
            eventKey: `planet-ingress:${planet.name}:${sign}:${dateKey}:${exact.toISOString().slice(0, 13)}`,
            date: fromShanghaiDate(dateKey),
            eventType: `${planet.name}进入${sign}`,
            planet1: planet.name,
            sign,
            aspect: "换座",
            description: `${planet.name}进入${sign}，精确时间约为北京时间 ${formatShanghaiTime(exact)}。该记录来自地心黄经所在星座区间变化。`,
            source,
          });
        }
      }

      previous = current;
      previousSign = currentSign;
    }
  }

  return candidates;
}

function refineIngressTime(body: Astronomy.Body, start: Date, end: Date, startSign: number) {
  let low = start;
  let high = end;

  for (let index = 0; index < 28; index += 1) {
    const mid = new Date((low.getTime() + high.getTime()) / 2);
    if (signIndexForBody(body, mid) === startSign) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return high;
}

function signIndexForBody(body: Astronomy.Body, date: Date) {
  const longitude =
    body === Astronomy.Body.Sun
      ? Astronomy.SunPosition(date).elon
      : Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
  return Math.floor(normalizeDegrees(longitude) / 30) % 12;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function fromShanghaiDate(key: string) {
  return new Date(`${key}T00:00:00+08:00`);
}

function toShanghaiDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatShanghaiTime(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
