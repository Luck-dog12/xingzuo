-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('draft', 'generated', 'checked', 'approved', 'scheduled', 'published', 'rejected', 'rewrite_required', 'archived');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('daily_horoscope', 'weekly_horoscope', 'monthly_horoscope', 'zodiac_guide', 'astrology_guide', 'astrology_calendar', 'basic_page');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('low', 'medium', 'high', 'blocking');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('queued', 'running', 'completed', 'failed', 'rewrite_required', 'rejected');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('owner', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "AstroEventStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_en" TEXT,
    "slug" TEXT NOT NULL,
    "seo_title" TEXT NOT NULL,
    "seo_title_en" TEXT,
    "seo_description" TEXT NOT NULL,
    "seo_description_en" TEXT,
    "excerpt" TEXT NOT NULL,
    "excerpt_en" TEXT,
    "body_markdown" TEXT NOT NULL,
    "body_markdown_en" TEXT,
    "content_type" "ContentType" NOT NULL,
    "article_category" TEXT NOT NULL,
    "target_date" DATE,
    "date_range_start" DATE,
    "date_range_end" DATE,
    "canonical_path" TEXT NOT NULL,
    "indexable" BOOLEAN NOT NULL DEFAULT false,
    "status" "ArticleStatus" NOT NULL DEFAULT 'draft',
    "quality_score" INTEGER NOT NULL DEFAULT 0,
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'medium',
    "source_astro_events" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zodiac_summaries" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "sign" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "general" TEXT,
    "love" TEXT,
    "career" TEXT,
    "money" TEXT,
    "health" TEXT,
    "advice" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zodiac_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "astro_events" (
    "id" TEXT NOT NULL,
    "event_key" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "event_type" TEXT NOT NULL,
    "planet_1" TEXT,
    "planet_2" TEXT,
    "sign" TEXT,
    "aspect" TEXT,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "AstroEventStatus" NOT NULL DEFAULT 'approved',
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "astro_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_astro_events" (
    "article_id" TEXT NOT NULL,
    "astro_event_id" TEXT NOT NULL,

    CONSTRAINT "article_astro_events_pkey" PRIMARY KEY ("article_id","astro_event_id")
);

-- CreateTable
CREATE TABLE "internal_links" (
    "id" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internal_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation_jobs" (
    "id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "target_date" DATE,
    "date_range_start" DATE,
    "date_range_end" DATE,
    "status" "JobStatus" NOT NULL DEFAULT 'queued',
    "idempotency_key" TEXT NOT NULL,
    "input_payload" JSONB NOT NULL,
    "llm_output" JSONB,
    "error_message" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_checks" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "is_too_thin" BOOLEAN NOT NULL DEFAULT false,
    "is_repetitive" BOOLEAN NOT NULL DEFAULT false,
    "has_fake_astro_event" BOOLEAN NOT NULL DEFAULT false,
    "has_absolute_prediction" BOOLEAN NOT NULL DEFAULT false,
    "has_medical_or_financial_advice" BOOLEAN NOT NULL DEFAULT false,
    "has_disclaimer" BOOLEAN NOT NULL DEFAULT false,
    "has_clear_user_value" BOOLEAN NOT NULL DEFAULT false,
    "safe_to_publish" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_versions" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "editor_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "seo_title" TEXT NOT NULL,
    "seo_description" TEXT NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "indexable" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad_slots" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ad_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_email" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cron_runs" (
    "id" TEXT NOT NULL,
    "job_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "metadata" JSONB,

    CONSTRAINT "cron_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'editor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_canonical_path_key" ON "articles"("canonical_path");

-- CreateIndex
CREATE INDEX "articles_content_type_status_idx" ON "articles"("content_type", "status");

-- CreateIndex
CREATE INDEX "articles_target_date_idx" ON "articles"("target_date");

-- CreateIndex
CREATE INDEX "articles_date_range_start_date_range_end_idx" ON "articles"("date_range_start", "date_range_end");

-- CreateIndex
CREATE UNIQUE INDEX "articles_content_type_target_date_key" ON "articles"("content_type", "target_date");

-- CreateIndex
CREATE UNIQUE INDEX "zodiac_summaries_article_id_sign_key" ON "zodiac_summaries"("article_id", "sign");

-- CreateIndex
CREATE UNIQUE INDEX "astro_events_event_key_key" ON "astro_events"("event_key");

-- CreateIndex
CREATE INDEX "astro_events_date_status_idx" ON "astro_events"("date", "status");

-- CreateIndex
CREATE INDEX "internal_links_category_is_active_idx" ON "internal_links"("category", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "generation_jobs_idempotency_key_key" ON "generation_jobs"("idempotency_key");

-- CreateIndex
CREATE INDEX "generation_jobs_job_type_status_idx" ON "generation_jobs"("job_type", "status");

-- CreateIndex
CREATE INDEX "quality_checks_article_id_idx" ON "quality_checks"("article_id");

-- CreateIndex
CREATE INDEX "article_versions_article_id_idx" ON "article_versions"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_pages_slug_key" ON "site_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ad_slots_key_key" ON "ad_slots"("key");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "cron_runs_job_name_started_at_idx" ON "cron_runs"("job_name", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "zodiac_summaries" ADD CONSTRAINT "zodiac_summaries_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_astro_events" ADD CONSTRAINT "article_astro_events_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_astro_events" ADD CONSTRAINT "article_astro_events_astro_event_id_fkey" FOREIGN KEY ("astro_event_id") REFERENCES "astro_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quality_checks" ADD CONSTRAINT "quality_checks_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
