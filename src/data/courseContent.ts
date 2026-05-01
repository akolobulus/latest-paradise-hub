
export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration?: string;
  content?: string;
  videoUrl?: string;
  isCompleted?: boolean;
  transcript?: string;
  resources?: { title: string; url: string; type: string }[];
}

export interface Week {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz?: Quiz;
  isLocked?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'link';
  options?: string[];
  correctAnswer?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingGrade: number;
  duration: string; // e.g. "1 Week" or "30 mins"
}

export interface CourseContent {
  courseId: number;
  weeks: Week[];
}

export const COURSE_CONTENTS: Record<number, CourseContent> = {
  // Hardcoded content removed - all course content now comes from Supabase
  // Keep this file for TypeScript type definitions and as a fallback only
  1: { courseId: 1, weeks: [] },
  2: { courseId: 2, weeks: [] },
  3: { courseId: 3, weeks: [] },
  4: { courseId: 4, weeks: [] },
  5: { courseId: 5, weeks: [] },
  101: { courseId: 101, weeks: [] }, // Demo course
};
          { id: "5-2", title: "Building Your First App", type: 'text', content: "Step-by-step guide to creating a simple application..." },
        ]
      }
    ]
  }
};
