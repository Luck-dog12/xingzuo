import { runGenerationWorkflow } from "@/lib/agent/workflow";
import { json, verifyCronRequest } from "@/lib/http";

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
  const result = await runGenerationWorkflow("weekly");
  return json({ result });
}
