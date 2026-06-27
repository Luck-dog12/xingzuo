import { BadgeInfo } from "lucide-react";

export function AdSlot({ label }: { label: string }) {
  if (process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS !== "true") {
    return null;
  }

  return (
    <aside className="rounded-md border border-dashed border-[#cdbca8] bg-[#fffdf9]/80 p-4 text-sm text-zinc-600">
      <div className="flex items-center gap-2">
        <BadgeInfo className="size-4 text-[#c18221]" aria-hidden />
        <span className="font-medium">{label}</span>
      </div>
      <p className="mt-2 leading-6">
        广告展示区域
      </p>
    </aside>
  );
}
