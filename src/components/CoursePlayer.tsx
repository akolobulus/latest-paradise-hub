import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Play, 
  FileText, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  Search,
  X,
  MessageSquare,
  Clock,
  HelpCircle,
  Trophy,
  AlertCircle,
  Menu,
  GraduationCap,
  Users,
  User
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { Week, Lesson, Quiz } from "@/src/data/courseContent";
import { fetchCourseContent } from "@/src/lib/courseApi";
import { supabase } from "@/src/lib/supabase";
import { ProfileData } from "@/src/lib/profileCompletion";

interface CoursePlayerProps {
  course: any;
  userProfile?: ProfileData | null;
  onBack: () => void;
  onLogoClick?: () => void;
  onAwardPoints: (amount: number) => void;
  onViewProfile?: () => void;
  onViewCommunity?: () => void;
  onViewLearning?: () => void;
  onLogout?: () => void;
}

export default function CoursePlayer({ course, userProfile, onBack, onLogoClick, onAwardPoints, onViewProfile, onViewCommunity, onViewLearning, onLogout }: CoursePlayerProps) {
  // Dynamic database content
  const [dbContent, setDbContent] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  
  // User profile data
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Safely map Supabase snake_case data into the camelCase format React expects
  const content = { 
    weeks: dbContent.map(week => {
      const rawQuiz = Array.isArray(week.quizzes) ? (week.quizzes[0] || null) : (week.quizzes || null);
      const mappedLessons = (week.lessons || []).map((lesson: any) => ({
        ...lesson,
        videoUrl: lesson.video_url || lesson.videoUrl,
        orderIndex: lesson.order_index ?? lesson.orderIndex,
      }));

      return {
        ...week,
        lessons: mappedLessons,
        quiz: rawQuiz ? {
          ...rawQuiz,
          passingGrade: rawQuiz.passing_grade,
          duration: rawQuiz.duration_text,
          questions: rawQuiz.quiz_questions || [] 
        } : null
      };
    }) 
  };
  
  const [activeWeek, setActiveWeek] = useState<number>(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  
  // Mobile Responsiveness States
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Comment state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Get current user session and profile
  useEffect(() => {
    const setupUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoadingProfile(false);
          return;
        }
        
        setSession({ user });
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    setupUser();
  }, []);
  
  const getInitials = (name: string | undefined) => {
    if (!name) return "L";
    const parts = name.split(" ");
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  // Fetch Course Content from Supabase (Dynamically handles course 101, 102, 103!)
  useEffect(() => {
    const loadContent = async () => {
      setIsLoadingContent(true);
      try {
        const dbData = await fetchCourseContent(course.id);
        if (dbData && dbData.length > 0) {
          setDbContent(dbData);
          
          // CRITICAL: Reset the player state when switching courses!
          const firstModule = dbData[0];
          const firstLesson = Array.isArray(firstModule.lessons) ? firstModule.lessons[0] : null;
          const rawFirstQuiz = Array.isArray(firstModule.quizzes) ? (firstModule.quizzes[0] || null) : (firstModule.quizzes || null);
          const hasFirstQuiz = Boolean(rawFirstQuiz);

          setActiveLesson(firstLesson || null);
          setActiveWeek(0);
          setShowQuiz(!firstLesson && hasFirstQuiz);
          setQuizResult(null);
          setExpandedWeeks([String(firstModule.id)]);
        } else {
          setDbContent([]);
        }
      } catch (error) {
        console.error("Error loading course content:", error);
        setDbContent([]);
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadContent();
  }, [course.id]);

  // Load user progress from database
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!session?.user?.id) return;

      try {
        // Load completed lessons
        const { data: lessonProgress, error: lessonError } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', session.user.id)
          .eq('course_id', course.id);

        if (lessonError) {
          console.error('Error loading lesson progress:', lessonError);
        } else if (lessonProgress) {
          setCompletedLessons(lessonProgress.map(lp => lp.lesson_id));
        }

        const { data: quizResults, error: quizError } = await supabase
          .from('quiz_results')
          .select('quiz_id')
          .eq('user_id', session.user.id)
          .eq('passed', true);

        if (quizError) {
          console.error('Error loading quiz results:', quizError);
        } else if (quizResults) {
          setPassedQuizzes(quizResults.map(qr => qr.quiz_id));
        }
      } catch (error) {
        console.error('Error loading user progress:', error);
      }
    };

    loadUserProgress();
  }, [session?.user?.id, course.id]);

  const loadComments = async (lessonId: string) => {
    setCommentError(null);

    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('lesson_comments')
        .select('id, lesson_id, user_id, content, created_at, profiles(id, full_name, avatar_url)')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setCommentError('Unable to load comments.');
      setComments([]);
    }
  };

  useEffect(() => {
    if (!activeLesson) {
      setComments([]);
      return;
    }
    loadComments(activeLesson.id);
  }, [activeLesson?.id]);

  // Handle Mobile Resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
        setShowMobileSidebar(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks(prev => 
      prev.includes(String(weekId)) 
        ? prev.filter(id => id !== String(weekId)) 
        : [...prev, String(weekId)]
    );
  };

  const handleLessonComplete = async () => {
    if (activeLesson && !completedLessons.includes(activeLesson.id)) {
      try {
        if (session) {
          const { error } = await supabase.from('lesson_progress').insert({
            user_id: session.user.id,
            course_id: course.id,
            lesson_id: activeLesson.id
          });
          if (error) throw error;

          await supabase.rpc('increment_points', { 
            amount: 50, 
            row_id: session.user.id 
          });
        }

        setCompletedLessons(prev => [...prev, activeLesson.id]);
        onAwardPoints(50); 
      } catch (error) {
        console.error('Error marking lesson complete:', error);
        setCompletedLessons(prev => [...prev, activeLesson.id]);
        onAwardPoints(50);
      }
    }
  };

  const parseDurationToSeconds = (durationText?: string): number => {
    if (!durationText) return 600;
    const normalized = durationText.toLowerCase().trim();
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    const value = match ? Number(match[1]) : 10;
    if (normalized.includes('hour') || normalized.includes('hr')) return Math.round(value * 3600);
    if (normalized.includes('min')) return Math.round(value * 60);
    if (normalized.includes('sec')) return Math.round(value);
    return Math.round(value * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer Effect
  useEffect(() => {
    if (!showQuiz || quizStarted) return;
    setRemainingSeconds(parseDurationToSeconds(activeQuiz?.duration));
  }, [showQuiz, activeWeek, quizStarted]);

  useEffect(() => {
    if (!quizStarted || quizResult) return;
    if (remainingSeconds <= 0) {
      if (activeQuiz) {
        handleQuizSubmit(activeQuiz);
      }
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds(prev => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quizStarted, remainingSeconds, quizResult]);

  const isQuestionAnswered = (q: any) => {
    const answer = quizAnswers[q.id];
    if (!answer) return false;
    if (q.type === 'text' || q.type === 'link') {
      return answer.trim().length > 0;
    }
    return true;
  };

  const areAllQuestionsAnswered = (questions: any[] = []) => {
    return questions.length > 0 && questions.every(isQuestionAnswered);
  };

  useEffect(() => {
    if (showQuiz) {
      setCurrentQuestionIndex(0);
    }
  }, [showQuiz, activeWeek]);

  // THE MASTER QUIZ LOGIC
  const handleQuizSubmit = async (quiz: any) => {
    let score = 0;
    quiz.questions.forEach((q: any) => {
      if (q.type === 'multiple-choice' && quizAnswers[q.id] === q.correct_answer) {
        score++;
      } else if (q.type === 'text' && quizAnswers[q.id]?.length > 0) {
        score++; 
      } else if (q.type === 'link' && quizAnswers[q.id]?.startsWith('http')) {
        score++;
      }
    });

    const passThreshold = Math.ceil(quiz.questions.length * 0.8);
    const passed = score >= passThreshold;
    
    setQuizResult({ score, passed });
    
    if (session) {
      try {
        const { data: existingResult } = await supabase
          .from('quiz_results')
          .select('id, score, passed')
          .eq('user_id', session.user.id)
          .eq('quiz_id', quiz.id)
          .single();

        if (existingResult) {
          if (score > existingResult.score) {
            await supabase
              .from('quiz_results')
              .update({ 
                score: score, 
                passed: passed || existingResult.passed 
              })
              .eq('id', existingResult.id);
          }
        } else {
          await supabase.from('quiz_results').insert({
            user_id: session.user.id,
            quiz_id: quiz.id,
            score: score,
            passed: passed
          });
          
          if (passed) {
            await supabase.rpc('increment_points', { amount: 200, row_id: session.user.id });
          }
        }

        if (passed && !passedQuizzes.includes(quiz.id)) {
          setPassedQuizzes(prev => [...prev, quiz.id]);
          onAwardPoints(200); 
        }
      } catch (error) {
        console.error('Error saving quiz result:', error);
        if (passed && !passedQuizzes.includes(quiz.id)) {
          setPassedQuizzes(prev => [...prev, quiz.id]);
        }
      }
    } else {
      if (passed && !passedQuizzes.includes(quiz.id)) {
        setPassedQuizzes(prev => [...prev, quiz.id]);
      }
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !session?.user?.id || !activeLesson) return;
    setCommentError(null);
    setIsSubmittingComment(true);

    try {
      const { error } = await supabase
        .from('lesson_comments')
        .insert({
          lesson_id: activeLesson.id,
          user_id: session.user.id,
          content: newComment.trim(),
        });

      if (error) throw error;
      await loadComments(activeLesson.id);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setCommentError('Unable to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const isWeekLocked = (weekIndex: number) => {
    if (weekIndex === 0) return false;
    const prevWeek = content.weeks[weekIndex - 1];
    return !prevWeek.quiz || !passedQuizzes.includes(prevWeek.quiz.id);
  };

  const totalItems = content.weeks.reduce((acc, w) => acc + w.lessons.length + (w.quiz ? 1 : 0), 0);
  const completedItems = completedLessons.length + passedQuizzes.length;
  const progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const activeQuiz = content.weeks[activeWeek]?.quiz;
  const safeQuestionIndex = Math.max(0, Math.min(currentQuestionIndex, (activeQuiz?.questions?.length ?? 1) - 1));
  const currentQuestion = activeQuiz?.questions?.[safeQuestionIndex];

  const getAllLessons = () => {
    const lessons: { lesson: Lesson; weekIndex: number; lessonIndex: number }[] = [];
    content.weeks.forEach((week, weekIndex) => {
      week.lessons.forEach((lesson, lessonIndex) => {
        lessons.push({ lesson, weekIndex, lessonIndex });
      });
    });
    return lessons;
  };

  const getCurrentLessonIndex = () => {
    if (!activeLesson) return -1;
    const allLessons = getAllLessons();
    return allLessons.findIndex(item => item.lesson.id === activeLesson.id);
  };

  const navigateToLesson = (lessonIndex: number) => {
    const allLessons = getAllLessons();
    if (lessonIndex >= 0 && lessonIndex < allLessons.length) {
      const { lesson, weekIndex } = allLessons[lessonIndex];
      setActiveLesson(lesson);
      setActiveWeek(weekIndex);
      setShowQuiz(false);
      setQuizResult(null);
      setExpandedWeeks(prev => 
        prev.includes(String(content.weeks[weekIndex].id)) 
          ? prev 
          : [...prev, String(content.weeks[weekIndex].id)]
      );
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      navigateToLesson(currentIndex - 1);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    const allLessons = getAllLessons();
    if (currentIndex < allLessons.length - 1) {
      navigateToLesson(currentIndex + 1);
    }
  };

  if (isLoadingContent) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (content.weeks.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white gap-4">
        <h2 className="text-2xl font-bold text-ink">Course Content Coming Soon</h2>
        <button onClick={onBack} className="px-6 py-2 bg-primary text-white rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* DESKTOP Sidebar */}
      {!isMobile && (
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 350 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="border-r border-gray-100 flex flex-col bg-gray-50 relative z-[70] hidden lg:flex"
      >
        <div className={cn("border-b border-gray-100 bg-white transition-all", isSidebarOpen ? "p-6" : "p-3")}>
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            {isSidebarOpen && (
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="flex items-center gap-2 mb-6">
                <BrandLogo
                  wrapperClassName="w-8 h-8 rounded-lg shadow-inner"
                  imgClassName="w-full h-full"
                  onClick={onLogoClick}
                />
                <button onClick={onLogoClick} className="text-left">
                  <span className="font-display font-bold text-xl tracking-tight text-ink">
                    Paradise <span className="text-primary">Hub</span>
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>Course Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className={cn("flex-1 overflow-y-auto custom-scrollbar transition-all", isSidebarOpen ? "p-4 space-y-4" : "p-2 space-y-2")}>
          {content.weeks.map((week, idx) => {
            const locked = isWeekLocked(idx);
            const isExpanded = expandedWeeks.includes(String(week.id));
            const weekLessons = week.lessons.map(l => l.id);
            const weekCompleted = weekLessons.filter(id => completedLessons.includes(id)).length;
            const weekTotal = weekLessons.length + (week.quiz ? 1 : 0);
            const weekPassed = week.quiz && passedQuizzes.includes(week.quiz.id) ? 1 : 0;
            const weekProgress = Math.round(((weekCompleted + weekPassed) / weekTotal) * 100);
            
            return (
              <div key={week.id} className={cn("bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow", isSidebarOpen ? "rounded-2xl" : "rounded-lg")}>
                <button 
                  onClick={() => !locked && toggleWeek(String(week.id))}
                  className={cn("w-full flex items-center justify-between transition-colors", isSidebarOpen ? "p-4 text-left" : "p-2 justify-center", locked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50")}
                  title={week.title}
                >
                  {isSidebarOpen ? (
                    <>
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Module {idx + 1}</span>
                          {locked && <Lock size={12} className="text-gray-400" />}
                        </div>
                        <h4 className="text-sm font-bold text-ink leading-tight mb-2">{week.title}</h4>
                        {!locked && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary/40" style={{ width: `${weekProgress}%` }} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-400">{weekProgress}%</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-bold text-primary">M{idx + 1}</span>
                      <div className="w-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/40" style={{ width: "100%", height: `${weekProgress}%` }} />
                      </div>
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && !locked && isSidebarOpen && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-gray-50"
                    >
                      <div className="p-2 space-y-1">
                        {week.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setActiveLesson(lesson);
                              setActiveWeek(idx);
                              setShowQuiz(false);
                              setQuizResult(null);
                            }}
                            className={cn(
                              "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left",
                              activeLesson?.id === lesson.id && !showQuiz ? "bg-primary/5 text-primary" : "hover:bg-gray-50 text-gray-600"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", completedLessons.includes(lesson.id) ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")}> 
                              {lesson.type === 'video' ? <Play size={14} fill="currentColor" /> : <FileText size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{lesson.title}</p>
                              {lesson.duration && <span className="text-[10px] opacity-60">{lesson.duration}</span>}
                            </div>
                            {completedLessons.includes(lesson.id) && <CheckCircle2 size={14} className="text-green-600" />}
                          </button>
                        ))}
                        
                        {week.quiz && (
                          <button
                            onClick={() => {
                              setShowQuiz(true);
                              setActiveLesson(null);
                              setActiveWeek(idx);
                              setQuizResult(null);
                              setQuizAnswers({});
                              setQuizStarted(false);
                              setCurrentQuestionIndex(0);
                              setRemainingSeconds(parseDurationToSeconds(week.quiz?.duration));
                            }}
                            className={cn(
                              "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left mt-2 border-t border-gray-50",
                              showQuiz && activeWeek === idx ? "bg-primary/5 text-primary" : "hover:bg-gray-50 text-gray-600"
                            )}
                          >
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", passedQuizzes.includes(week.quiz.id) ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary")}> 
                              <HelpCircle size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{week.quiz.title}</p>
                              <span className="text-[10px] opacity-60">Assessment</span>
                            </div>
                            {passedQuizzes.includes(week.quiz.id) && <CheckCircle2 size={14} className="text-green-600" />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-white w-full">
        {/* Header */}
        {!isMobile && (
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-primary text-white shrink-0">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-white/10 transition-colors"
              >
                {isSidebarOpen ? "<<" : ">>"}
              </button>
              <h2 className="font-bold text-xs sm:text-sm md:text-base truncate max-w-[200px] sm:max-w-md">{course.title}</h2>
            </div>
            <div className="flex items-center gap-6">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} onClick={onBack} />
              </button>
            </div>
          </header>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white shrink-0 sticky top-0 z-[100]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
                <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
                <span className="font-display font-bold text-xl tracking-tight hidden xs:block">
                  Paradise <span className="text-primary">Hub</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className="p-2 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <Menu size={22} />
                </button>

                <AnimatePresence>
                  {showMobileSidebar && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMobileSidebar(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                      >
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setShowMobileSidebar(false);
                              onViewLearning?.();
                            }}
                            className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-bold text-ink">Learning</span>
                            <GraduationCap size={20} className="text-primary" />
                          </button>

                          <button
                            onClick={() => {
                              setShowMobileSidebar(false);
                              onViewCommunity?.();
                            }}
                            className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-bold text-ink">Incubation</span>
                            <Users size={20} className="text-primary" />
                          </button>

                          <button onClick={() => { setShowMobileSidebar(false); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-ink">Rewards</span>
                            <span className="text-sm text-gray-500">0 points</span>
                          </button>

                          <button onClick={() => { setShowMobileSidebar(false); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-ink">Support</span>
                            <HelpCircle size={20} className="text-primary" />
                          </button>

                          <button onClick={() => { setShowMobileSidebar(false); onViewProfile?.(); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <span className="font-bold text-ink">Profile</span>
                            <User size={20} className="text-primary" />
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>
        )}

        {/* Content Scrolling Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white">
          <div className="mx-auto w-full px-4 sm:px-6 md:px-8 py-6 md:py-12 max-w-4xl">
            <AnimatePresence mode="wait">
              {showQuiz ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 w-full"
                >
                  {!quizResult ? (
                    <>
                      <div className="text-center mb-8 md:mb-12">
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-ink mb-4">{content.weeks[activeWeek]?.quiz?.title}</h1>
                        <p className="text-gray-500 text-sm md:text-base">{content.weeks[activeWeek]?.quiz?.description}</p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 md:mt-8">
                          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400">
                            <HelpCircle size={16} className="text-primary" />
                            <span>{content.weeks[activeWeek]?.quiz?.questions?.length ?? 0} Questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400">
                            <Clock size={16} className="text-primary" />
                            <span>{content.weeks[activeWeek]?.quiz?.duration || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-400">
                            <Trophy size={16} className="text-primary" />
                            <span>Pass: {Math.ceil((content.weeks[activeWeek]?.quiz?.questions?.length ?? 0) * 0.8)} correct</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8 md:space-y-12">
                        {!quizStarted ? (
                          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                            <div className="mb-6 text-sm text-gray-500">Your timer will start as soon as you click the button below.</div>
                            <div className="mb-4 text-3xl font-bold text-ink">{formatTime(remainingSeconds)}</div>
                            <div className="mb-6 text-sm text-gray-500">{activeQuiz?.questions?.length ?? 0} questions — auto-submit when time runs out.</div>
                            <button
                              onClick={() => {
                                setQuizStarted(true);
                                if (remainingSeconds <= 0) {
                                  setRemainingSeconds(parseDurationToSeconds(activeQuiz?.duration));
                                }
                              }}
                              className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary/90 transition-all"
                            >
                              Start Quiz
                            </button>
                          </div>
                        ) : activeQuiz && currentQuestion ? (
                          <>
                            <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-gray-500">
                              <span>Question {safeQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                              <span>{activeQuiz.questions.filter(isQuestionAnswered).length}/{activeQuiz.questions.length} answered</span>
                              <span className="font-mono text-sm text-ink">{formatTime(remainingSeconds)}</span>
                            </div>

                            <div key={currentQuestion.id} className="space-y-4">
                              <h3 className="text-base md:text-lg font-bold text-ink flex gap-3 leading-tight">
                                <span className="text-primary shrink-0">{safeQuestionIndex + 1}.</span>
                                {currentQuestion.question}
                              </h3>
                              
                              {currentQuestion.type === 'multiple-choice' && (
                                <div className="grid gap-3">
                                  {currentQuestion.options?.map((option: string) => (
                                    <button
                                      key={option}
                                      onClick={() => setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: option }))}
                                      className={cn(
                                        "p-3 md:p-4 rounded-xl border-2 text-left transition-all font-bold text-xs md:text-sm w-full",
                                        quizAnswers[currentQuestion.id] === option 
                                          ? "border-primary bg-primary/5 text-primary" 
                                          : "border-gray-100 hover:border-gray-200 text-gray-600"
                                      )}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {currentQuestion.type === 'text' && (
                                <textarea
                                  placeholder="Type your answer here..."
                                  value={quizAnswers[currentQuestion.id] || ''}
                                  onChange={(e) => setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none min-h-[120px] text-sm font-medium"
                                />
                              )}

                              {currentQuestion.type === 'link' && (
                                <input
                                  type="url"
                                  placeholder="Insert Drive Link here..."
                                  value={quizAnswers[currentQuestion.id] || ''}
                                  onChange={(e) => setQuizAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                  className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm font-medium"
                                />
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
                              <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                                disabled={safeQuestionIndex === 0}
                                className={cn(
                                  "w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all",
                                  safeQuestionIndex === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                Previous
                              </button>
                              <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, activeQuiz.questions.length - 1))}
                                disabled={safeQuestionIndex >= activeQuiz.questions.length - 1}
                                className={cn(
                                  "w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all",
                                  safeQuestionIndex >= activeQuiz.questions.length - 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                )}
                              >
                                Next
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-gray-500">No questions available for this quiz.</div>
                        )}
                      </div>

                      <div className="pt-8 md:pt-12 flex justify-center">
                        <button
                          onClick={() => {
                            if (content.weeks[activeWeek]?.quiz) {
                              handleQuizSubmit(content.weeks[activeWeek].quiz);
                            }
                          }}
                          disabled={!areAllQuestionsAnswered(activeQuiz?.questions)}
                          className={cn(
                            "w-full md:w-auto px-12 py-4 rounded-xl md:rounded-full font-bold transition-all shadow-xl shadow-primary/20",
                            areAllQuestionsAnswered(activeQuiz?.questions)
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          )}
                        >
                          Finish Quiz
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 md:py-20 px-4">
                      <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-gray-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                          <motion.circle 
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * (quizResult.score / (content.weeks[activeWeek]?.quiz?.questions?.length ?? 1))) }}
                            className={cn("stroke-current", quizResult.passed ? "text-green-500" : "text-red-500")}
                            strokeWidth="8" 
                            strokeLinecap="round" 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="transparent" 
                            strokeDasharray="251.2"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl md:text-4xl font-display font-bold">
                            {Math.round((quizResult.score / (content.weeks[activeWeek]?.quiz?.questions?.length ?? 1)) * 100)}%
                          </span>
                          <span className="text-[10px] md:text-xs text-gray-400 font-bold">{quizResult.score}/{content.weeks[activeWeek]?.quiz?.questions?.length ?? 0}</span>
                        </div>
                      </div>

                      <h2 className={cn("text-2xl md:text-3xl font-display font-bold mb-4", quizResult.passed ? "text-green-600" : "text-red-600")}>
                        {quizResult.passed ? "Congratulations! You Passed" : "Assessment Failed"}
                      </h2>
                      <p className="text-gray-500 text-sm md:text-base mb-8 md:mb-12 max-w-lg mx-auto">
                        {quizResult.passed 
                          ? "You have successfully completed this week's assessment. You can now proceed to the next module."
                          : "Don't worry! You can review the materials and try again."}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                        <button
                          onClick={() => setQuizResult(null)}
                          className="w-full sm:w-auto px-8 py-3 rounded-xl md:rounded-full border-2 border-gray-200 font-bold hover:border-ink transition-all text-sm md:text-base"
                        >
                          Review Answers
                        </button>
                        {quizResult.passed ? (
                          <button
                            onClick={() => {
                              setShowQuiz(false);
                              setQuizResult(null);
                              const nextWeek = content.weeks[activeWeek + 1];
                              if (nextWeek) {
                                setActiveWeek(activeWeek + 1);
                                setActiveLesson(nextWeek.lessons[0]);
                                setExpandedWeeks(prev => [...prev, String(nextWeek.id)]);
                              }
                            }}
                            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl md:rounded-full hover:bg-primary/90 transition-all text-sm md:text-base"
                          >
                            Next Module
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizResult(null);
                              setQuizAnswers({});
                              setQuizStarted(false);
                              setCurrentQuestionIndex(0);
                              setRemainingSeconds(parseDurationToSeconds(activeQuiz?.duration));
                            }}
                            className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-bold rounded-xl md:rounded-full hover:bg-red-700 transition-all text-sm md:text-base"
                          >
                            Take Quiz Again
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : activeLesson ? (
                <motion.div
                  key={activeLesson.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 md:space-y-8 w-full"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] md:text-[10px] font-bold rounded uppercase tracking-widest">
                        Module {activeWeek + 1}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-widest">
                        {activeLesson.type}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-ink leading-tight">{activeLesson.title}</h1>
                  </div>
                  
                  {activeLesson.type === 'video' ? (
                    <div className="space-y-6 md:space-y-8">
                      <div className="aspect-video bg-black rounded-xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl relative group w-full">
                        {activeLesson.videoUrl?.includes("youtube.com") || activeLesson.videoUrl?.includes("youtu.be") ? (
                          <iframe
                            src={activeLesson.videoUrl.includes("v=") 
                              ? `https://www.youtube.com/embed/${activeLesson.videoUrl.split("v=")[1].split("&")[0]}`
                              : activeLesson.videoUrl.includes("youtu.be/")
                              ? `https://www.youtube.com/embed/${activeLesson.videoUrl.split("youtu.be/")[1].split("?")[0]}`
                              : activeLesson.videoUrl
                            }
                            title={activeLesson.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <iframe 
                            src={activeLesson.videoUrl} 
                            className="w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture" 
                            allowFullScreen
                          />
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-100">
                        <div className="flex gap-4 md:gap-8 border-b border-gray-200 mb-6 overflow-x-auto custom-scrollbar whitespace-nowrap">
                          <button className="pb-3 md:pb-4 text-xs md:text-sm font-bold text-primary border-b-2 border-primary shrink-0">Transcript</button>
                          <button className="pb-3 md:pb-4 text-xs md:text-sm font-bold text-gray-400 hover:text-ink transition-colors shrink-0">Resources</button>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-xs md:text-sm">
                          <p className="text-gray-600 leading-relaxed">
                            {activeLesson.transcript || "No transcript available for this lesson."}
                          </p>
                        </div>

                        {activeLesson.resources && activeLesson.resources.length > 0 && (
                          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                            <h4 className="text-xs md:text-sm font-bold text-ink mb-4">Downloadable Resources</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {activeLesson.resources.map((res, i) => (
                                <a 
                                  key={i} 
                                  href={res.url} 
                                  className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-xl border border-gray-100 hover:border-primary transition-all group"
                                >
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                    <FileText size={16} className="md:w-5 md:h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs md:text-sm font-bold text-ink truncate">{res.title}</div>
                                    <div className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold">{res.type}</div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 md:space-y-8">
                      <div className="prose prose-base md:prose-lg max-w-none bg-gray-50 p-6 md:p-12 rounded-2xl md:rounded-3xl border border-gray-100 text-sm md:text-base">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                          {activeLesson.content}
                        </p>
                      </div>
                      
                      {activeLesson.transcript && (
                        <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-100">
                          <h4 className="text-xs md:text-sm font-bold text-ink mb-3 md:mb-4">Additional Notes</h4>
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed break-words">
                            {activeLesson.transcript}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 md:pt-12 border-t border-gray-100">
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                      <button
                        onClick={handleLessonComplete}
                        className={cn(
                          "w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs md:text-sm",
                          completedLessons.includes(activeLesson.id)
                            ? "bg-green-100 text-green-600 cursor-default"
                            : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                        )}
                      >
                        {completedLessons.includes(activeLesson.id) ? (
                          <>
                            <CheckCircle2 size={16} />
                            Completed
                          </>
                        ) : (
                          "Mark as Complete"
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <button 
                        onClick={goToPreviousLesson}
                        disabled={getCurrentLessonIndex() <= 0}
                        className={cn(
                          "flex items-center justify-center gap-1 md:gap-2 flex-1 sm:flex-none px-4 md:px-5 py-3 md:py-2.5 rounded-xl border font-bold text-xs md:text-sm transition-colors",
                          getCurrentLessonIndex() <= 0
                            ? "border-gray-100 text-gray-300 cursor-not-allowed"
                            : "border-gray-100 hover:bg-gray-50 text-gray-600 hover:text-ink"
                        )}
                      >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      <button 
                        onClick={goToNextLesson}
                        disabled={getCurrentLessonIndex() >= getAllLessons().length - 1}
                        className={cn(
                          "flex items-center justify-center gap-1 md:gap-2 flex-1 sm:flex-none px-4 md:px-5 py-3 md:py-2.5 rounded-xl bg-ink text-white font-bold text-xs md:text-sm transition-colors",
                          getCurrentLessonIndex() >= getAllLessons().length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-ink/90"
                        )}
                      >
                        Next <span className="hidden sm:inline">Lesson</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-12 md:mt-16 space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-bold text-ink flex items-center gap-2">
                        <MessageSquare size={18} className="text-primary md:w-5 md:h-5" />
                        Comments
                      </h3>
                      <span className="text-[10px] md:text-xs font-bold text-gray-400">{comments.length} comments</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-100">
                      {comments.length === 0 ? (
                        <p className="text-xs md:text-sm text-gray-400 text-center mb-6 md:mb-8">No comments yet! You be the first to comment.</p>
                      ) : (
                        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                          {comments.map(comment => (
                            <div key={comment.id} className="flex gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                {comment.profiles?.avatar_url ? (
                                  <img src={comment.profiles.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-primary font-bold text-xs md:text-sm">
                                    {getInitials(comment.profiles?.full_name)}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                  <div className="flex justify-between items-center mb-1 md:mb-2">
                                    <span className="font-bold text-xs md:text-sm text-ink truncate">{comment.profiles?.full_name || 'Learner'}</span>
                                    <span className="text-[9px] md:text-[10px] text-gray-400 shrink-0 ml-2">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm text-gray-600 whitespace-pre-wrap leading-relaxed break-words">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="font-bold text-xs md:text-sm text-ink">Leave a Reply</h4>
                        <textarea 
                          placeholder="What did you learn from this lesson? Have any questions?"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          disabled={isSubmittingComment}
                          className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-primary outline-none min-h-[100px] md:min-h-[120px] text-xs md:text-sm disabled:opacity-50 transition-colors"
                        />
                        {commentError && (
                          <p className="text-[10px] md:text-xs text-red-500">{commentError}</p>
                        )}
                        <button 
                          type="button"
                          onClick={handlePostComment}
                          disabled={isSubmittingComment || !newComment.trim()}
                          className="w-full md:w-auto px-6 md:px-8 py-3 border-2 border-primary bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 text-xs md:text-sm"
                        >
                          {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="h-14 md:h-16 border-t border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white shrink-0">
          <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold text-gray-400 hover:text-ink transition-colors">
            <ArrowLeft size={14} className="md:w-4 md:h-4" />
            Prev
          </button>
          <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold text-gray-400 hover:text-ink transition-colors">
            Next
            <ArrowRight size={14} className="md:w-4 md:h-4" />
          </button>
        </footer>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showMobileSidebar && isMobile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-[85%] max-w-[320px] bg-white z-[101] lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Sidebar Header */}
                <div className="border-b border-gray-100 bg-primary text-white p-5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <BrandLogo
                        wrapperClassName="w-8 h-8 rounded-lg shadow-inner bg-white"
                        imgClassName="w-full h-full"
                        onClick={() => {
                          setShowMobileSidebar(false);
                          onLogoClick?.();
                        }}
                      />
                      <button 
                        onClick={() => {
                          setShowMobileSidebar(false);
                          onLogoClick?.();
                        }} 
                        className="text-left"
                      >
                        <span className="font-display font-bold text-xl tracking-tight text-white">
                          Paradise <span className="text-white/80">Hub</span>
                        </span>
                      </button>
                    </div>
                    <button 
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      <span>Course Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="h-full bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Sidebar Content Menu */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-gray-50">
                  {content.weeks.map((week, idx) => {
                    const locked = isWeekLocked(idx);
                    const isExpanded = expandedWeeks.includes(String(week.id));
                    const weekLessons = week.lessons.map(l => l.id);
                    const weekCompleted = weekLessons.filter(id => completedLessons.includes(id)).length;
                    const weekTotal = weekLessons.length + (week.quiz ? 1 : 0);
                    const weekPassed = week.quiz && passedQuizzes.includes(week.quiz.id) ? 1 : 0;
                    const weekProgress = Math.round(((weekCompleted + weekPassed) / weekTotal) * 100);
                    
                    return (
                      <div key={week.id} className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-xl">
                        <button 
                          onClick={() => !locked && toggleWeek(String(week.id))}
                          className={cn(
                            "w-full flex items-center justify-between transition-colors p-3 text-left",
                            locked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                          )}
                        >
                          <div className="flex-1 pr-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Module {idx + 1}</span>
                              {locked && <Lock size={10} className="text-gray-400" />}
                            </div>
                            <h4 className="text-xs font-bold text-ink leading-tight mb-2">{week.title}</h4>
                            {!locked && (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary/40" style={{ width: `${weekProgress}%` }} />
                                </div>
                                <span className="text-[8px] font-bold text-gray-400">{weekProgress}%</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isExpanded ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && !locked && (
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-gray-50"
                            >
                              <div className="p-2 space-y-1">
                                {week.lessons.map((lesson) => (
                                  <button
                                    key={lesson.id}
                                    onClick={() => {
                                      setActiveLesson(lesson);
                                      setActiveWeek(idx); 
                                      setShowQuiz(false);
                                      setQuizResult(null);
                                      setShowMobileSidebar(false); 
                                    }}
                                    className={cn(
                                      "w-full p-2.5 rounded-lg flex items-center gap-3 transition-all text-left",
                                      activeLesson?.id === lesson.id && !showQuiz ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                  >
                                    <div className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0", completedLessons.includes(lesson.id) ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")}> 
                                      {lesson.type === 'video' ? <Play size={10} fill="currentColor" /> : <FileText size={10} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-bold truncate leading-tight">{lesson.title}</p>
                                      {lesson.duration && <span className="text-[9px] opacity-60 block mt-0.5">{lesson.duration}</span>}
                                    </div>
                                    {completedLessons.includes(lesson.id) && <CheckCircle2 size={12} className="text-green-600 shrink-0" />}
                                  </button>
                                ))}
                                
                                {week.quiz && (
                                  <button
                                    onClick={() => {
                                      setShowQuiz(true);
                                      setActiveLesson(null);
                                      setActiveWeek(idx); 
                                      setQuizAnswers({});
                                      setQuizStarted(false);
                                      setCurrentQuestionIndex(0);
                                      setRemainingSeconds(parseDurationToSeconds(week.quiz?.duration));
                                      setShowMobileSidebar(false); 
                                    }}
                                    className={cn(
                                      "w-full p-2.5 rounded-lg flex items-center gap-3 transition-all text-left mt-1 border-t border-gray-50",
                                      showQuiz && activeWeek === idx ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                  >
                                    <div className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0", passedQuizzes.includes(week.quiz.id) ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary")}> 
                                      <HelpCircle size={10} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-bold truncate leading-tight">{week.quiz.title}</p>
                                      <span className="text-[9px] opacity-60 block mt-0.5">Assessment</span>
                                    </div>
                                    {passedQuizzes.includes(week.quiz.id) && <CheckCircle2 size={12} className="text-green-600 shrink-0" />}
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}