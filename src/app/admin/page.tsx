import Link from "next/link";
import { Activity, FileText, ShieldCheck, WandSparkles } from "lucide-react";
import { getAdminDashboardData } from "@/lib/admin";
import { getAdminStats } from "@/lib/content";
import { hasDatabaseUrl } from "@/lib/prisma";

export default async function AdminPage() {
  const [stats, dashboard] = await Promise.all([getAdminStats(), getAdminDashboardData()]);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-teal-800">CMS</p>
        <h1 className="mt-2 text-3xl font-semibold">后台总览</h1>
        {!hasDatabaseUrl() && (
          <p className="mt-3 rounded-md border border-[color:var(--line)] bg-white p-3 text-sm text-zinc-700">
            当前未配置 `DATABASE_URL`，公共页面使用示例内容。后台写操作需接入 PostgreSQL。
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "文章总数", value: stats.articles, icon: FileText },
          { label: "已发布", value: stats.published, icon: ShieldCheck },
          { label: "待审核", value: stats.pendingReview, icon: WandSparkles },
          { label: "平均质量分", value: stats.qualityAverage, icon: Activity },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
            <item.icon className="size-5 text-[color:var(--coral)]" aria-hidden />
            <p className="mt-4 text-sm text-zinc-500">{item.label}</p>
            <p className="mt-1 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="最近 Agent 任务" href="/admin/generation-jobs">
          {dashboard.jobs.length === 0 ? (
            <Empty text="暂无任务日志" />
          ) : (
            dashboard.jobs.map((job) => (
              <Row key={job.id} title={job.jobType} meta={`${job.status} · ${job.createdAt.toLocaleString("zh-CN")}`} />
            ))
          )}
        </Panel>
        <Panel title="最近质量检查" href="/admin/articles">
          {dashboard.qualityChecks.length === 0 ? (
            <Empty text="暂无质量检查" />
          ) : (
            dashboard.qualityChecks.map((check) => (
              <Row key={check.id} title={check.article?.title ?? "文章"} meta={`${check.score} 分 · ${check.notes}`} />
            ))
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-semibold">{title}</h2>
        <Link href={href} className="text-sm text-teal-800 hover:underline">
          查看
        </Link>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function Row({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-md border border-zinc-100 bg-[#fbfaf7] p-3">
      <p className="font-medium">{title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{meta}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-md bg-[#fbfaf7] p-4 text-sm text-zinc-600">{text}</p>;
}
