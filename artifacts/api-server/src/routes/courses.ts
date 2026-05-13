// @ts-nocheck
import { Router, type IRouter } from "express";
import { db, coursesTable, questionsTable } from "@workspace/db";
import { eq, and, count, ilike } from "drizzle-orm";

const router: IRouter = Router();

// ─── Faculties ────────────────────────────────────────────────────────────────

router.get("/faculties", async (_req, res): Promise<void> => {
  const rows = await db
    .selectDistinct({ faculty: coursesTable.faculty })
    .from(coursesTable)
    .orderBy(coursesTable.faculty);
  res.json(rows.map((r) => r.faculty).filter(Boolean));
});

// ─── Departments ──────────────────────────────────────────────────────────────

router.get("/departments", async (req, res): Promise<void> => {
  const { faculty } = req.query as Record<string, string>;
  const base = db
    .selectDistinct({ department: coursesTable.department })
    .from(coursesTable)
    .orderBy(coursesTable.department);
  const rows = faculty
    ? await base.where(eq(coursesTable.faculty, faculty))
    : await base;
  res.json(rows.map((r) => r.department).filter(Boolean));
});

// ─── Courses ──────────────────────────────────────────────────────────────────

router.get("/courses", async (req, res): Promise<void> => {
  const { faculty, department, name } = req.query as Record<string, string>;

  let query = db
    .select({
      id: coursesTable.id,
      faculty: coursesTable.faculty,
      department: coursesTable.department,
      name: coursesTable.name,
      createdAt: coursesTable.createdAt,
      questionCount: count(questionsTable.id),
    })
    .from(coursesTable)
    .leftJoin(
      questionsTable,
      and(
        eq(questionsTable.courseId, coursesTable.id),
        eq(questionsTable.status, "approved"),
      ),
    )
    .groupBy(coursesTable.id)
    .orderBy(coursesTable.name)
    .$dynamic();

  const conditions = [];
  if (faculty) conditions.push(eq(coursesTable.faculty, faculty));
  if (department) conditions.push(eq(coursesTable.department, department));
  if (name) conditions.push(ilike(coursesTable.name, `%${name}%`));
  if (conditions.length > 0) query = query.where(and(...conditions));

  const courses = await query;
  res.json(courses);
});

router.get("/courses/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) {
    res.status(400).json({ error: "معرف غير صالح" });
    return;
  }

  const [course] = await db
    .select({
      id: coursesTable.id,
      faculty: coursesTable.faculty,
      department: coursesTable.department,
      name: coursesTable.name,
      createdAt: coursesTable.createdAt,
      questionCount: count(questionsTable.id),
    })
    .from(coursesTable)
    .leftJoin(questionsTable, eq(questionsTable.courseId, coursesTable.id))
    .where(eq(coursesTable.id, id))
    .groupBy(coursesTable.id);

  if (!course) {
    res.status(404).json({ error: "المقرر غير موجود" });
    return;
  }
  res.json(course);
});

export default router;
