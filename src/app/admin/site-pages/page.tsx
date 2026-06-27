import { updateSitePageAction } from "@/lib/admin-actions";
import { fallbackSitePages } from "@/lib/static-content";
import { getPrisma } from "@/lib/prisma";

export default async function SitePagesAdminPage() {
  const prisma = getPrisma();
  const pages = prisma ? await prisma.sitePage.findMany({ orderBy: { slug: "asc" } }) : fallbackSitePages;

  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-semibold">基础页面</h1>
      {pages.map((page) => (
        <form key={page.slug} action={updateSitePageAction} className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <input type="hidden" name="slug" value={page.slug} />
          <h2 className="text-xl font-semibold">{page.slug}</h2>
          <Field name="title" label="标题" defaultValue={page.title} />
          <Field name="seoTitle" label="SEO 标题" defaultValue={page.seoTitle} />
          <Field name="seoDescription" label="SEO 描述" defaultValue={page.seoDescription} />
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" name="indexable" defaultChecked={page.indexable} />
            允许索引
          </label>
          <label className="mt-4 block text-sm font-medium">
            正文
            <textarea name="bodyMarkdown" defaultValue={page.bodyMarkdown} rows={6} className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2" />
          </label>
          <button className="mt-4 rounded-md bg-[#12312f] px-4 py-2 text-sm font-semibold text-white">保存</button>
        </form>
      ))}
    </div>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="mt-4 block text-sm font-medium">
      {label}
      <input name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2" />
    </label>
  );
}
