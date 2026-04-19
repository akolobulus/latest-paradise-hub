import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CourseList from "./components/CourseList";
import Leaderboard from "./components/Leaderboard";
import Testimonials, { Footer } from "./components/Testimonials";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import CourseDetails from "./components/CourseDetails";
import AllPrograms from "./components/AllPrograms";
import MyLearning from "./components/MyLearning";
import CoursePlayer from "./components/CoursePlayer";
import CommunityHub from "./components/CommunityHub";
import { generateAgroTechImages } from "./lib/imageGen";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [aiImages, setAiImages] = useState<{ heroImage: string; footerImage: string } | null>(null);
  const [showAuth, setShowAuth] = useState<"login" | "signup" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<"dashboard" | "profile" | "course" | "all-programs" | "learning" | "course-player" | "community">("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [communityChannel, setCommunityChannel] = useState("general");

  const handleAwardPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const handleEnroll = (course: any) => {
    // Check if already enrolled
    if (enrolledPrograms.some(p => p.id === course.id)) {
      setCurrentPage("learning");
      return;
    }
    
    const newEnrollment = {
      ...course,
      paymentStatus: 'pending', // Default to pending as per requirements
      enrolledAt: new Date().toISOString()
    };
    
    setEnrolledPrograms(prev => [...prev, newEnrollment]);
    setCurrentPage("learning");
  };

  const handlePaymentSuccess = (courseId: number) => {
    setEnrolledPrograms(prev => 
      prev.map(p => p.id === courseId ? { ...p, paymentStatus: 'verified' } : p)
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, isLoggedIn, selectedCourse]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    // Fetch AI images
    generateAgroTechImages().then(setAiImages).catch(console.error);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isLoggedIn) {
    if (currentPage === "profile") {
      return <ProfilePage onBack={() => setCurrentPage("dashboard")} />;
    }
    if (currentPage === "learning") {
      return (
        <MyLearning 
          enrolledPrograms={enrolledPrograms}
          onBack={() => setCurrentPage("dashboard")}
          onViewCourse={(course) => {
            setSelectedCourse(course);
            setCurrentPage("course-player");
          }}
          onViewAllPrograms={(programs) => {
            setSelectedCourse(programs);
            setCurrentPage("all-programs");
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onViewProfile={() => setCurrentPage("profile")}
          onViewCommunity={() => setCurrentPage("community")}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentPage("dashboard");
          }}
        />
      );
    }
    if (currentPage === "all-programs") {
      return (
        <AllPrograms 
          programs={selectedCourse || []} 
          onBack={() => setCurrentPage("dashboard")}
          onViewDetails={(course) => {
            setSelectedCourse(course);
            setCurrentPage("course");
          }}
          onEnroll={handleEnroll}
        />
      );
    }
    if (currentPage === "course" && selectedCourse) {
      const enrollment = enrolledPrograms.find(p => p.id === selectedCourse.id);
      return (
        <CourseDetails 
          course={selectedCourse} 
          isEnrolled={!!enrollment}
          paymentStatus={enrollment?.paymentStatus}
          onBack={() => {
            setCurrentPage("dashboard");
            setSelectedCourse(null);
          }} 
          onEnroll={handleEnroll}
          onViewProfile={() => setCurrentPage("profile")}
          onViewCommunity={() => setCurrentPage("community")}
          onViewLearning={() => setCurrentPage("learning")}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentPage("dashboard");
            setSelectedCourse(null);
          }}
        />
      );
    }
    if (currentPage === "course-player" && selectedCourse) {
      return (
        <CoursePlayer 
          course={selectedCourse} 
          onBack={() => {
            setCurrentPage("learning");
            setSelectedCourse(null);
          }} 
          onAwardPoints={handleAwardPoints}
          onViewProfile={() => setCurrentPage("profile")}
          onViewCommunity={() => setCurrentPage("community")}
          onViewLearning={() => setCurrentPage("learning")}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentPage("dashboard");
            setSelectedCourse(null);
          }}
        />
      );
    }
    if (currentPage === "community") {
      return (
        <CommunityHub 
          onBack={() => setCurrentPage("dashboard")} 
          points={points} 
          initialChannel={communityChannel} 
        />
      );
    }
    return (
      <Dashboard 
        points={points}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentPage("dashboard");
        }} 
        onViewProfile={() => setCurrentPage("profile")}
        onViewCourse={(course) => {
          setSelectedCourse(course);
          setCurrentPage("course");
        }}
        onViewAllPrograms={(programs) => {
          setSelectedCourse(programs);
          setCurrentPage("all-programs");
        }}
        onEnroll={handleEnroll}
        onViewLearning={() => setCurrentPage("learning")}
        onViewCommunity={() => {
          setCommunityChannel("general");
          setCurrentPage("community");
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-white">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[100] hidden md:block"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", damping: 20, stiffness: 150, mass: 0.5 }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[100] hidden md:block"
        animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.2 }}
      />

      <Navbar 
        onLoginClick={() => setShowAuth("login")} 
        onIncubationClick={() => {
          if (isLoggedIn) {
            setCommunityChannel("general");
            setCurrentPage("community");
          } else {
            setShowAuth("login");
          }
        }}
        onHomeClick={() => {
          if (isLoggedIn) {
            setCurrentPage("dashboard");
          } else {
            setCurrentPage("dashboard"); // Landing page is dashboard when not logged in
          }
        }}
        onCoursesClick={() => {
          if (isLoggedIn) {
            setCurrentPage("all-programs");
          } else {
            const el = document.getElementById('courses');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onAboutClick={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-[100] relative"
          >
            <AuthPage 
              initialMode={showAuth} 
              onBack={() => setShowAuth(null)} 
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                setShowAuth(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Testimonials />
        
        <Hero 
          onStartClick={() => setShowAuth("signup")}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <CourseList />
        </motion.div>
      </main>

      <Footer aiImage={aiImages?.footerImage} />

      {/* Floating Action Button for Support */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#064E3B] text-white rounded-full shadow-2xl flex items-center justify-center z-40 border-2 border-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
      </motion.button>
    </div>
  );
}
