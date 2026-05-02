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
  // Sample course content for immediate testing
  101: {
    courseId: 101,
    weeks: [
      {
        id: 1,
        title: "Introduction to Sustainable Farming",
        description: "Learn the basics of sustainable agriculture practices",
        lessons: [
          {
            id: "1-1",
            title: "What is Sustainable Farming?",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Sample video
            transcript: "Sustainable farming is a method of agriculture that focuses on producing food in a way that preserves the environment, supports local communities, and ensures long-term viability.",
            resources: [
              { title: "Sustainable Farming Guide", url: "#", type: "PDF" }
            ]
          },
          {
            id: "1-2",
            title: "Soil Health Fundamentals",
            type: "text",
            duration: "10 mins",
            content: "Healthy soil is the foundation of sustainable farming. Learn about soil composition, testing methods, and maintenance practices that ensure long-term productivity.",
            transcript: "Soil health is crucial for sustainable agriculture. Understanding soil composition helps farmers make informed decisions about crop rotation and fertilization."
          }
        ],
        quiz: {
          id: "week-1-quiz",
          title: "Sustainable Farming Basics Quiz",
          description: "Test your understanding of sustainable farming principles",
          passingGrade: 2,
          duration: "10 mins",
          questions: [
            {
              id: "q1",
              question: "What is the primary goal of sustainable farming?",
              type: "multiple-choice",
              options: [
                "Maximize short-term profits",
                "Preserve the environment and ensure long-term viability",
                "Use as many chemicals as possible",
                "Focus only on crop yield"
              ],
              correctAnswer: "Preserve the environment and ensure long-term viability"
            },
            {
              id: "q2",
              question: "Why is soil health important for sustainable farming?",
              type: "text",
              correctAnswer: "Healthy soil ensures long-term productivity and environmental preservation"
            }
          ]
        }
      },
      {
        id: 2,
        title: "Crop Rotation and Biodiversity",
        description: "Understanding the importance of crop diversity",
        lessons: [
          {
            id: "2-1",
            title: "Benefits of Crop Rotation",
            type: "video",
            duration: "12 mins",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            transcript: "Crop rotation helps maintain soil fertility, reduce pest pressure, and improve overall farm productivity.",
            resources: [
              { title: "Crop Rotation Planner", url: "#", type: "Tool" }
            ]
          }
        ],
        quiz: {
          id: "week-2-quiz",
          title: "Crop Rotation Quiz",
          description: "Test your knowledge of crop rotation practices",
          passingGrade: 1,
          duration: "5 mins",
          questions: [
            {
              id: "q1",
              question: "What is one major benefit of crop rotation?",
              type: "multiple-choice",
              options: [
                "Increases soil erosion",
                "Maintains soil fertility",
                "Reduces biodiversity",
                "Increases pest populations"
              ],
              correctAnswer: "Maintains soil fertility"
            }
          ]
        }
      }
    ]
  },
  // Keep empty arrays for other courses as fallback
  1: { courseId: 1, weeks: [] },
  2: { courseId: 2, weeks: [] },
  3: { courseId: 3, weeks: [] },
  4: { courseId: 4, weeks: [] },
  5: { courseId: 5, weeks: [] },
};