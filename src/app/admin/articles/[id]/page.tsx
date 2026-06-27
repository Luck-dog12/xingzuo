import { notFound } from "next/navigation";
import { setArticleStatusAction, updateArticleAction } from "@/lib/admin-actions";
import { getAdminArticles } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export default async function AdminArticleEditPage({ params }: Props) {
  const { id } = await params;
  const articles = await getAdminArticles();
  const article = articles.find((item) => item.id === id);
  if (!article) notFound();

  return (
    <div className="grid gap-5">
      <form action={updateArticleAction} className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <input type="hidden" name="id" value={article.id} />
        <div className="mb-5">
          <p className="text-sm font-medium text-teal-800">文章编辑</p>
          <h1 className="mt-2 text-3xl font-semibold">{article.title}</h1>
        </div>
        <Field label="标题" name="title" defaultValue={article.title} />
        <Field label="英文标题" name="titleEn" defaultValue={article.titleEn ?? ""} />
        <Field label="SEO 标题" name="seoTitle" defaultValue={article.seoTitle} />
        <Field label="英文 SEO 标题" name="seoTitleEn" defaultValue={article.seoTitleEn ?? ""} />
        <Field label="SEO 描述" name="seoDescription" defaultValue={article.seoDescription} />
        <Field label="英文 SEO 描述" name="seoDescriptionEn" defaultValue={article.seoDescriptionEn ?? ""} />
        <Field label="摘要" name="excerpt" defaultValue={article.excerpt} />
        <Field label="英文摘要" name="excerptEn" defaultValue={article.excerptEn ?? ""} />
        <Field label="Canonical" name="canonicalPath" defaultValue={article.canonicalPath} />
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" name="indexable" defaultChecked={article.indexable} />
          允许索引
        </label>
        <label className="mt-4 block text-sm font-medium">
          正文 Markdown
          <textarea
            name="bodyMarkdown"
            defaultValue={article.bodyMarkdown}
            rows={18}
            className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          英文正文 Markdown
          <textarea
            name="bodyMarkdownEn"
            defaultValue={article.bodyMarkdownEn ?? ""}
            rows={18}
            className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2 font-mono text-sm"
          />
        </label>
        <button className="mt-5 rounded-md bg-[#12312f] px-4 py-2 text-sm font-semibold text-white">
          保存修改
        </button>
      </form>
      <div className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="font-semibold">状态操作</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ["approved", "审核通过"],
            ["published", "发布"],
            ["archived", "归档"],
            ["rejected", "拒绝"],
          ].map(([status, label]) => (
            <form key={status} action={setArticleStatusAction}>
              <input type="hidden" name="id" value={article.id} />
              <input type="hidden" name="status" value={status} />
              <button className="rounded-md border border-[color:var(--line)] px-4 py-2 text-sm font-medium hover:bg-[#f3eee6]">
                {label}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="mt-4 block text-sm font-medium">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2"
      />
    </label>
  );
}
