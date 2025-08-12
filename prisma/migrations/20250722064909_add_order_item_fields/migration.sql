/*
  Warnings:

  - Added the required column `productId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the column with a default value
ALTER TABLE "OrderItem" ADD COLUMN "productId" TEXT NOT NULL DEFAULT 'unknown';

-- Add the optional column
ALTER TABLE "OrderItem" ADD COLUMN "productData" TEXT;

-- Update existing records with a placeholder value if needed
UPDATE "OrderItem" SET "productId" = 'legacy-' || "id" WHERE "productId" = 'unknown';

-- Remove the default constraint
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP DEFAULT;
