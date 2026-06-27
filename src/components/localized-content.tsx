import { MarkdownContent } from "@/lib/markdown";

type LocalizedTextProps = {
  zh: string;
  en?: string | null;
};

type LocalizedMarkdownProps = LocalizedTextProps & {
  tone?: "light" | "dark";
};

export function LocalizedText({ zh, en }: LocalizedTextProps) {
  if (!en) return <>{zh}</>;

  return (
    <>
      <span className="i18n-zh">{zh}</span>
      <span className="i18n-en">{en}</span>
    </>
  );
}

export function LocalizedMarkdown({ zh, en, tone = "light" }: LocalizedMarkdownProps) {
  if (!en) return <MarkdownContent content={zh} tone={tone} />;

  return (
    <>
      <div className="i18n-block-zh">
        <MarkdownContent content={zh} tone={tone} />
      </div>
      <div className="i18n-block-en">
        <MarkdownContent content={en} tone={tone} />
      </div>
    </>
  );
}
