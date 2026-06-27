import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "免责声明",
  description: "本站内容为公共星座运势与娱乐性参考，不构成专业建议。",
};

export default function DisclaimerPage() {
  return <StaticPage slug="disclaimer" />;
}
