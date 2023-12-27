ALTER TABLE "Article"
ADD COLUMN "urlSlug" TEXT UNIQUE;

UPDATE "Article"
SET "urlSlug" = LOWER("id" || '-' || REPLACE("title", ' ', '-'));

ALTER TABLE "Article"
ALTER COLUMN "urlSlug" SET NOT NULL;
