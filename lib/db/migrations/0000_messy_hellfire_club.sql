CREATE TYPE "public"."proposal_status" AS ENUM('lead', 'em_andamento', 'fechado', 'perdido');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'partner');--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "proposal_status" DEFAULT 'lead' NOT NULL,
	"razao_social" text NOT NULL,
	"cnpj" text NOT NULL,
	"contato_nome" text,
	"contato_email" text,
	"contato_telefone" text,
	"observacoes" text,
	"client_type" text NOT NULL,
	"total_contract_value" numeric(12, 2) NOT NULL,
	"resultado_liquido" numeric(12, 2) NOT NULL,
	"pricing_model_version" text NOT NULL,
	"inputs" jsonb NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'partner' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "proposals_user_created_idx" ON "proposals" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "proposals_status_idx" ON "proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "proposals_created_idx" ON "proposals" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");