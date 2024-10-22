/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `testStudent` will be added. If there are existing duplicate values, this will fail.
  - Made the column `address` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sex` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bloodtype` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `testStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bloodtype` to the `testStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `testStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `testStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `testStudent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `testStudent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "sex" SET NOT NULL,
ALTER COLUMN "bloodtype" SET NOT NULL,
ALTER COLUMN "dob" SET NOT NULL;

-- AlterTable
ALTER TABLE "testStudent" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "bloodtype" TEXT NOT NULL,
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "parentId" INTEGER NOT NULL,
ADD COLUMN     "sex" "Gender" NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "testStudent_username_key" ON "testStudent"("username");
