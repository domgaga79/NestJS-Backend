UPDATE "Product" SET "stock" = 0 WHERE "stock" IS NULL;
UPDATE "Product" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "User" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;