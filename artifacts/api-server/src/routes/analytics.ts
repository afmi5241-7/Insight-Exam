import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

const typeLabel: Record<string, string> = {
  "اختيار من متعدد": "اختيار من متعدد",
  "صح وخطأ": "صح وخطأ",
  "أكمل الفراغ": "أكمل الفراغ",
  "أسئلة التوصيل": "أسئلة التوصيل",
  "إجابة قصيرة": "إجابة قصيرة",
  "إجابة طويلة": "إجابة طويلة",
  "مسائل رياضية / حسابية": "مسائل رياضية / حسابية",
  "صحّح الخطأ": "صحّح الخطأ",
  "نوع آخر": "نوع آخر",
  multiple_choice: "اختيار من متعدد",
  true_false: "صح وخطأ",
  essay: "مقالي",
  fill_blank: "أكمل الفراغ",
};

const diffLabel: Record<string, string> = {
  easy: "سهل", medium: "متوسط", hard: "صعب",
  "سهل": "سهل", "متوسط": "متوسط", "صعب": "صعب",
};

// ─── Global Stats ────────────────────────────────────────────────────────────

router.get("/stats", async (_req, res): Promise<void> => {
  const allQuestions = await db
    .select({ status: questionsTable.status, courseId: questionsTable.courseId, faculty: coursesTable.faculty })
    .from(questionsTable)
    .leftJoin(coursesTable, eq(questionsTable.courseId, coursesTable.id));

  const approved = allQuestions.filter(q => q.status === "approved");
  const totalQuestions = approved.length;
  const totalSubmissions = allQuestions.length;
  const totalCourses = new Set(approved.map(q => q.courseId)).size;
  const totalColleges = new Set(approved.map(q => q.faculty).filter(Boolean)).size;

  res.json({ totalQuestions, totalSubmissions, totalCourses, totalColleges });
});

// ─── Course Analytics ─────────────────────────────────────────────────────────

