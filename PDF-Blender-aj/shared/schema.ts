import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).omit({ 
  id: true, 
  createdAt: true 
});

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

// Request types
export const mergeRequestSchema = z.object({
  fileIds: z.array(z.number())
});

export const splitRequestSchema = z.object({
  fileId: z.number(),
  pageRange: z.string() // e.g., "1-3,5,7-9"
});

export type MergeRequest = z.infer<typeof mergeRequestSchema>;
export type SplitRequest = z.infer<typeof splitRequestSchema>;
