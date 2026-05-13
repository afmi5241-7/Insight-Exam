// @ts-nocheck
import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable, usersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
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
  if (isNaN(id)) {
    res.status(400).json({ error: "معرف غير صالح" });
    return;
  }

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

// ───────── Export / Import (full database backup & restore) ─────────

router.get("/admin/export", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const [users, courses, questions] = await Promise.all([
    db.select().from(usersTable),
    db.select().from(coursesTable),
    db.select().from(questionsTable),
  ]);

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    counts: {
      users: users.length,
      courses: courses.length,
      questions: questions.length,
    },
    users,
    courses,
    questions,
  };

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="insight-exam-backup-${stamp}.json"`,
  );
  res.send(JSON.stringify(payload, null, 2));
});

interface ImportUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt?: string | Date;
}
interface ImportCourse {
  id: number;
  faculty?: string;
  department?: string;
  name: string;
  createdAt?: string | Date;
}
interface ImportQuestion {
  id: number;
  courseId: number;
  text?: string;
  imageUrl?: string | null;
  chapter: string;
  topic?: string | null;
  questionType: string;
  difficulty: string;
  year?: string;
  examType?: string;
  sourceLink?: string | null;
  status?: string;
  createdAt?: string | Date;
}

router.post("/admin/import", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "بيانات النسخة الاحتياطية غير صالحة" });
    return;
  }
  const users: ImportUser[] = Array.isArray(body.users) ? body.users : [];
  const courses: ImportCourse[] = Array.isArray(body.courses)
    ? body.courses
    : [];
  const questions: ImportQuestion[] = Array.isArray(body.questions)
    ? body.questions
    : [];

  // Minimal shape validation on required fields.
  const badUser = users.find(
    (u) =>
      typeof u?.id !== "number" ||
      typeof u?.email !== "string" ||
      typeof u?.passwordHash !== "string" ||
      typeof u?.name !== "string",
  );
  const badCourse = courses.find(
    (c) => typeof c?.id !== "number" || typeof c?.name !== "string",
  );
  const badQuestion = questions.find(
    (q) =>
      typeof q?.id !== "number" ||
      typeof q?.courseId !== "number" ||
      typeof q?.chapter !== "string" ||
      typeof q?.questionType !== "string" ||
      typeof q?.difficulty !== "string",
  );
  if (badUser || badCourse || badQuestion) {
    res
      .status(400)
      .json({
        error:
          "بنية الملف غير صالحة — تحقق من حقول المستخدمين والمقررات والأسئلة",
      });
    return;
  }

  try {
    await db.transaction(async (tx) => {
      // Wipe existing data (questions → courses → users to respect FK order).
      await tx.delete(questionsTable);
      await tx.delete(coursesTable);
      await tx.delete(usersTable);

      const toDate = (v: string | Date | undefined): Date | undefined =>
        v == null ? undefined : v instanceof Date ? v : new Date(v);

      if (users.length > 0) {
        await tx.insert(usersTable).values(
          users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            ...(toDate(u.createdAt) ? { createdAt: toDate(u.createdAt)! } : {}),
          })),
        );
      }
      if (courses.length > 0) {
        await tx.insert(coursesTable).values(
          courses.map((c) => ({
            id: c.id,
            faculty: c.faculty ?? "",
            department: c.department ?? "",
            name: c.name,
            ...(toDate(c.createdAt) ? { createdAt: toDate(c.createdAt)! } : {}),
          })),
        );
      }
      if (questions.length > 0) {
        await tx.insert(questionsTable).values(
          questions.map((q) => ({
            id: q.id,
            courseId: q.courseId,
            text: q.text ?? "",
            imageUrl: q.imageUrl ?? null,
            chapter: q.chapter,
            topic: q.topic ?? null,
            questionType: q.questionType,
            difficulty: q.difficulty,
            year: q.year ?? "",
            examType: q.examType ?? "",
            sourceLink: q.sourceLink ?? null,
            status: q.status ?? "pending",
            ...(toDate(q.createdAt) ? { createdAt: toDate(q.createdAt)! } : {}),
          })),
        );
      }

      // Reset auto-increment sequences so future inserts pick up after the imported max IDs.
      // The 3rd setval arg (is_called) is false when the table is empty, so the next insert returns 1.
      await tx.execute(
        sql`SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), (SELECT COUNT(*) FROM users) > 0)`,
      );
      await tx.execute(
        sql`SELECT setval(pg_get_serial_sequence('courses', 'id'), COALESCE((SELECT MAX(id) FROM courses), 1), (SELECT COUNT(*) FROM courses) > 0)`,
      );
      await tx.execute(
        sql`SELECT setval(pg_get_serial_sequence('questions', 'id'), COALESCE((SELECT MAX(id) FROM questions), 1), (SELECT COUNT(*) FROM questions) > 0)`,
      );
    });

    res.json({
      ok: true,
      imported: {
        users: users.length,
        courses: courses.length,
        questions: questions.length,
      },
    });
  } catch (err) {
    req.log.error({ err }, "import failed");
    res
      .status(500)
      .json({
        error: "تعذّر استيراد البيانات. تأكد من صحة الملف.",
        message: (err as Error).message,
      });
  }
});

// Permanent delete — removes the question from the database entirely
router.delete("/admin/questions/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const id = parseInt(req.params.id as string);
  if (isNaN(id)) {
    res.status(400).json({ error: "معرف غير صالح" });
    return;
  }

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
