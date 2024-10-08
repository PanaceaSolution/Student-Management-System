/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_loginId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");
