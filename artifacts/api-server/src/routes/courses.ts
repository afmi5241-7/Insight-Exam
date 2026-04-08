import { Router, type IRouter } from "express";
import { db, coursesTable, questionsTable } from "@workspace/db";
import { eq, and, sql, count } from "drizzle-orm";
import {
  CreateCourseBody,
  GetCourseParams,
  DeleteCourseParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "غير مصرح" });
    return null;
  }
  return userId;
}

router.get("/courses", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const courses = await db
    .select({
      id: coursesTable.id,
      userId: coursesTable.userId,
      name: coursesTable.name,
      code: coursesTable.code,
      professor: coursesTable.professor,
      createdAt: coursesTable.createdAt,
      questionCount: count(questionsTable.id),
    })
    .from(coursesTable)
    .leftJoin(questionsTable, eq(questionsTable.courseId, coursesTable.id))
    .where(eq(coursesTable.userId, userId))
    .groupBy(coursesTable.id)
    .orderBy(coursesTable.createdAt);

  res.json(courses);
});

router.post("/courses", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [course] = await db
    .insert(coursesTable)
    .values({ ...parsed.data, userId })
    .returning();

  res.status(201).json({
    ...course,
    questionCount: 0,
  });
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetCourseParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [course] = await db
    .select({
      id: coursesTable.id,
      userId: coursesTable.userId,
      name: coursesTable.name,
      code: coursesTable.code,
      professor: coursesTable.professor,
      createdAt: coursesTable.createdAt,
      questionCount: count(questionsTable.id),
    })
    .from(coursesTable)
    .leftJoin(questionsTable, eq(questionsTable.courseId, coursesTable.id))
    .where(and(eq(coursesTable.id, params.data.id), eq(coursesTable.userId, userId)))
    .groupBy(coursesTable.id);

  if (!course) {
    res.status(404).json({ error: "المقرر غير موجود" });
    return;
  }

  res.json(course);
});

router.delete("/courses/:id", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteCourseParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(coursesTable)
    .where(and(eq(coursesTable.id, params.data.id), eq(coursesTable.userId, userId)))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "المقرر غير موجود" });
    return;
  }

  res.json({ message: "تم حذف المقرر" });
});

export default router;
