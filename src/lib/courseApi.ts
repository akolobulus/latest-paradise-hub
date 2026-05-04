import { supabase } from './supabase';

const courseCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; 

export async function fetchCourseContent(courseId: string | number) {
  console.log(`[🔍 API] Attempting to fetch content for Course ID:`, courseId);
  console.log(`[🔍 API] Type of Course ID:`, typeof courseId);

  try {
    const now = Date.now();
    const cached = courseCache.get(String(courseId));

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      console.log("[⚡ CACHE] Returned course from memory cache!");
      return cached.data;
    }

    console.log("[📡 SUPABASE] Fetching fresh data from database...");
    
    const response = await supabase
      .from('modules')
      .select(`
        id, course_id, title, description, order_index,
        lessons ( id, title, type, content, video_url, duration, transcript, order_index, resources(title, url, type:resource_type) ),
        quizzes ( id, title, description, passing_grade, duration_text, quiz_questions(id, question, type, options, correct_answer) )
      `)
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    console.log('[RAW SUPABASE RESPONSE]', response);

    const { data, error } = response;

    if (error) {
      console.error("[❌ SUPABASE ERROR] Something went wrong:", error);
      throw error;
    }

    console.log(`[✅ SUPABASE SUCCESS] Found ${data?.length || 0} modules for this course.`);

    if (data && data.length > 0) {
      courseCache.set(String(courseId), { data, timestamp: now });
    }
    
    return data;
  } catch (error) {
    console.error("[🚨 FATAL ERROR] in fetchCourseContent:", error);
    return null;
  }
}
