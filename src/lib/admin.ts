import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getAuthOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function getAdminSession() {
  return getServerSession(getAuthOptions());
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }
  return session;
}

export async function isAdminRequest() {
  const session = await getAdminSession();
  return Boolean(session?.user?.email);
}

export async function getAdminDashboardData() {
  const prisma = getPrisma();
  if (!prisma) {
    return {
      jobs: [],
      qualityChecks: [],
      cronRuns: [],
    };
  }

  const [jobs, qualityChecks, cronRuns] = await Promise.all([
    prisma.generationJob.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.qualityCheck.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { article: true } }),
    prisma.cronRun.findMany({ orderBy: { startedAt: "desc" }, take: 10 }),
  ]);

  return { jobs, qualityChecks, cronRuns };
}
