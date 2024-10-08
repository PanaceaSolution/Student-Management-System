-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_loginId_fkey";

-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "loginId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login"("id") ON DELETE SET NULL ON UPDATE CASCADE;
