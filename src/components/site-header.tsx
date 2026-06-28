import Link from "next/link";
import { MoonStar } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { navItems, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d8c9b6] bg-[#f8f4ee]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-md bg-[#132c2a] text-[#f8f4ee] shadow-sm">
            <MoonStar className="size-5" aria-hidden />
          </span>
          <span className="truncate text-[15px]">{siteConfig.name}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-zinc-700 transition hover:bg-white/80 hover:text-zinc-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle />
        </div>
      </div>
      <nav className="flex max-w-full gap-1 overflow-x-auto border-t border-[#d8c9b6] px-4 py-2 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-md bg-white/80 px-3 py-2 text-sm text-zinc-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
