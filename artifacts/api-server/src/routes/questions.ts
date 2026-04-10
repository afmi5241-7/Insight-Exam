import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.post("/questions/submit", async (req, res): Promise<void> => {
  const { faculty, department, courseName, text, imageUrl, chapter, topic,
    questionType, difficulty, year, examType, sourceLink } = req.body ?? {};

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

  // Find or create course
  let [course] = await db
    .select()
    .from(coursesTable)
    .where(and(
      eq(coursesTable.faculty, String(faculty)),
      eq(coursesTable.department, String(department)),
      eq(coursesTable.name, String(courseName)),
    ))
    .limit(1);

  if (!course) {
    const [newCourse] = await db
      .insert(coursesTable)
      .values({ faculty: String(faculty), department: String(department), name: String(courseName) })
      .returning();
    course = newCourse;
  }

  const [question] = await db
    .insert(questionsTable)
    .values({
      courseId: course.id,
      text: String(text || ""),
      imageUrl: imageUrl ? String(imageUrl) : null,
      chapter: String(chapter),
      topic: topic ? String(topic) : null,
      questionType: String(questionType),
      difficulty: String(difficulty),
      year: String(year),
      examType: String(examType),
      sourceLink: sourceLink ? String(sourceLink) : null,
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

router.get("/courses/:id/questions", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح" }); return; }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.courseId, id))
    .orderBy(questionsTable.createdAt);

  res.json(questions);
});

export default router;
