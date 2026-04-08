import { Router, type IRouter } from "express";
import { db, questionsTable, coursesTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import { GetCourseAnalyticsParams } from "@workspace/api-zod";

const router: IRouter = Router();

function requireAuth(req: any, res: any): number | null {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "غير مصرح" });
    return null;
  }
  return userId;
}

router.get("/courses/:id/analytics", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetCourseAnalyticsParams.safeParse({ id: raw });
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
    .where(eq(questionsTable.courseId, params.data.id));

  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    res.json({
      totalQuestions: 0,
      mostRepeatedChapter: "",
      mostCommonType: "",
      dominantDifficulty: "",
      chapterFrequency: [],
      typeDistribution: [],
      difficultyDistribution: [],
      yearlyFrequency: [],
      recommendations: ["أضف أسئلة للمقرر لبدء التحليل"],
    });
    return;
  }

  const chapterMap = new Map<string, number>();
  const typeMap = new Map<string, number>();
  const diffMap = new Map<string, number>();
  const yearMap = new Map<string, number>();

  for (const q of questions) {
    chapterMap.set(q.chapter, (chapterMap.get(q.chapter) ?? 0) + 1);
    typeMap.set(q.questionType, (typeMap.get(q.questionType) ?? 0) + 1);
    diffMap.set(q.difficulty, (diffMap.get(q.difficulty) ?? 0) + 1);
    yearMap.set(q.examPeriod, (yearMap.get(q.examPeriod) ?? 0) + 1);
  }

  const chapterFrequency = Array.from(chapterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([chapter, cnt]) => ({
      chapter,
      count: cnt,
      percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const typeDistribution = Array.from(typeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([questionType, cnt]) => ({
      questionType,
      count: cnt,
      percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const difficultyDistribution = Array.from(diffMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([difficulty, cnt]) => ({
      difficulty,
      count: cnt,
      percentage: Math.round((cnt / totalQuestions) * 100),
    }));

  const yearlyFrequency = Array.from(yearMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([examPeriod, cnt]) => ({
      examPeriod,
      count: cnt,
    }));

  const mostRepeatedChapter = chapterFrequency[0]?.chapter ?? "";
  const mostCommonType = typeDistribution[0]?.questionType ?? "";
  const dominantDifficulty = difficultyDistribution[0]?.difficulty ?? "";

  const recommendations: string[] = [];

  if (chapterFrequency.length > 0) {
    const topChapters = chapterFrequency.slice(0, 2);
    const topPct = topChapters.reduce((s, c) => s + c.percentage, 0);
    const names = topChapters.map(c => c.chapter).join(" و ");
    recommendations.push(`ركز على ${names} حيث يمثلان ${topPct}% من الأسئلة`);
  }

  if (mostCommonType && dominantDifficulty) {
    const typeLabel: Record<string, string> = {
      multiple_choice: "اختيار من متعدد",
      true_false: "صح وخطأ",
      essay: "مقالي",
      fill_blank: "أكمل الفراغ",
    };
    const diffLabel: Record<string, string> = {
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
    };
    recommendations.push(
      `الأسئلة غالباً من نوع ${typeLabel[mostCommonType] ?? mostCommonType} بمستوى صعوبة ${diffLabel[dominantDifficulty] ?? dominantDifficulty}`
    );
  }

  if (yearlyFrequency.length > 1) {
    const latest = yearlyFrequency[yearlyFrequency.length - 1];
    recommendations.push(`آخر اختبار في ${latest.examPeriod} احتوى على ${latest.count} سؤال`);
  }

  res.json({
    totalQuestions,
    mostRepeatedChapter,
    mostCommonType,
    dominantDifficulty,
    chapterFrequency,
    typeDistribution,
    difficultyDistribution,
    yearlyFrequency,
    recommendations,
  });
});

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const userId = requireAuth(req, res);
  if (!userId) return;

  const coursesWithCount = await db
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

  const totalCourses = coursesWithCount.length;
  const totalQuestions = coursesWithCount.reduce((s, c) => s + Number(c.questionCount), 0);
  const recentCourses = coursesWithCount.slice(-5).reverse();

  res.json({
    totalCourses,
    totalQuestions,
    recentCourses,
  });
});

export default router;
