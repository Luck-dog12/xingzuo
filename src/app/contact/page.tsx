import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "联系我们",
  description: "反馈内容、页面、版权或合作问题，可通过联系页面与本站沟通。",
};

export default function ContactPage() {
  return <StaticPage slug="contact" />;
}
