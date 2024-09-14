ALTER TABLE "user" ALTER COLUMN "image" SET DEFAULT 'https://utfs.io/f/ez2eGPgh5yPHRqyddGKJgsdkimrNyB7E92IOtTCf4PhDZb3G';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bio" text;