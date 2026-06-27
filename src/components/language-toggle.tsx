"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { localeCookieName, localeLabels, type SiteLocale } from "@/lib/i18n";

export function LanguageToggle() {
  const [locale, setLocale] = useState<SiteLocale>("zh");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setLocale(readStoredLocale());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  function changeLocale(next: SiteLocale) {
    setLocale(next);
    window.localStorage.setItem(localeCookieName, next);
    window.dispatchEvent(new CustomEvent<SiteLocale>("site-locale-change", { detail: next }));
  }

  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-md border border-[#d8c9b6] bg-white/78 p-1 shadow-sm"
      data-no-i18n
      aria-label="Language"
    >
      <Languages className="ml-2 size-4 text-[#0a8179]" aria-hidden />
      {(["zh", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => changeLocale(item)}
          className={`rounded px-2.5 py-1.5 text-xs font-semibold transition ${
            locale === item ? "bg-[#132c2a] text-[#f8f4ee]" : "text-zinc-600 hover:bg-[#f3eee6] hover:text-zinc-950"
          }`}
          aria-pressed={locale === item}
        >
          {localeLabels[item]}
        </button>
      ))}
    </div>
  );
}

function readStoredLocale(): SiteLocale {
  const stored = window.localStorage.getItem(localeCookieName);
  if (stored === "en" || stored === "zh") return stored;
  return "zh";
}
