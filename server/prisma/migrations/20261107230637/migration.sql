-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('YAPE', 'CASH');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PAID', 'PENDING', 'CANCELLED');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "business_name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "family_id" UUID NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsAdmin" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductsAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "debt" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPayments" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "payment_type" "PaymentType" NOT NULL DEFAULT 'CASH',
    "account_id" UUID,
    "status" "OrderStatus" NOT NULL DEFAULT 'PAID',
    "total" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsOrder" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_admin_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductsOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sessions_refresh_token_hash_key" ON "Sessions"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "Sessions_user_id_idx" ON "Sessions"("user_id");

-- CreateIndex
CREATE INDEX "Sessions_family_id_idx" ON "Sessions"("family_id");

-- CreateIndex
CREATE INDEX "Sessions_expires_at_idx" ON "Sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "Products_code_key" ON "Products"("code");

-- CreateIndex
CREATE INDEX "Products_code_idx" ON "Products"("code");

-- CreateIndex
CREATE INDEX "Products_name_idx" ON "Products"("name");

-- CreateIndex
CREATE INDEX "ProductsAdmin_admin_id_idx" ON "ProductsAdmin"("admin_id");

-- CreateIndex
CREATE INDEX "ProductsAdmin_product_id_idx" ON "ProductsAdmin"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductsAdmin_admin_id_product_id_key" ON "ProductsAdmin"("admin_id", "product_id");

-- CreateIndex
CREATE INDEX "Accounts_admin_id_idx" ON "Accounts"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_admin_id_phone_key" ON "Accounts"("admin_id", "phone");

-- CreateIndex
CREATE INDEX "AccountPayments_account_id_idx" ON "AccountPayments"("account_id");

-- CreateIndex
CREATE INDEX "AccountPayments_created_at_idx" ON "AccountPayments"("created_at");

-- CreateIndex
CREATE INDEX "Orders_admin_id_idx" ON "Orders"("admin_id");

-- CreateIndex
CREATE INDEX "Orders_account_id_idx" ON "Orders"("account_id");

-- CreateIndex
CREATE INDEX "Orders_status_idx" ON "Orders"("status");

-- CreateIndex
CREATE INDEX "Orders_created_at_idx" ON "Orders"("created_at");

-- CreateIndex
CREATE INDEX "ProductsOrder_order_id_idx" ON "ProductsOrder"("order_id");

-- CreateIndex
CREATE INDEX "ProductsOrder_product_admin_id_idx" ON "ProductsOrder"("product_admin_id");

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsAdmin" ADD CONSTRAINT "ProductsAdmin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsAdmin" ADD CONSTRAINT "ProductsAdmin_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPayments" ADD CONSTRAINT "AccountPayments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOrder" ADD CONSTRAINT "ProductsOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOrder" ADD CONSTRAINT "ProductsOrder_product_admin_id_fkey" FOREIGN KEY ("product_admin_id") REFERENCES "ProductsAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
