
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
  1: { // Sustainable Farm Management
    courseId: 1,
    weeks: [
      {
        id: 1,
        title: "Week 1: Introduction to Sustainable Farming",
        description: "Core concepts of modern agriculture.",
        lessons: [
          { 
            id: "1-1", 
            title: "What is Sustainable Agriculture?", 
            type: 'video', 
            videoUrl: "https://www.youtube.com/watch?v=f39v_p6887k", 
            duration: "10:00",
            transcript: "Sustainable agriculture is the practice of farming using principles of ecology...",
            resources: [{ title: "Farming Basics PDF", url: "#", type: "pdf" }]
          },
          { id: "1-2", title: "Soil Health and Management", type: 'text', content: "Soil is the foundation of any successful farm..." },
        ],
        quiz: {
          id: "q1",
          title: "Week 1 Assessment",
          description: "Test your knowledge of farming fundamentals.",
          questions: [
            { id: "q1-1", question: "What is the primary goal of sustainable farming?", type: 'multiple-choice', options: ["Protect the environment", "Use more chemicals", "Ignore soil health"], correctAnswer: "Protect the environment" }
          ],
          passingGrade: 1,
          duration: "30 mins"
         }
      }
    ]
  },
  2: { // AI-Powered Business Automation
    courseId: 2,
    weeks: [
      {
        id: 1,
        title: "Week 1: AI Fundamentals",
        description: "Understanding LLMs and automation.",
        lessons: [
          { id: "2-1", title: "Introduction to Generative AI", type: 'video', videoUrl: "https://www.youtube.com/watch?v=G2fqAlgmoPo", duration: "15:00" },
          { id: "2-2", title: "Prompt Engineering Basics", type: 'text', content: "Learn how to communicate effectively with AI models..." },
        ]
      }
    ]
  },
  3: { // Agro-Tech Innovation
    courseId: 3,
    weeks: [
      {
        id: 1,
        title: "Week 1: IoT in Agriculture",
        description: "Connecting the farm to the cloud.",
        lessons: [
          { id: "3-1", title: "Sensors and Data Collection", type: 'video', videoUrl: "https://www.youtube.com/watch?v=f39v_p6887k", duration: "12:00" },
          { id: "3-2", title: "Automated Irrigation Systems", type: 'text', content: "How to save water and time with IoT..." },
        ]
      }
    ]
  },
  4: { // Agri Value Chain Optimization
    courseId: 4,
    weeks: [
      {
        id: 1,
        title: "Week 1: Value Chain Basics",
        description: "Introduction to agricultural logistics.",
        lessons: [
          { id: "4-1", title: "Understanding the Value Chain", type: 'video', videoUrl: "https://www.youtube.com/watch?v=f39v_p6887k", duration: "10:00" },
          { id: "4-2", title: "Market Analysis for Farmers", type: 'text', content: "How to identify profitable markets for your produce..." },
        ]
      }
    ]
  },
  5: { // Low-Code App Development
    courseId: 5,
    weeks: [
      {
        id: 1,
        title: "Week 1: Platform Overview",
        description: "Choosing the right low-code tool.",
        lessons: [
          { id: "5-1", title: "Introduction to Low-Code", type: 'video', videoUrl: "https://www.youtube.com/watch?v=6m_S_7Gv6vI", duration: "15:00" },
          { id: "5-2", title: "Building Your First App", type: 'text', content: "Step-by-step guide to creating a simple application..." },
        ]
      }
    ]
  }
};
