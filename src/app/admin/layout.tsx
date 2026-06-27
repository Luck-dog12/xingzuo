import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

const adminNav = [
  { href: "/admin", label: "总览" },
  { href: "/admin/articles", label: "文章" },
  { href: "/admin/generation-jobs", label: "Agent 日志" },
  { href: "/admin/astro-events", label: "星象事件" },
  { href: "/admin/internal-links", label: "内链" },
  { href: "/admin/site-pages", label: "基础页面" },
  { href: "/admin/ad-slots", label: "广告位" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="border-t border-[color:var(--line)] bg-[#f8f4ed]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="rounded-md border border-[color:var(--line)] bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">管理员</p>
            <p className="mt-1 truncate text-sm font-semibold">{session.user?.email}</p>
            <nav className="mt-5 grid gap-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-zinc-700 transition hover:bg-[#f3eee6] hover:text-zinc-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
