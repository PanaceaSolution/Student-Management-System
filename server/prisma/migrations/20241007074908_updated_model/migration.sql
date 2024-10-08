/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Login_username_key" ON "Login"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_username_key" ON "Staff"("username");
