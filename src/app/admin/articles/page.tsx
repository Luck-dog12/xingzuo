import Link from "next/link";
import { getAdminArticles } from "@/lib/content";

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <div className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-medium text-teal-800">内容管理</p>
        <h1 className="mt-2 text-3xl font-semibold">文章列表</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[color:var(--line)] text-zinc-500">
            <tr>
              <th className="py-3 pr-4">标题</th>
              <th className="py-3 pr-4">类型</th>
              <th className="py-3 pr-4">状态</th>
              <th className="py-3 pr-4">索引</th>
              <th className="py-3 pr-4">质量分</th>
              <th className="py-3 pr-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="py-3 pr-4 font-medium">{article.title}</td>
                <td className="py-3 pr-4">{article.contentType}</td>
                <td className="py-3 pr-4">{article.status}</td>
                <td className="py-3 pr-4">{article.indexable ? "index" : "noindex"}</td>
                <td className="py-3 pr-4">{article.qualityScore}</td>
                <td className="py-3 pr-4">
                  <Link href={`/admin/articles/${article.id}`} className="text-teal-800 hover:underline">
                    编辑
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
