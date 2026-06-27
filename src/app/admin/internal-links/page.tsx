import { createInternalLinkAction } from "@/lib/admin-actions";
import { getPrisma } from "@/lib/prisma";

export default async function InternalLinksAdminPage() {
  const prisma = getPrisma();
  const links = prisma ? await prisma.internalLink.findMany({ orderBy: [{ priority: "desc" }] }) : [];

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-semibold">内链管理</h1>
        <form action={createInternalLinkAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="anchor" label="锚文本" />
          <Input name="url" label="URL" />
          <Input name="category" label="分类" />
          <Input name="priority" label="优先级" type="number" />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input name="isActive" type="checkbox" defaultChecked />
            启用
          </label>
          <button className="rounded-md bg-[#12312f] px-4 py-2 text-sm font-semibold text-white md:w-fit">新增内链</button>
        </form>
      </section>
      <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="font-semibold">内链列表</h2>
        <div className="mt-4 grid gap-3">
          {links.map((link) => (
            <div key={link.id} className="rounded-md border border-zinc-100 bg-[#fbfaf7] p-3 text-sm">
              <p className="font-medium">{link.anchor}</p>
              <p className="mt-1 text-zinc-600">{link.url} · {link.category} · priority {link.priority}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Input({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input name={name} type={type} className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2" />
    </label>
  );
}
