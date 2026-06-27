import { notFound } from "next/navigation";
import { MarkdownContent } from "@/lib/markdown";
import { getSitePage } from "@/lib/content";

export async function StaticPage({ slug }: { slug: string }) {
  const page = await getSitePage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <article className="rounded-md border border-[color:var(--line)] bg-white p-6 shadow-sm sm:p-9">
        <MarkdownContent content={`# ${page.title}\n\n${page.bodyMarkdown}`} />
      </article>
    </div>
  );
}
