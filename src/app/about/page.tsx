import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解本站公共星座内容定位，以及不做个人命盘、不采集隐私的原则。",
};

export default function AboutPage() {
  return <StaticPage slug="about" />;
}
