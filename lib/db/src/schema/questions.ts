import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { coursesTable } from "./courses";

export const questionsTable = pgTable("questions", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  text: text("text").notNull().default(""),
  imageUrl: text("image_url"),
  chapter: text("chapter").notNull(),
  topic: text("topic"),
  questionType: text("question_type").notNull(),
  difficulty: text("difficulty").notNull(),
  year: text("year").notNull().default(""),
  examType: text("exam_type").notNull().default(""),
  sourceLink: text("source_link"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuestionSchema = createInsertSchema(questionsTable).omit({ id: true, createdAt: true });
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questionsTable.$inferSelect;
