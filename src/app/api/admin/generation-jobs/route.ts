import { runGenerationWorkflow } from "@/lib/agent/workflow";
import { json, requireAdminJson } from "@/lib/http";

export async function POST(request: Request) {
  const unauthorized = await requireAdminJson();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const jobType = body.jobType as "daily" | "weekly" | "monthly" | "astrology_calendar";
  if (!["daily", "weekly", "monthly", "astrology_calendar"].includes(jobType)) {
    return json({ error: "Invalid jobType" }, { status: 400 });
  }

  const result = await runGenerationWorkflow(jobType);
  return json({ result });
}
