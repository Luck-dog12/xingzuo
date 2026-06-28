"use client";

import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/auth/csrf")
      .then((response) => response.json())
      .then((data: { csrfToken?: string }) => {
        if (active) setCsrfToken(data.csrfToken ?? "");
      })
      .catch(() => {
        if (active) setCsrfToken("");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <form action="/api/auth/signin/email" method="post" className="mt-7 grid gap-4">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#f9e8bd]">管理员邮箱</span>
        <span className="flex min-h-12 min-w-0 items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 text-[#fff8e7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
          <Mail className="size-4 shrink-0 text-[#f0c96a]" aria-hidden />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#d9ccb5]"
            placeholder="admin@example.com"
          />
        </span>
      </label>

      <button
        type="submit"
        disabled={!csrfToken}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#f0c96a] px-5 py-3 text-sm font-bold text-[#172724] transition hover:bg-[#ffe08b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles className="size-4" aria-hidden />
        发送登录星标
        <ArrowRight className="size-4" aria-hidden />
      </button>

      <p className="flex items-start gap-2 text-xs leading-6 text-[#dacfb9]">
        <ShieldCheck className="mt-1 size-4 shrink-0 text-[#87d8cb]" aria-hidden />
        只有白名单邮箱可以进入后台。请使用最新邮件中的链接完成登录。
      </p>
    </form>
  );
}
