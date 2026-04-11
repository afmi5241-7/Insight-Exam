import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

// Password is bcrypt-hashed. Default hash corresponds to "Insight@2026#Exam".
// Override by setting ADMIN_PASSWORD_HASH env variable.
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ??
  "$2b$12$xQkuoGEswtQR6zpTeVpq9e9k91rlIBoQ3bDoUaigV/w/abhSZIqBK";

router.post("/admin/verify", async (req, res): Promise<void> => {
  const { password } = req.body;
  if (!password || typeof password !== "string") {
    res.status(400).json({ error: "كلمة المرور مطلوبة" });
    return;
  }
  const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (ok) {
    (req.session as any).isAdmin = true;
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "كلمة المرور غير صحيحة" });
  }
});

router.post("/admin/logout", (req, res): void => {
  req.session.destroy(() => {});
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
      imageUrl: questionsTable.imageUrl,
      chapter: questionsTable.chapter,
      topic: questionsTable.topic,
      questionType: questionsTable.questionType,
      difficulty: questionsTable.difficulty,
      year: questionsTable.year,
      examType: questionsTable.examType,
      sourceLink: questionsTable.sourceLink,
      status: questionsTable.status,
      createdAt: questionsTable.createdAt,
      courseId: questionsTable.courseId,
      courseName: coursesTable.name,
      faculty: coursesTable.faculty,
      department: coursesTable.department,
    })
    .from(questionsTable)
    .leftJoin(coursesTable, eq(questionsTable.courseId, coursesTable.id))
    .where(eq(questionsTable.status, filterStatus))
    .orderBy(questionsTable.createdAt);

  const pendingRows = await db
    .select({ id: questionsTable.id })
    .from(questionsTable)
    .where(eq(questionsTable.status, "pending"));

  res.json({ questions: rows, pendingCount: pendingRows.length });
});

router.patch("/admin/questions/:id/status", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح" }); return; }

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

// Permanent delete — removes the question from the database entirely
router.delete("/admin/questions/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح" }); return; }

  const [deleted] = await db
    .delete(questionsTable)
    .where(eq(questionsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "السؤال غير موجود" });
    return;
  }

  res.json({ ok: true });
});

export default router;
