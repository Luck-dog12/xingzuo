import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Cookie 政策",
  description: "说明本站可能使用 Cookie 支持基础功能、访问分析和未来广告服务。",
};

export default function CookiePolicyPage() {
  return <StaticPage slug="cookie-policy" />;
}
