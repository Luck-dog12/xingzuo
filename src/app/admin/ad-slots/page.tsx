import { toggleAdSlotAction } from "@/lib/admin-actions";
import { getPrisma } from "@/lib/prisma";

export default async function AdSlotsAdminPage() {
  const prisma = getPrisma();
  const slots = prisma ? await prisma.adSlot.findMany({ orderBy: { placement: "asc" } }) : [];

  return (
    <div className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
      <h1 className="text-3xl font-semibold">广告位开关</h1>
      <p className="mt-3 text-sm leading-7 text-zinc-700">MVP 和 AdSense 审核前建议保持关闭。</p>
      <div className="mt-5 grid gap-3">
        {slots.map((slot) => (
          <form key={slot.id} action={toggleAdSlotAction} className="rounded-md border border-zinc-100 bg-[#fbfaf7] p-4">
            <input type="hidden" name="id" value={slot.id} />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{slot.label}</p>
                <p className="mt-1 text-sm text-zinc-600">{slot.description}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="enabled" type="checkbox" defaultChecked={slot.enabled} />
                启用
              </label>
            </div>
            <button className="mt-3 rounded-md border border-[color:var(--line)] px-3 py-2 text-sm font-medium">保存</button>
          </form>
        ))}
        {slots.length === 0 && <p className="text-sm text-zinc-600">接入数据库并运行 seed 后会显示广告位。</p>}
      </div>
    </div>
  );
}
