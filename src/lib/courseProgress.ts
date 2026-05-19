import { supabase } from "./supabase";

type CourseModule = Record<string, any>;

export interface CourseProgressSummary {
  completedLessonIds: string[];
  passedQuizIds: string[];
  totalItems: number;
  completedItems: number;
  percent: number;
}

interface LoadCourseProgressArgs {
  userId: string;
  courseContent: CourseModule[];
}

interface SaveQuizResultArgs {
  userId: string;
  courseId: number | string;
  quizId: string;
  score: number;
  passed: boolean;
}

const emptyProgressResponse = { data: [], error: null };

export const getModuleLessons = (module: CourseModule) => (
  Array.isArray(module?.lessons) ? module.lessons : []
);

export const getModuleQuiz = (module: CourseModule) => {
  if (module?.quiz !== undefined) return module.quiz || null;
  if (Array.isArray(module?.quizzes)) return module.quizzes[0] || null;
  return module?.quizzes || null;
};

export const normalizeCourseModules = (modules: CourseModule[] = []): CourseModule[] => (
  modules.map((module) => {
    const rawQuiz = getModuleQuiz(module);
    const mappedLessons = getModuleLessons(module).map((lesson: any) => ({
      ...lesson,
      videoUrl: lesson.video_url || lesson.videoUrl,
      orderIndex: lesson.order_index ?? lesson.orderIndex,
    }));

    return {
      ...module,
      lessons: mappedLessons,
      quiz: rawQuiz ? {
        ...rawQuiz,
        passingGrade: rawQuiz.passing_grade ?? rawQuiz.passingGrade,
        duration: rawQuiz.duration_text ?? rawQuiz.duration,
        questions: rawQuiz.questions || rawQuiz.quiz_questions || [],
      } : null,
    };
  })
);

export const getCourseItemIds = (courseContent: CourseModule[] = []) => {
  const lessonIds = new Set<string>();
  const quizIds = new Set<string>();

  courseContent.forEach((module) => {
    getModuleLessons(module).forEach((lesson: any) => {
      if (lesson?.id) lessonIds.add(String(lesson.id));
    });

    const quiz = getModuleQuiz(module);
    if (quiz?.id) quizIds.add(String(quiz.id));
  });

  return {
    lessonIds: [...lessonIds],
    quizIds: [...quizIds],
  };
};

export const summarizeCourseProgress = (
  courseContent: CourseModule[] = [],
  completedLessonIds: string[] = [],
  passedQuizIds: string[] = []
): CourseProgressSummary => {
  const { lessonIds, quizIds } = getCourseItemIds(courseContent);
  const validLessonIds = new Set(lessonIds);
  const validQuizIds = new Set(quizIds);

  const completedLessons = [...new Set(completedLessonIds.map(String))]
    .filter((lessonId) => validLessonIds.has(lessonId));
  const passedQuizzes = [...new Set(passedQuizIds.map(String))]
    .filter((quizId) => validQuizIds.has(quizId));

  const totalItems = lessonIds.length + quizIds.length;
  const completedItems = completedLessons.length + passedQuizzes.length;
  const percent = totalItems === 0
    ? 0
    : Math.min(100, Math.round((completedItems / totalItems) * 100));

  return {
    completedLessonIds: completedLessons,
    passedQuizIds: passedQuizzes,
    totalItems,
    completedItems,
    percent,
  };
};

export const loadCourseProgress = async ({
  userId,
  courseContent,
}: LoadCourseProgressArgs): Promise<CourseProgressSummary> => {
  const { lessonIds, quizIds } = getCourseItemIds(courseContent);

  const [lessonRes, quizRes] = await Promise.all([
    lessonIds.length > 0
      ? supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds)
      : Promise.resolve(emptyProgressResponse),
    quizIds.length > 0
      ? supabase
          .from("quiz_results")
          .select("quiz_id")
          .eq("user_id", userId)
          .eq("passed", true)
          .in("quiz_id", quizIds)
      : Promise.resolve(emptyProgressResponse),
  ]);

  if (lessonRes.error) {
    console.error("Error loading lesson progress:", lessonRes.error);
  }

  if (quizRes.error) {
    console.error("Error loading quiz progress:", quizRes.error);
  }

  return summarizeCourseProgress(
    courseContent,
    lessonRes.error ? [] : (lessonRes.data || []).map((row: any) => row.lesson_id),
    quizRes.error ? [] : (quizRes.data || []).map((row: any) => row.quiz_id)
  );
};

const isMissingCourseIdError = (error: any) => {
  const message = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return message.includes("course_id") && (
    message.includes("column") ||
    message.includes("schema cache") ||
    message.includes("could not find")
  );
};

const pickBestQuizResult = (rows: any[] = []) => {
  return [...rows].sort((a, b) => {
    if (Boolean(a.passed) !== Boolean(b.passed)) return Boolean(b.passed) ? 1 : -1;
    return Number(b.score || 0) - Number(a.score || 0);
  })[0] || null;
};

const fetchExistingQuizResult = async (userId: string, quizId: string) => {
  const withCourseId = await supabase
    .from("quiz_results")
    .select("id, score, passed, course_id")
    .eq("user_id", userId)
    .eq("quiz_id", quizId);

  if (!withCourseId.error) return pickBestQuizResult(withCourseId.data || []);
  if (!isMissingCourseIdError(withCourseId.error)) throw withCourseId.error;

  const withoutCourseId = await supabase
    .from("quiz_results")
    .select("id, score, passed")
    .eq("user_id", userId)
    .eq("quiz_id", quizId);

  if (withoutCourseId.error) throw withoutCourseId.error;
  return pickBestQuizResult(withoutCourseId.data || []);
};

const updateQuizResult = async (
  resultId: string,
  courseId: number | string,
  score: number,
  passed: boolean
) => {
  const withCourseId = await supabase
    .from("quiz_results")
    .update({ score, passed, course_id: Number(courseId) })
    .eq("id", resultId);

  if (!withCourseId.error) return;

  const withoutCourseId = await supabase
    .from("quiz_results")
    .update({ score, passed })
    .eq("id", resultId);

  if (!withoutCourseId.error) return;
  throw isMissingCourseIdError(withCourseId.error) ? withoutCourseId.error : withCourseId.error;
};

const insertQuizResult = async ({
  userId,
  courseId,
  quizId,
  score,
  passed,
}: SaveQuizResultArgs) => {
  const payload = {
    user_id: userId,
    course_id: Number(courseId),
    quiz_id: quizId,
    score,
    passed,
  };

  const withCourseId = await supabase.from("quiz_results").insert(payload);
  if (!withCourseId.error) return;

  if (!isMissingCourseIdError(withCourseId.error)) throw withCourseId.error;

  const { course_id: _courseId, ...fallbackPayload } = payload;
  const withoutCourseId = await supabase.from("quiz_results").insert(fallbackPayload);
  if (withoutCourseId.error) throw withoutCourseId.error;
};

export const saveQuizResult = async ({
  userId,
  courseId,
  quizId,
  score,
  passed,
}: SaveQuizResultArgs) => {
  const existingResult = await fetchExistingQuizResult(userId, quizId);

  if (existingResult) {
    const bestScore = Math.max(score, Number(existingResult.score || 0));
    const finalPassed = passed || Boolean(existingResult.passed);
    await updateQuizResult(existingResult.id, courseId, bestScore, finalPassed);
    return { score: bestScore, passed: finalPassed };
  }

  await insertQuizResult({ userId, courseId, quizId, score, passed });
  return { score, passed };
};
