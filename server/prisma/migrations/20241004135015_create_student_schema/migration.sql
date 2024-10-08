-- CreateTable
CREATE TABLE "testStudent" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "testStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "testStudent_email_key" ON "testStudent"("email");
