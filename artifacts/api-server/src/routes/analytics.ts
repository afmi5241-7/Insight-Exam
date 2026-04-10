import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";

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
  // legacy
  multiple_choice: "اختيار من متعدد",
  true_false: "صح وخطأ",
  essay: "مقالي",
  fill_blank: "أكمل الفراغ",
};

const diffLabel: Record<string, string> = {
  easy: "سهل",
  medium: "متوسط",
  hard: "صعب",
  "سهل": "سهل",
  "متوسط": "متوسط",
  "صعب": "صعب",
};

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
      course,
      totalQuestions: 0,
      mostRepeatedChapter: "",
      mostCommonType: "",
      dominantDifficulty: "",
      chapterFrequency: [],
      typeDistribution: [],
      difficultyDistribution: [],
      yearlyFrequency: [],
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

  for (const q of questions) {
    chapterMap.set(q.chapter, (chapterMap.get(q.chapter) ?? 0) + 1);
    typeMap.set(q.questionType, (typeMap.get(q.questionType) ?? 0) + 1);
    diffMap.set(q.difficulty, (diffMap.get(q.difficulty) ?? 0) + 1);
    const key = `${q.year} - ${q.examType}`;
    yearExamMap.set(key, (yearExamMap.get(key) ?? 0) + 1);
    if (q.sourceLink) {
      sourceLinks.push({ link: q.sourceLink, chapter: q.chapter, topic: q.topic ?? undefined });
    }
  }

  const chapterFrequency = Array.from(chapterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([chapter, cnt]) => ({ chapter, count: cnt, percentage: Math.round((cnt / totalQuestions) * 100) }));

  const typeDistribution = Array.from(typeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([questionType, cnt]) => ({
      questionType,
      label: typeLabel[questionType] ?? questionType,
      count: cnt,
      percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const difficultyDistribution = Array.from(diffMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([difficulty, cnt]) => ({
      difficulty,
      label: diffLabel[difficulty] ?? difficulty,
      count: cnt,
      percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const yearlyFrequency = Array.from(yearExamMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, cnt]) => ({ period, count: cnt }));

  const mostRepeatedChapter = chapterFrequency[0]?.chapter ?? "";
  const mostCommonType = typeDistribution[0]?.label ?? "";
  const dominantDifficulty = difficultyDistribution[0]?.label ?? "";

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
    course,
    totalQuestions,
    mostRepeatedChapter,
    mostCommonType,
    dominantDifficulty,
    chapterFrequency,
    typeDistribution,
    difficultyDistribution,
    yearlyFrequency,
    sourceLinks,
    recommendations,
  });
});

export default router;
