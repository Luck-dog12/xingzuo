import { json } from "@/lib/http";
import { getPrisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const prisma = getPrisma();
  if (!prisma) return json({ internal_links: [] });

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const links = await prisma.internalLink.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return json({ internal_links: links });
}
