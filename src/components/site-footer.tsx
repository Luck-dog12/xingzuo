import Link from "next/link";
import { footerItems, navItems, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8c9b6] bg-[#211c18] text-[#f8f4ee]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#d8c9b6]">
            十二星座公共运势、星象解释与星座百科内容站，记录适合日常阅读的星座节奏与灵感。
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">内容栏目</p>
          <div className="mt-3 grid gap-2 text-sm text-[#d8c9b6]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">站点信息</p>
          <div className="mt-3 grid gap-2 text-sm text-[#d8c9b6]">
            {footerItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
