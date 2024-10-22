/*
  Warnings:

  - You are about to drop the `testStudent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_loginId_fkey";

-- AlterTable
ALTER TABLE "Staff" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "loginId" DROP NOT NULL;

-- DropTable
DROP TABLE "testStudent";

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login"("id") ON DELETE CASCADE ON UPDATE CASCADE;