router.get("/courses/:id/analytics", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح" }); return; }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) { res.status(404).json({ error: "المقرر غير موجود" }); return; }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(and(eq(questionsTable.courseId, id), eq(questionsTable.status, "approved")));

  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    res.json({
      course, totalQuestions: 0, chaptersCovered: 0,
      mostCommonType: "", dominantDifficulty: "",
      finalsChapterFrequency: [], midtermsChapterFrequency: [],
      chapterFrequency: [], typeDistribution: [],
      difficultyDistribution: [], yearlyFrequency: [],
      chaptersOverview: [], chapterDifficultyBreakdown: [],
      sourceLinks: [],
      recommendations: ["لم تتم الموافقة على أي أسئلة بعد. تحقق مرة أخرى لاحقاً!"],
    });
    return;
  }

  const chapterMap = new Map<string, number>();
  const typeMap = new Map<string, number>();
  const diffMap = new Map<string, number>();
  const yearExamMap = new Map<string, number>();
  const sourceLinks: { link: string; chapter: string; topic?: string }[] = [];

  const finalQuestions = questions.filter(q => q.examType === "فاينل");
  const midQuestions = questions.filter(q => q.examType === "ميد 1" || q.examType === "ميد 2");

  const finalChapterMap = new Map<string, number>();
  const midChapterMap = new Map<string, number>();

  for (const q of questions) {
    chapterMap.set(q.chapter, (chapterMap.get(q.chapter) ?? 0) + 1);
    typeMap.set(q.questionType, (typeMap.get(q.questionType) ?? 0) + 1);
    diffMap.set(q.difficulty, (diffMap.get(q.difficulty) ?? 0) + 1);
    const key = `${q.year} - ${q.examType}`;
    yearExamMap.set(key, (yearExamMap.get(key) ?? 0) + 1);
    if (q.sourceLink) sourceLinks.push({ link: q.sourceLink, chapter: q.chapter, topic: q.topic ?? undefined });
  }

  for (const q of finalQuestions) finalChapterMap.set(q.chapter, (finalChapterMap.get(q.chapter) ?? 0) + 1);
  for (const q of midQuestions) midChapterMap.set(q.chapter, (midChapterMap.get(q.chapter) ?? 0) + 1);

  const chaptersCovered = chapterMap.size;

  const chapterFrequency = Array.from(chapterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([chapter, cnt]) => ({ chapter, count: cnt, percentage: Math.round((cnt / totalQuestions) * 100) }));

  const finalsChapterFrequency = Array.from(finalChapterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([chapter, cnt]) => ({ chapter, count: cnt, percentage: Math.round((cnt / (finalQuestions.length || 1)) * 100) }));

  const midtermsChapterFrequency = Array.from(midChapterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([chapter, cnt]) => ({ chapter, count: cnt, percentage: Math.round((cnt / (midQuestions.length || 1)) * 100) }));

  const typeDistribution = Array.from(typeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([questionType, cnt]) => ({
      questionType, label: typeLabel[questionType] ?? questionType,
      count: cnt, percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const difficultyDistribution = Array.from(diffMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([difficulty, cnt]) => ({
      difficulty, label: diffLabel[difficulty] ?? difficulty,
      count: cnt, percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const yearlyFrequency = Array.from(yearExamMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, cnt]) => ({ period, count: cnt }));

  const mostCommonType = typeDistribution[0]?.label ?? "";
  const dominantDifficulty = difficultyDistribution[0]?.label ?? "";
  const mostRepeatedChapter = chapterFrequency[0]?.chapter ?? "";

  // Chapter overview + per-chapter difficulty breakdown
  const chapterDifficultyBreakdown: { chapter: string; easy: number; medium: number; hard: number; total: number }[] = [];
  const chaptersOverview = Array.from(chapterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([chapter, cnt]) => {
      const chapterQs = questions.filter(q => q.chapter === chapter);
      const chDiff = new Map<string, number>();
      for (const q of chapterQs) chDiff.set(q.difficulty, (chDiff.get(q.difficulty) ?? 0) + 1);
      const easy = (chDiff.get("سهل") ?? 0) + (chDiff.get("easy") ?? 0);
      const medium = (chDiff.get("متوسط") ?? 0) + (chDiff.get("medium") ?? 0);
      const hard = (chDiff.get("صعب") ?? 0) + (chDiff.get("hard") ?? 0);
      chapterDifficultyBreakdown.push({ chapter, easy, medium, hard, total: chapterQs.length });
      const diffEntries = Array.from(chDiff.entries()).sort((a, b) => b[1] - a[1]);
      const dominantDiff = diffLabel[diffEntries[0]?.[0] ?? ""] ?? "";
      const dominantDiffPct = Math.round(((diffEntries[0]?.[1] ?? 0) / chapterQs.length) * 100);
      return { chapter, count: cnt, percentage: Math.round((cnt / totalQuestions) * 100), dominantDifficulty: dominantDiff, dominantDiffPct };
    });

  const recommendations: string[] = [];
  if (chapterFrequency.length > 0) {
    const top = chapterFrequency.slice(0, 2);
    const pct = top.reduce((s, c) => s + c.percentage, 0);
    const names = top.map(c => c.chapter).join(" و ");
    recommendations.push(`ركّز على ${names} — يمثلان ${pct}% من الأسئلة`);
  }
  if (mostCommonType && dominantDifficulty) {
    recommendations.push(`الأسئلة غالباً من نوع "${mostCommonType}" بمستوى صعوبة "${dominantDifficulty}"`);
  }
  if (yearlyFrequency.length > 1) {
    const latest = yearlyFrequency[yearlyFrequency.length - 1];
    recommendations.push(`آخر اختبار (${latest.period}) احتوى على ${latest.count} سؤال`);
  }
  if (sourceLinks.length > 0) {
    recommendations.push(`يوجد ${sourceLinks.length} مصدر مشترك من قِبل زملائك — استفد منها!`);
  }

  res.json({
    course, totalQuestions, chaptersCovered,
    mostRepeatedChapter, mostCommonType, dominantDifficulty,
    finalsChapterFrequency, midtermsChapterFrequency,
    chapterFrequency, typeDistribution, difficultyDistribution,
    yearlyFrequency, chaptersOverview, chapterDifficultyBreakdown,
    sourceLinks, recommendations,
  });
});

// ─── Chapter Analytics ────────────────────────────────────────────────────────

router.get("/courses/:id/chapters/:chapter", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const chapter = decodeURIComponent(req.params.chapter as string);
  if (isNaN(id)) { res.status(400).json({ error: "معرف غير صالح" }); return; }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, id));
  if (!course) { res.status(404).json({ error: "المقرر غير موجود" }); return; }

  const questions = await db.select().from(questionsTable)
    .where(and(
      eq(questionsTable.courseId, id),
      eq(questionsTable.status, "approved"),
      eq(questionsTable.chapter, chapter),
    ))
    .orderBy(questionsTable.createdAt);

  const totalQuestions = questions.length;

  const diffMap = new Map<string, number>();
  const periodMap = new Map<string, number>();
  const sourceLinks: { link: string; topic?: string }[] = [];

  for (const q of questions) {
    diffMap.set(q.difficulty, (diffMap.get(q.difficulty) ?? 0) + 1);
    const key = `${q.year} - ${q.examType}`;
    periodMap.set(key, (periodMap.get(key) ?? 0) + 1);
    if (q.sourceLink) sourceLinks.push({ link: q.sourceLink, topic: q.topic ?? undefined });
  }

  const difficultyDistribution = Array.from(diffMap.entries())
    .map(([difficulty, cnt]) => ({
      difficulty, label: diffLabel[difficulty] ?? difficulty,
      count: cnt, percentage: Math.round((cnt / (totalQuestions || 1)) * 100),
    }));

  const frequencyByPeriod = Array.from(periodMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, count]) => ({ period, count }));

  // Model question
  const textMap = new Map<string, { question: typeof questions[0]; count: number }>();
  for (const q of questions) {
    if (q.text && q.text.trim()) {
      const key = q.text.trim().substring(0, 200);
      const existing = textMap.get(key);
      if (existing) { existing.count++; } else { textMap.set(key, { question: q, count: 1 }); }
    }
  }

  const repeated = Array.from(textMap.values()).filter(v => v.count > 1).sort((a, b) => b.count - a.count);

  let modelQuestion: typeof questions[0] | null = null;
  let modelQuestionType: "repeated" | "common_topic" | "random" = "random";
  let repeatCount = 1;

  if (repeated.length > 0) {
    modelQuestion = repeated[0].question;
    repeatCount = repeated[0].count;
    modelQuestionType = "repeated";
  } else if (questions.length > 0) {
    const topicMap = new Map<string, typeof questions>();
    for (const q of questions) {
      const topic = q.topic ?? "عام";
      if (!topicMap.has(topic)) topicMap.set(topic, []);
      topicMap.get(topic)!.push(q);
    }
    const sorted = Array.from(topicMap.entries()).sort((a, b) => b[1].length - a[1].length);
    modelQuestion = sorted[0]?.[1][0] ?? questions[0] ?? null;
    modelQuestionType = sorted.length > 0 && sorted[0][1].length > 1 ? "common_topic" : "random";
  }

  res.json({
    course, chapter, totalQuestions,
    difficultyDistribution, frequencyByPeriod,
    modelQuestion, modelQuestionType, repeatCount,
    questions, sourceLinks,
  });
});

export default router;
