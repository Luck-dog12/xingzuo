import { triggerGenerationAction } from "@/lib/admin-actions";
import { getAdminDashboardData } from "@/lib/admin";

export default async function GenerationJobsPage() {
  const { jobs, cronRuns } = await getAdminDashboardData();

  return (
    <div className="grid gap-5">
      <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-teal-800">Agent</p>
        <h1 className="mt-2 text-3xl font-semibold">生成任务</h1>
        <form action={triggerGenerationAction} className="mt-5 flex flex-wrap gap-3">
          {[
            ["daily", "生成今日运势"],
            ["weekly", "生成本周运势"],
            ["monthly", "生成本月运势"],
            ["astrology_calendar", "更新星象日历"],
          ].map(([value, label]) => (
            <button
              key={value}
              name="jobType"
              value={value}
              className="rounded-md bg-[#12312f] px-4 py-2 text-sm font-semibold text-white"
            >
              {label}
            </button>
          ))}
        </form>
      </section>
      <LogTable title="Generation Jobs" rows={jobs} fields={["jobType", "status", "attempts", "createdAt"]} />
      <LogTable title="Cron Runs" rows={cronRuns} fields={["jobName", "status", "startedAt", "completedAt"]} />
    </div>
  );
}

type LogRow = { id: string; [key: string]: unknown };

function LogTable({ title, rows, fields }: { title: string; rows: LogRow[]; fields: string[] }) {
  return (
    <section className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[color:var(--line)] text-zinc-500">
            <tr>{fields.map((field) => <th key={field} className="py-2 pr-4">{field}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((row) => (
              <tr key={row.id}>
                {fields.map((field) => (
                  <td key={field} className="py-2 pr-4">
                    {row[field] instanceof Date ? row[field].toLocaleString("zh-CN") : String(row[field] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
