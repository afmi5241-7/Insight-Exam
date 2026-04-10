import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  AddQuestionBody,
  AddQuestionParams,
  GetCourseQuestionsParams,
} from "@workspace/api-zod";
import { sendNewQuestionNotification } from "../lib/email";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "غير مصرح" });
    return null;
  }
  return userId;
}

router.get("/courses/:id/questions", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetCourseQuestionsParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(and(eq(coursesTable.id, params.data.id), eq(coursesTable.userId, userId)));

  if (!course) {
    res.status(404).json({ error: "المقرر غير موجود" });
    return;
  }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.courseId, params.data.id))
    .orderBy(questionsTable.createdAt);

  res.json(questions.map(q => ({
    id: q.id,
    courseId: q.courseId,
    text: q.text,
    chapter: q.chapter,
    questionType: q.questionType,
    difficulty: q.difficulty,
    examPeriod: q.examPeriod,
    status: q.status,
    createdAt: q.createdAt,
  })));
});

router.post("/courses/:id/questions", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AddQuestionParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(and(eq(coursesTable.id, params.data.id), eq(coursesTable.userId, userId)));

  if (!course) {
    res.status(404).json({ error: "المقرر غير موجود" });
    return;
  }

  const parsed = AddQuestionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [question] = await db
    .insert(questionsTable)
    .values({
      courseId: params.data.id,
      text: parsed.data.text,
      chapter: parsed.data.chapter,
      questionType: parsed.data.questionType,
      difficulty: parsed.data.difficulty,
      examPeriod: parsed.data.examPeriod,
      status: "pending",
    })
    .returning();

  // Send admin email notification (non-blocking)
  sendNewQuestionNotification({
    text: question.text,
    chapter: question.chapter,
    questionType: question.questionType,
    difficulty: question.difficulty,
    examPeriod: question.examPeriod,
    courseName: course.name,
    courseCode: course.code,
  }).catch(() => {});

  res.status(201).json({
    id: question.id,
    courseId: question.courseId,
    text: question.text,
    chapter: question.chapter,
    questionType: question.questionType,
    difficulty: question.difficulty,
    examPeriod: question.examPeriod,
    status: question.status,
    createdAt: question.createdAt,
  });
});

export default router;
