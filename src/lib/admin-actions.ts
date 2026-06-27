"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArticleStatus as PrismaArticleStatus, AstroEventStatus as PrismaAstroEventStatus } from "@prisma/client";
import { runGenerationWorkflow } from "@/lib/agent/workflow";
import { requireAdmin } from "@/lib/admin";
import { importAstroEventsForRange } from "@/lib/astro-event-importer";
import { getRequiredPrisma } from "@/lib/prisma";

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export async function updateArticleAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  const id = stringValue(formData, "id");
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error("Article not found.");

  await prisma.$transaction([
    prisma.articleVersion.create({
      data: {
        articleId: id,
        title: existing.title,
        bodyMarkdown: existing.bodyMarkdown,
        editorEmail: session.user?.email,
      },
    }),
    prisma.article.update({
      where: { id },
      data: {
        title: stringValue(formData, "title"),
        titleEn: stringValue(formData, "titleEn") || null,
        seoTitle: stringValue(formData, "seoTitle"),
        seoTitleEn: stringValue(formData, "seoTitleEn") || null,
        seoDescription: stringValue(formData, "seoDescription"),
        seoDescriptionEn: stringValue(formData, "seoDescriptionEn") || null,
        excerpt: stringValue(formData, "excerpt"),
        excerptEn: stringValue(formData, "excerptEn") || null,
        bodyMarkdown: stringValue(formData, "bodyMarkdown"),
        bodyMarkdownEn: stringValue(formData, "bodyMarkdownEn") || null,
        canonicalPath: stringValue(formData, "canonicalPath"),
        indexable: boolValue(formData, "indexable"),
      },
    }),
    prisma.auditLog.create({
      data: {
        actorEmail: session.user?.email,
        action: "article.update",
        entityType: "article",
        entityId: id,
      },
    }),
  ]);

  revalidatePath("/admin/articles");
  revalidatePath(existing.canonicalPath);
}

export async function setArticleStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  const id = stringValue(formData, "id");
  const status = stringValue(formData, "status") as PrismaArticleStatus;
  const article = await prisma.article.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "published" ? new Date() : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorEmail: session.user?.email,
      action: `article.${status}`,
      entityType: "article",
      entityId: id,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath(article.canonicalPath);
}

export async function triggerGenerationAction(formData: FormData) {
  await requireAdmin();
  const jobType = stringValue(formData, "jobType") as "daily" | "weekly" | "monthly" | "astrology_calendar";
  await runGenerationWorkflow(jobType);
  revalidatePath("/admin/generation-jobs");
  revalidatePath("/");
  redirect("/admin/generation-jobs");
}

export async function createAstroEventAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  await prisma.astroEvent.create({
    data: {
      eventKey: `manual:${randomUUID()}`,
      date: new Date(`${stringValue(formData, "date")}T00:00:00+08:00`),
      eventType: stringValue(formData, "eventType"),
      planet1: stringValue(formData, "planet1") || null,
      planet2: stringValue(formData, "planet2") || null,
      sign: stringValue(formData, "sign") || null,
      aspect: stringValue(formData, "aspect") || null,
      description: stringValue(formData, "description"),
      source: stringValue(formData, "source") || "manual",
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: session.user?.email,
    },
  });
  await prisma.auditLog.create({
    data: { actorEmail: session.user?.email, action: "astro_event.create", entityType: "astro_event" },
  });
  revalidatePath("/admin/astro-events");
}

export async function importAstroEventsAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  const start = stringValue(formData, "start");
  const end = stringValue(formData, "end");
  if (!start || !end) throw new Error("Start and end dates are required.");

  const summary = await importAstroEventsForRange(start, end);
  await prisma.auditLog.create({
    data: {
      actorEmail: session.user?.email,
      action: "astro_event.import_candidates",
      entityType: "astro_event",
      metadata: summary,
    },
  });

  revalidatePath("/admin/astro-events");
}

export async function setAstroEventStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  const id = stringValue(formData, "id");
  const status = stringValue(formData, "status") as PrismaAstroEventStatus;
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new Error("Invalid astro event status.");
  }

  await prisma.astroEvent.update({
    where: { id },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedBy: session.user?.email,
    },
  });
  await prisma.auditLog.create({
    data: {
      actorEmail: session.user?.email,
      action: `astro_event.${status}`,
      entityType: "astro_event",
      entityId: id,
    },
  });

  revalidatePath("/admin/astro-events");
  revalidatePath("/astrology-calendar");
}

export async function createInternalLinkAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  await prisma.internalLink.create({
    data: {
      anchor: stringValue(formData, "anchor"),
      url: stringValue(formData, "url"),
      category: stringValue(formData, "category"),
      priority: Number(stringValue(formData, "priority") || 0),
      isActive: boolValue(formData, "isActive"),
    },
  });
  await prisma.auditLog.create({
    data: { actorEmail: session.user?.email, action: "internal_link.create", entityType: "internal_link" },
  });
  revalidatePath("/admin/internal-links");
}

export async function updateSitePageAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  const slug = stringValue(formData, "slug");
  await prisma.sitePage.upsert({
    where: { slug },
    update: {
      title: stringValue(formData, "title"),
      seoTitle: stringValue(formData, "seoTitle"),
      seoDescription: stringValue(formData, "seoDescription"),
      bodyMarkdown: stringValue(formData, "bodyMarkdown"),
      indexable: boolValue(formData, "indexable"),
    },
    create: {
      slug,
      title: stringValue(formData, "title"),
      seoTitle: stringValue(formData, "seoTitle"),
      seoDescription: stringValue(formData, "seoDescription"),
      bodyMarkdown: stringValue(formData, "bodyMarkdown"),
      indexable: boolValue(formData, "indexable"),
    },
  });
  await prisma.auditLog.create({
    data: { actorEmail: session.user?.email, action: "site_page.update", entityType: "site_page", entityId: slug },
  });
  revalidatePath(`/${slug}`);
}

export async function toggleAdSlotAction(formData: FormData) {
  const session = await requireAdmin();
  const prisma = getRequiredPrisma();
  const id = stringValue(formData, "id");
  await prisma.adSlot.update({
    where: { id },
    data: { enabled: boolValue(formData, "enabled") },
  });
  await prisma.auditLog.create({
    data: { actorEmail: session.user?.email, action: "ad_slot.toggle", entityType: "ad_slot", entityId: id },
  });
  revalidatePath("/admin/ad-slots");
}
