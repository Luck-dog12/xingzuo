import { revalidatePath } from "next/cache";
import { json, requireAdminJson } from "@/lib/http";
import { getRequiredPrisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: Context) {
  const unauthorized = await requireAdminJson();
  if (unauthorized) return unauthorized;
  const { id } = await context.params;
  const prisma = getRequiredPrisma();
  const article = await prisma.article.update({ where: { id }, data: { status: "approved" } });
  revalidatePath("/admin/articles");
  return json({ article });
}
