CREATE TABLE IF NOT EXISTS "assetImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"assetId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assetTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" serial NOT NULL,
	"assetId" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assetImages" ADD CONSTRAINT "assetImages_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assetTags" ADD CONSTRAINT "assetTags_assetId_assetImages_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assetImages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
