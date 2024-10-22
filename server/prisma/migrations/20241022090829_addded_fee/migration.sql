-- CreateTable
CREATE TABLE "Fee" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "tax" TEXT NOT NULL,
    "extraCharges" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "fine" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "priceInWords" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paymentDate" TIMESTAMP(3),

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);
