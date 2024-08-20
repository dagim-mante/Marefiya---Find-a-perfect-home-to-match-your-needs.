DO $$ BEGIN
 CREATE TYPE "public"."rentType" AS ENUM('night', 'week', 'month');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "assets" ADD COLUMN "rentType" "rentType" DEFAULT 'month';