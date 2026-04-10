import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";

const router: IRouter = Router();

// Simple hardcoded admin password — change by setting ADMIN_PASSWORD env var
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin2024";

router.post("/admin/verify", (req, res): void => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    (req.session as any).isAdmin = true;
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "كلمة المرور غير صحيحة" });
  }
});

router.post("/admin/logout", (req, res): void => {
  (req.session as any).isAdmin = false;
  res.json({ ok: true });
});

function requireAdmin(req: any, res: any): boolean {
  if (!(req.session as any)?.isAdmin) {
    res.status(401).json({ error: "غير مصرح" });
    return false;
  }
  return true;
}

router.get("/admin/questions", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const status = (req.query.status as string) ?? "pending";
  const allowed = ["pending", "approved", "rejected"];
  const filterStatus = allowed.includes(status) ? status : "pending";

  const rows = await db
    .select({
      id: questionsTable.id,
      text: questionsTable.text,
      chapter: questionsTable.chapter,
      questionType: questionsTable.questionType,
      difficulty: questionsTable.difficulty,
      examPeriod: questionsTable.examPeriod,
      status: questionsTable.status,
      createdAt: questionsTable.createdAt,
      courseId: questionsTable.courseId,
      courseName: coursesTable.name,
      courseCode: coursesTable.code,
    })
    .from(questionsTable)
    .leftJoin(coursesTable, eq(questionsTable.courseId, coursesTable.id))
    .where(eq(questionsTable.status, filterStatus))
    .orderBy(questionsTable.createdAt);

  const pendingCount = await db
    .select({ id: questionsTable.id })
    .from(questionsTable)
    .where(eq(questionsTable.status, "pending"));

  res.json({ questions: rows, pendingCount: pendingCount.length });
});

router.patch("/admin/questions/:id/status", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const id = parseInt(req.params.id as string);
  const { status } = req.body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    res.status(400).json({ error: "حالة غير صالحة" });
    return;
  }

  const [updated] = await db
    .update(questionsTable)
    .set({ status })
    .where(eq(questionsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "السؤال غير موجود" });
    return;
  }

  res.json({ ok: true, status: updated.status });
});

export default router;
