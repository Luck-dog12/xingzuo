import { getPublishedArticles } from "@/lib/content";
import { json } from "@/lib/http";
import type { ContentType } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as ContentType | null;
  const articles = await getPublishedArticles(type ?? undefined, 50);
  return json({ articles });
}
