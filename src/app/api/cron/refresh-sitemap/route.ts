import { revalidatePath } from "next/cache";
import { json, verifyCronRequest } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
  revalidatePath("/sitemap.xml");

  const prisma = getPrisma();
  if (prisma) {
    await prisma.cronRun.create({
      data: {
        jobName: "refresh-sitemap",
        status: "completed",
        completedAt: new Date(),
      },
    });
  }

  return json({ ok: true });
}
