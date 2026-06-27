import { getArticleBySlug } from "@/lib/content";
import { json } from "@/lib/http";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: Context) {
  const { slug } = await context.params;
  const article = await getArticleBySlug(slug);
  if (!article) return json({ error: "Not found" }, { status: 404 });
  return json({ article });
}
