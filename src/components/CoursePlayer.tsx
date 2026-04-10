
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  ChevronUp, 
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
  AlertCircle
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { COURSE_CONTENTS, Week, Lesson, Quiz } from "@/src/data/courseContent";

interface CoursePlayerProps {
  course: any;
  onBack: () => void;
  onAwardPoints: (amount: number) => void;
}

export default function CoursePlayer({ course, onBack, onAwardPoints }: CoursePlayerProps) {
  const content = COURSE_CONTENTS[course.id] || COURSE_CONTENTS[101]; // Fallback to 101 for demo
  const [activeWeek, setActiveWeek] = useState<number>(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(content.weeks[0].lessons[0]);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [passedQuizzes, setPassedQuizzes] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleWeek = (weekId: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekId) ? prev.filter(id => id !== weekId) : [...prev, weekId]
    );
  };

  const handleLessonComplete = () => {
    if (activeLesson && !completedLessons.includes(activeLesson.id)) {
      setCompletedLessons(prev => [...prev, activeLesson.id]);
      onAwardPoints(50); // Award 50 points for completing a lesson
    }
  };

  const handleQuizSubmit = (quiz: Quiz) => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (q.type === 'multiple-choice' && quizAnswers[q.id] === q.correctAnswer) {
        score++;
      } else if (q.type === 'text' && quizAnswers[q.id]?.length > 0) {
        score++; // Simple check for demo
      } else if (q.type === 'link' && quizAnswers[q.id]?.startsWith('http')) {
        score++;
      }
    });

    const passed = score >= quiz.passingGrade;
    setQuizResult({ score, passed });
    if (passed && !passedQuizzes.includes(quiz.id)) {
      setPassedQuizzes(prev => [...prev, quiz.id]);
      onAwardPoints(200); // Award 200 points for passing a quiz
    }
  };

  const isWeekLocked = (weekIndex: number) => {
    if (weekIndex === 0) return false;
    const prevWeek = content.weeks[weekIndex - 1];
    return !prevWeek.quiz || !passedQuizzes.includes(prevWeek.quiz.id);
  };

  const totalItems = content.weeks.reduce((acc, w) => acc + w.lessons.length + (w.quiz ? 1 : 0), 0);
  const completedItems = completedLessons.length + passedQuizzes.length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? (window.innerWidth <= 1024 ? 300 : 350) : 0,
          x: isSidebarOpen ? 0 : (window.innerWidth <= 1024 ? -300 : 0)
        }}
        className={cn(
          "border-r border-gray-100 flex flex-col bg-gray-50 relative z-[70]",
          window.innerWidth <= 1024 && "fixed inset-y-0 left-0 shadow-2xl"
        )}
      >
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
              <span className="font-display font-bold text-xl tracking-tight text-ink">
                Paradise <span className="text-primary">Hub</span>
              </span>
            </div>
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
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {content.weeks.map((week, idx) => {
            const locked = isWeekLocked(idx);
            const isExpanded = expandedWeeks.includes(week.id);
            const weekLessons = week.lessons.map(l => l.id);
            const weekCompleted = weekLessons.filter(id => completedLessons.includes(id)).length;
            const weekTotal = weekLessons.length + (week.quiz ? 1 : 0);
            const weekPassed = week.quiz && passedQuizzes.includes(week.quiz.id) ? 1 : 0;
            const weekProgress = Math.round(((weekCompleted + weekPassed) / weekTotal) * 100);
            
            return (
              <div key={week.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                  onClick={() => !locked && toggleWeek(week.id)}
                  className={cn(
                    "w-full p-4 flex items-center justify-between text-left transition-colors",
                    locked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Week {week.id}</span>
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
                              setShowQuiz(false);
                              setQuizResult(null);
                            }}
                            className={cn(
                              "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left",
                              activeLesson?.id === lesson.id && !showQuiz ? "bg-primary/5 text-primary" : "hover:bg-gray-50 text-gray-600"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              completedLessons.includes(lesson.id) ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                            )}>
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
                              setQuizResult(null);
                            }}
                            className={cn(
                              "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left mt-2 border-t border-gray-50",
                              showQuiz ? "bg-primary/5 text-primary" : "hover:bg-gray-50 text-gray-600"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              passedQuizzes.includes(week.quiz.id) ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                            )}>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-white">
        {/* Header */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-primary text-white shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className={cn("transition-transform", !isSidebarOpen && "rotate-180")} />
            </button>
            <h2 className="font-bold text-xs sm:text-sm md:text-base truncate max-w-[150px] sm:max-w-md">{course.title}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold">
              <span>{completedItems} of {totalItems} items</span>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X size={20} onClick={onBack} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-8 md:p-12">
            <AnimatePresence mode="wait">
              {showQuiz ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {!quizResult ? (
                    <>
                      <div className="text-center mb-12">
                        <h1 className="text-3xl font-display font-bold text-ink mb-4">{content.weeks[activeWeek].quiz?.title}</h1>
                        <p className="text-gray-500">{content.weeks[activeWeek].quiz?.description}</p>
                        
                        <div className="flex items-center justify-center gap-8 mt-8">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                            <HelpCircle size={18} className="text-primary" />
                            <span>{content.weeks[activeWeek].quiz?.questions.length} Questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                            <Clock size={18} className="text-primary" />
                            <span>{content.weeks[activeWeek].quiz?.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                            <Trophy size={18} className="text-primary" />
                            <span>Pass: {content.weeks[activeWeek].quiz?.passingGrade} correct</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-12">
                        {content.weeks[activeWeek].quiz?.questions.map((q, i) => (
                          <div key={q.id} className="space-y-4">
                            <h3 className="text-lg font-bold text-ink flex gap-3">
                              <span className="text-primary">{i + 1}.</span>
                              {q.question}
                            </h3>
                            
                            {q.type === 'multiple-choice' && (
                              <div className="grid gap-3">
                                {q.options?.map(option => (
                                  <button
                                    key={option}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: option }))}
                                    className={cn(
                                      "p-4 rounded-xl border-2 text-left transition-all font-bold text-sm",
                                      quizAnswers[q.id] === option 
                                        ? "border-primary bg-primary/5 text-primary" 
                                        : "border-gray-100 hover:border-gray-200 text-gray-600"
                                    )}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}

                            {q.type === 'text' && (
                              <textarea
                                placeholder="Type your answer here..."
                                value={quizAnswers[q.id] || ''}
                                onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none min-h-[150px] text-sm font-medium"
                              />
                            )}

                            {q.type === 'link' && (
                              <input
                                type="url"
                                placeholder="Insert Drive Link here..."
                                value={quizAnswers[q.id] || ''}
                                onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary outline-none text-sm font-medium"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-12 flex justify-center">
                        <button
                          onClick={() => handleQuizSubmit(content.weeks[activeWeek].quiz!)}
                          className="px-12 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                        >
                          Finish Quiz
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <div className="relative w-48 h-48 mx-auto mb-8">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle className="text-gray-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                          <motion.circle 
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * (quizResult.score / content.weeks[activeWeek].quiz!.questions.length)) }}
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
                          <span className="text-4xl font-display font-bold">
                            {Math.round((quizResult.score / content.weeks[activeWeek].quiz!.questions.length) * 100)}%
                          </span>
                          <span className="text-xs text-gray-400 font-bold">{quizResult.score}/{content.weeks[activeWeek].quiz!.questions.length}</span>
                        </div>
                      </div>

                      <h2 className={cn(
                        "text-3xl font-display font-bold mb-4",
                        quizResult.passed ? "text-green-600" : "text-red-600"
                      )}>
                        {quizResult.passed ? "Congratulations! You Passed" : "Assessment Failed"}
                      </h2>
                      <p className="text-gray-500 mb-12">
                        {quizResult.passed 
                          ? "You have successfully completed this week's assessment. You can now proceed to the next module."
                          : "Don't worry! You can review the materials and try again."}
                      </p>

                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => setQuizResult(null)}
                          className="px-8 py-3 rounded-full border-2 border-gray-200 font-bold hover:border-ink transition-all"
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
                                setExpandedWeeks(prev => [...prev, nextWeek.id]);
                              }
                            }}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all"
                          >
                            Next Module
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizResult(null);
                              setQuizAnswers({});
                            }}
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all"
                          >
                            Try Again
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
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-widest">
                        Module {content.weeks[activeWeek].id}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-widest">
                        {activeLesson.type}
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">{activeLesson.title}</h1>
                  </div>
                  
                  {activeLesson.type === 'video' ? (
                    <div className="space-y-8">
                      <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
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

                      {/* Tabs for Transcript and Resources */}
                      <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                        <div className="flex gap-8 border-b border-gray-200 mb-6">
                          <button className="pb-4 text-sm font-bold text-primary border-b-2 border-primary">Transcript</button>
                          <button className="pb-4 text-sm font-bold text-gray-400 hover:text-ink transition-colors">Resources</button>
                        </div>
                        
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-600 leading-relaxed">
                            {activeLesson.transcript || "No transcript available for this lesson."}
                          </p>
                        </div>

                        {activeLesson.resources && activeLesson.resources.length > 0 && (
                          <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="text-sm font-bold text-ink mb-4">Downloadable Resources</h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                              {activeLesson.resources.map((res, i) => (
                                <a 
                                  key={i} 
                                  href={res.url} 
                                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary transition-all group"
                                >
                                  <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FileText size={20} />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-ink">{res.title}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">{res.type}</div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="prose prose-lg max-w-none bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {activeLesson.content}
                        </p>
                      </div>
                      
                      {activeLesson.transcript && (
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                          <h4 className="text-sm font-bold text-ink mb-4">Additional Notes</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {activeLesson.transcript}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-12 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                      <button
                        onClick={handleLessonComplete}
                        className={cn(
                          "px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm",
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

                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-gray-400 hover:text-ink font-bold text-sm">
                        <ArrowLeft size={16} />
                        Previous
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white hover:bg-ink/90 transition-colors font-bold text-sm">
                        Next Lesson
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-16 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-ink flex items-center gap-2">
                        <MessageSquare size={20} className="text-primary" />
                        Comments
                      </h3>
                      <span className="text-xs font-bold text-gray-400">0 comments</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                      <p className="text-sm text-gray-400 text-center mb-8">No comments yet! You be the first to comment.</p>
                      
                      <div className="space-y-4">
                        <h4 className="font-bold text-ink">Leave a Reply</h4>
                        <textarea 
                          placeholder="Comment*"
                          className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-primary outline-none min-h-[120px] text-sm"
                        />
                        <button className="px-8 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                          Post Comment
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
        <footer className="h-16 border-t border-gray-100 flex items-center justify-between px-8 bg-white">
          <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-ink transition-colors">
            <ArrowLeft size={16} />
            Prev
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-ink transition-colors">
            Next
            <ArrowRight size={16} />
          </button>
        </footer>
      </main>
    </div>
  );
}
