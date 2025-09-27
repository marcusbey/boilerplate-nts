/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referenceId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."organization" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "stripeCustomerId";

-- CreateIndex
CREATE UNIQUE INDEX "subscription_referenceId_key" ON "public"."subscription"("referenceId");

-- AddForeignKey
ALTER TABLE "public"."subscription" ADD CONSTRAINT "subscription_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
