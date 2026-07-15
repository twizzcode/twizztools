CREATE TABLE "footers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "footers_code_unique" UNIQUE("code")
);
