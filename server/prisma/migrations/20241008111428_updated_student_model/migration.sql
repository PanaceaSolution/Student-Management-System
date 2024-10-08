/*
  Warnings:

  - Added the required column `father_name` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mother_name` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "admission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "father_name" TEXT NOT NULL,
ADD COLUMN     "mother_name" TEXT NOT NULL;
