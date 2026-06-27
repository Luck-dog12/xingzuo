import { createAstroEventAction, importAstroEventsAction, setAstroEventStatusAction } from "@/lib/admin-actions";
import { getMonthKey } from "@/lib/dates";
import { getPrisma } from "@/lib/prisma";

export default async function AstroEventsAdminPage() {
  const prisma = getPrisma();
  const events = prisma
    ? await prisma.astroEvent.findMany({
        orderBy: [{ status: "asc" }, { date: "asc" }, { createdAt: "desc" }],
        take: 100,
      })
    : [];
  const month = getMonthKey();
  const defaultStart = `${month}-01`;
  const defaultEnd = endOfMonth(month);

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-semibold">星象事件</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          定时任务会自动计算并录入已通过星象事件，前台星象日历和 Agent 只读取已通过事件。后台手动导入仍会创建待审核候选，便于人工补充或校对。
        </p>
        <form action={importAstroEventsAction} className="mt-5 grid gap-4 rounded-md border border-[#e6d8c4] bg-[#fbfaf7] p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Input name="start" label="导入开始日期" type="date" defaultValue={defaultStart} />
          <Input name="end" label="导入结束日期" type="date" defaultValue={defaultEnd} />
          <button className="rounded-md bg-[#12312f] px-4 py-2 text-sm font-semibold text-white">导入候选事件</button>
        </form>
        <form action={createAstroEventAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <Input name="date" label="日期" type="date" />
          <Input name="eventType" label="事件类型" />
          <Input name="planet1" label="行星 1" />
          <Input name="planet2" label="行星 2" />
          <Input name="sign" label="星座" />
          <Input name="aspect" label="相位" />
          <Input name="source" label="来源" />
          <label className="block text-sm font-medium md:col-span-2">
            描述
            <textarea name="description" rows={4} className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2" />
          </label>
          <button className="rounded-md bg-[#12312f] px-4 py-2 text-sm font-semibold text-white md:w-fit">新增事件</button>
        </form>
      </section>
      <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="font-semibold">事件审核</h2>
        <div className="mt-4 grid gap-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-md border border-zinc-100 bg-[#fbfaf7] p-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {event.eventType} · {event.date.toLocaleDateString("zh-CN")}
                  </p>
                  <p className="mt-1 text-zinc-600">{event.description}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    来源：{event.source} · 状态：<StatusBadge status={event.status} />
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {event.status !== "approved" && (
                    <StatusButton id={event.id} status="approved" label="通过" />
                  )}
                  {event.status !== "rejected" && (
                    <StatusButton id={event.id} status="rejected" label="驳回" />
                  )}
                  {event.status !== "pending" && (
                    <StatusButton id={event.id} status="pending" label="退回待审" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Input({ label, name, type = "text", defaultValue }: { label: string; name: string; type?: string; defaultValue?: string }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-md border border-[color:var(--line)] px-3 py-2"
      />
    </label>
  );
}

function StatusButton({ id, status, label }: { id: string; status: "pending" | "approved" | "rejected"; label: string }) {
  return (
    <form action={setAstroEventStatusAction}>
      <input type="hidden" name="id" value={id} />
      <button
        name="status"
        value={status}
        className="rounded-md border border-[#d8c9b6] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[#f3eee6]"
      >
        {label}
      </button>
    </form>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = status === "approved" ? "已通过" : status === "rejected" ? "已驳回" : "待审核";
  return <span className="font-medium text-teal-800">{label}</span>;
}

function endOfMonth(monthKey: string) {
  const start = new Date(`${monthKey}-01T00:00:00+08:00`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(end);
}
