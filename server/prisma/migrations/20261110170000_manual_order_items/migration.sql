ALTER TABLE "ProductsOrder"
  ALTER COLUMN "product_admin_id" DROP NOT NULL,
  ADD COLUMN "manual_name" TEXT;

ALTER TABLE "ProductsOrder"
  ADD CONSTRAINT "ProductsOrder_inventory_or_manual_check"
  CHECK (
    ("product_admin_id" IS NOT NULL AND "manual_name" IS NULL)
    OR ("product_admin_id" IS NULL AND "manual_name" IS NOT NULL)
  );

ALTER TABLE "Orders" DROP COLUMN "payment_type";
DROP TYPE "PaymentType";
