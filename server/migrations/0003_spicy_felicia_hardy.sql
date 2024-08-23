ALTER TABLE "assetTags" DROP CONSTRAINT "assetTags_assetId_assetImages_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assetTags" ADD CONSTRAINT "assetTags_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
