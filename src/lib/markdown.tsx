import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content, tone = "light" }: { content: string; tone?: "light" | "dark" }) {
  return (
    <div className={`markdown-content max-w-none ${tone === "dark" ? "markdown-content-dark" : ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
