/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - Changed the type of `sex` on the `Staff` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `addressId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sex` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('STUDENT', 'PARENT', 'STAFF', 'TEACHER');

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "sex",
ADD COLUMN     "sex" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address",
ADD COLUMN     "addressId" INTEGER NOT NULL,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ownerType" "OwnerType" NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "permanentAddressId" INTEGER NOT NULL,
    "temporaryAddressId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermanentAddress" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "villageName" TEXT NOT NULL,
    "postalcode" TEXT NOT NULL,

    CONSTRAINT "PermanentAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryAddress" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "villageName" TEXT NOT NULL,
    "postalcode" TEXT NOT NULL,

    CONSTRAINT "TemporaryAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "student_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "parent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "staff_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "teacher_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_permanentAddressId_fkey" FOREIGN KEY ("permanentAddressId") REFERENCES "PermanentAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_temporaryAddressId_fkey" FOREIGN KEY ("temporaryAddressId") REFERENCES "TemporaryAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
