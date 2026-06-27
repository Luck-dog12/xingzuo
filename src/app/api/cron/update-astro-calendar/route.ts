import { runGenerationWorkflow } from "@/lib/agent/workflow";
import { importAstroEventsForRange } from "@/lib/astro-event-importer";
import { getMonthKey } from "@/lib/dates";
import { json, verifyCronRequest } from "@/lib/http";

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
  const month = getMonthKey();
  const nextMonth = addMonths(month, 1);
  const imports = [
    await importAstroEventsForRange(`${month}-01`, endOfMonth(month), {
      autoApprove: true,
      reviewedBy: "vercel-cron",
    }),
    await importAstroEventsForRange(`${nextMonth}-01`, endOfMonth(nextMonth), {
      autoApprove: true,
      reviewedBy: "vercel-cron",
    }),
  ];
  const result = await runGenerationWorkflow("astrology_calendar");
  return json({ imports, result });
}

function addMonths(monthKey: string, months: number) {
  const date = new Date(`${monthKey}-01T00:00:00+08:00`);
  date.setMonth(date.getMonth() + months);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
  }).format(date);
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
