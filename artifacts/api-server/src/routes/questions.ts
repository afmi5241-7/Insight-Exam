import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// ─── Input Sanitisation ───────────────────────────────────────────────────────
// Strips all HTML/script tags from a string to prevent XSS
function sanitize(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .trim()
    .slice(0, 5000);
}

// ─── Image Validation ─────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ["jpeg", "jpg", "png", "gif", "webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

function validateImageUrl(imageUrl: string): { ok: boolean; error?: string } {
  if (!imageUrl) return { ok: true };

  if (imageUrl.startsWith("data:")) {
    // Validate base64 data URL format: data:image/png;base64,...
    const match = imageUrl.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!match) return { ok: false, error: "صيغة الصورة غير صالحة" };
    const ext = match[1].toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(ext)) {
      return { ok: false, error: `نوع الصورة غير مدعوم. الأنواع المقبولة: ${ALLOWED_IMAGE_TYPES.join(", ")}` };
    }
    const base64Data = match[2];
    const byteSize = Math.ceil((base64Data.length * 3) / 4);
    if (byteSize > MAX_IMAGE_BYTES) {
      return { ok: false, error: "حجم الصورة يتجاوز 5 ميجابايت" };
    }
    return { ok: true };
  }

  // Plain URL — validate it looks like a URL
  try {
    const url = new URL(imageUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { ok: false, error: "رابط الصورة غير صالح" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "رابط الصورة غير صالح" };
  }
}

// ─── Submit Question ──────────────────────────────────────────────────────────
router.post("/questions/submit", async (req, res): Promise<void> => {
  const raw = req.body ?? {};

  // Sanitize all text inputs
  const faculty      = sanitize(raw.faculty);
  const department   = sanitize(raw.department);
  const courseName   = sanitize(raw.courseName);
  const text         = sanitize(raw.text);
  const chapter      = sanitize(raw.chapter);
  const topic        = sanitize(raw.topic);
  const questionType = sanitize(raw.questionType);
  const difficulty   = sanitize(raw.difficulty);
  const year         = sanitize(raw.year);
  const examType     = sanitize(raw.examType);
  const sourceLink   = sanitize(raw.sourceLink);
  const imageUrl     = typeof raw.imageUrl === "string" ? raw.imageUrl.trim() : "";

  if (!faculty || !department || !courseName) {
    res.status(400).json({ error: "يرجى إدخال بيانات المقرر كاملة" });
    return;
  }
  if (!chapter || !questionType || !difficulty || !year || !examType) {
    res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة" });
    return;
  }
  if (!text && !imageUrl) {
    res.status(400).json({ error: "يجب إدخال نص السؤال أو رفع صورة" });
    return;
  }

  // Validate image if provided
  if (imageUrl) {
    const check = validateImageUrl(imageUrl);
    if (!check.ok) {
      res.status(400).json({ error: check.error });
      return;
    }
  }

  // Validate source link if provided
  if (sourceLink) {
    try {
      const url = new URL(sourceLink);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("invalid protocol");
    } catch {
      res.status(400).json({ error: "رابط المصدر غير صالح. يجب أن يبدأ بـ http أو https" });
      return;
    }
  }

  // Find or create course
  let [course] = await db
    .select()
    .from(coursesTable)
    .where(and(
      eq(coursesTable.faculty, faculty),
      eq(coursesTable.department, department),
      eq(coursesTable.name, courseName),
    ))
    .limit(1);

  if (!course) {
    const [newCourse] = await db
      .insert(coursesTable)
      .values({ faculty, department, name: courseName })
      .returning();
    course = newCourse;
  }

  const [question] = await db
    .insert(questionsTable)
    .values({
      courseId: course.id,
      text,
      imageUrl: imageUrl || null,
      chapter,
      topic: topic || null,
      questionType,
      difficulty,
      year,
      examType,
      sourceLink: sourceLink || null,
      status: "pending",
    })
    .returning();

  res.status(201).json({
    id: question.id,
    courseId: question.courseId,
    status: question.status,
    createdAt: question.createdAt,
  });
});

// ─── Get Course Questions ─────────────────────────────────────────────────────
router.get("/courses/:id/questions", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح" }); return; }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(and(eq(questionsTable.courseId, id), eq(questionsTable.status, "approved")))
    .orderBy(questionsTable.createdAt);

  res.json(questions);
});

export default router;
