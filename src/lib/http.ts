import { isAdminRequest } from "@/lib/admin";

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

export async function requireAdminJson() {
  const ok = await isAdminRequest();
  if (!ok) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function verifyCronRequest(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return false;
  }
  return request.headers.get("authorization") === `Bearer ${expected}`;
}
