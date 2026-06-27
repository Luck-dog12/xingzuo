import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "本站不收集出生信息或隐私画像，说明基础访问数据和 Cookie 使用原则。",
};

export default function PrivacyPolicyPage() {
  return <StaticPage slug="privacy-policy" />;
}
