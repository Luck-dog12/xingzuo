import type { Metadata } from "next";
import Link from "next/link";
import { MoonStar, Orbit, ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: "后台登录",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = normalizeCallbackUrl(params?.callbackUrl);

  return (
    <div className="login-orbit relative min-h-[calc(100vh-132px)] overflow-hidden bg-[#132c2a] text-[#fff8e7]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,24,0.32),rgba(8,22,24,0.72))]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-132px)] w-full max-w-[100vw] items-center gap-10 px-4 py-12 sm:max-w-7xl sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        <section className="min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-2xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0c96a]">
            <MoonStar className="size-4" aria-hidden />
            星象后台
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            进入内容观测台
          </h1>
          <p className="mt-5 max-w-xl break-words text-base leading-8 text-[#eadfcc]">
            审核文章、校准星象事件、管理内链与广告位。这里是自动发文 Agent 的夜空仪表盘。
          </p>
          <div className="mt-8 grid max-w-[calc(100vw-2rem)] gap-3 sm:max-w-xl sm:grid-cols-3">
            {[
              ["内容审核", "质量分与发布状态"],
              ["星象数据", "事件维护与导入"],
              ["索引控制", "canonical 与 noindex"],
            ].map(([title, text]) => (
              <div key={title} className="min-w-0 rounded-md border border-white/15 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-[#fff8e7]">{title}</p>
                <p className="mt-2 text-xs leading-5 text-[#d9ccb5]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0 max-w-[calc(100vw-2rem)] rounded-md border border-white/16 bg-[#112624]/88 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.32)] backdrop-blur-md sm:max-w-full">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#f0c96a]">Admin Access</p>
              <h2 className="mt-2 text-2xl font-semibold">邮箱登录</h2>
            </div>
            <div className="grid size-12 place-items-center rounded-full border border-[#f0c96a]/35 bg-[#f0c96a]/12">
              <Orbit className="size-5 text-[#f0c96a]" aria-hidden />
            </div>
          </div>

          {params?.error && (
            <p className="mt-5 rounded-md border border-[#bd4f3f]/45 bg-[#bd4f3f]/12 px-4 py-3 text-sm leading-6 text-[#ffd7ce]">
              登录链接已过期，或该邮箱不在管理员白名单中。请重新发送一封最新邮件。
            </p>
          )}

          <LoginForm callbackUrl={callbackUrl} />

          <div className="mt-6 border-t border-white/12 pt-5 text-xs leading-6 text-[#d9ccb5]">
            <p className="flex items-start gap-2">
              <ShieldCheck className="mt-1 size-4 shrink-0 text-[#87d8cb]" aria-hidden />
              Magic link 只在当前登录域名下生效。本地请使用同一个地址打开邮件链接和后台。
            </p>
            <Link href="/" className="mt-4 inline-flex text-[#f0c96a] hover:underline">
              返回站点首页
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function normalizeCallbackUrl(value?: string) {
  if (!value) return "/admin";

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}` || "/admin";
  } catch {
    return value.startsWith("/") ? value : "/admin";
  }
}
