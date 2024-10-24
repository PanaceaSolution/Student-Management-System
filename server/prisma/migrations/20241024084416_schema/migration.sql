/*
  Warnings:

  - Changed the type of `role` on the `Login` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('STUDENT', 'PARENT', 'STAFF', 'TEACHER');

-- AlterTable
ALTER TABLE "Login" DROP COLUMN "role",
ADD COLUMN     "role" "ROLE" NOT NULL;
