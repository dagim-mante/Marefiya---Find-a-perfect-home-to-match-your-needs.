CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" real NOT NULL,
	"userId" text NOT NULL,
	"assetId" serial NOT NULL,
	"comment" text NOT NULL,
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assetIdx" ON "reviews" USING btree ("assetId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userIdx" ON "reviews" USING btree ("userId");