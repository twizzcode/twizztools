import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const footers = pgTable("footers", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
