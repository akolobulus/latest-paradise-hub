import { supabase } from "./supabase";

export async function fetchCourseContent(courseId: number) {
  // Use Supabase's powerful nested queries to get everything at once
  const { data, error } = await supabase
    .from('modules')
    .select(`
      id,
      title,
      description,
      order_index,
      lessons (
        id,
        title,
        type,
        content,
        video_url,
        duration,
        transcript,
        order_index,
        resources (
          title,
          url,
          resource_type
        )
      ),
      quizzes (
        id,
        title,
        description,
        passing_grade,
        duration_text,
        quiz_questions (
          id,
          question,
          type,
          options,
          correct_answer,
          order_index
        )
      )
    `)
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error("Error fetching course content:", error);
    return null;
  }

  // Map the database structure back to the exact format your UI expects
  return data.map((module: any) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    lessons: (module.lessons || [])
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        content: lesson.content,
        videoUrl: lesson.video_url,
        duration: lesson.duration,
        transcript: lesson.transcript,
        resources: (lesson.resources || []).map((r: any) => ({ 
          title: r.title, 
          url: r.url, 
          type: r.resource_type 
        }))
      })),
    quiz: module.quizzes && module.quizzes.length > 0 ? {
      id: module.quizzes[0].id,
      title: module.quizzes[0].title,
      description: module.quizzes[0].description,
      passingGrade: module.quizzes[0].passing_grade,
      duration: module.quizzes[0].duration_text,
      questions: (module.quizzes[0].quiz_questions || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((q: any) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correct_answer
        }))
    } : undefined
  }));
}
