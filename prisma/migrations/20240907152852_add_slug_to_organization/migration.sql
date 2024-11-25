/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - The required column `slug` was added to the `Organization` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "slug" TEXT;

-- Update existing records with default slug using the id
UPDATE "Organization" SET "slug" = "id"::TEXT WHERE "slug" IS NULL;

-- AlterTable to make slug not null
ALTER TABLE "Organization" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");
