import { runGenerationWorkflow } from "@/lib/agent/workflow";
import { json, requireAdminJson } from "@/lib/http";
import { getRequiredPrisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  const unauthorized = await requireAdminJson();
  if (unauthorized) return unauthorized;
  const { id } = await context.params;
  const prisma = getRequiredPrisma();
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return json({ error: "Not found" }, { status: 404 });

  const jobType =
    article.contentType === "weekly_horoscope"
      ? "weekly"
      : article.contentType === "monthly_horoscope"
        ? "monthly"
        : article.contentType === "astrology_calendar"
          ? "astrology_calendar"
          : "daily";

  const result = await runGenerationWorkflow(jobType);
  return json({ result });
}
