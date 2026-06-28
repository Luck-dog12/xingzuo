export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-md border border-[color:var(--line)] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">请检查邮箱</h1>
        <p className="mt-3 leading-7 text-zinc-700">
          如果邮箱在管理员白名单中，你会收到登录链接。请使用最新一封邮件里的链接完成登录。
        </p>
      </div>
    </div>
  );
}
