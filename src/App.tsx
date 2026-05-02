import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
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
import { supabase } from "./lib/supabase";
import { ProfileData } from "./lib/profileCompletion";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [aiImages, setAiImages] = useState<{ heroImage: string; footerImage: string } | null>(null);
  const [showAuth, setShowAuth] = useState<"login" | "signup" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "profile" | "course" | "all-programs" | "learning" | "course-player" | "community">("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [communityChannel, setCommunityChannel] = useState("general");
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const analytics = <Analytics />;

  // 1. Listen for Auth Changes on mount
  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoggedIn(!!session);
      if (session) fetchUserData(session.user.id);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoggedIn(!!session);
      if (session) {
        fetchUserData(session.user.id);
      } else {
        // User logged out, reset state
        setEnrolledPrograms([]);
        setPoints(0);
        setUserProfile(null);
        setCurrentPage("dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch User Data from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch Profile with avatar_url
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (profile) {
        setPoints(profile.points);
        setUserProfile(profile);
      }

      // Fetch enrollments and then load the related course details separately.
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId);

      if (enrollError) {
        console.error("Enrollment fetch error:", enrollError?.message || enrollError);
        return;
      }

      if (enrollments && enrollments.length > 0) {
        // Migrate any pending enrollments to verified since courses are now free
        const pendingEnrollments = enrollments.filter((e: any) => e.payment_status === 'pending');
        if (pendingEnrollments.length > 0) {
          const pendingIds = pendingEnrollments.map((e: any) => e.id);
          await supabase
            .from('enrollments')
            .update({ payment_status: 'verified' })
            .in('id', pendingIds);
        }

        const courseIds = enrollments.map((e: any) => e.course_id).filter(Boolean);
        const { data: courses, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);

        if (courseError) {
          console.error("Courses fetch error:", courseError?.message || courseError);
          return;
        }

        const coursesById = (courses || []).reduce((acc: Record<number, any>, course: any) => {
          acc[course.id] = course;
          return acc;
        }, {});

        const formattedPrograms = enrollments
          .filter((e: any) => coursesById[e.course_id]) // Only include enrollments with valid courses
          .map((e: any) => {
            const course = coursesById[e.course_id];
            return {
              ...course,
              id: Number(e.course_id),
              enrollment_id: e.id,
              paymentStatus: e.payment_status,
              payment_status: e.payment_status,
              accessFee: course.access_fee ?? course.accessFee ?? 'Free',
              startDate: course.start_date ?? course.startDate ?? '',
              enrolledAt: e.created_at,
            };
          });

        setEnrolledPrograms(formattedPrograms);
      } else {
        setEnrolledPrograms([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAwardPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  // 3. Update the handleEnroll function to push to DB (Now 100% Free)
  const handleEnroll = async (course: any) => {
    if (!session) {
      setShowAuth("login");
      return;
    }

    const courseId = Number(course.id);

    // Check if already enrolled locally
    const isAlreadyEnrolled = enrolledPrograms.some(
      (p) => Number(p.id) === courseId || Number(p.course_id) === courseId
    );

    if (isAlreadyEnrolled) {
      setCurrentPage("learning");
      window.scrollTo(0, 0);
      return;
    }

    // MAKE ALL COURSES FREE FOR NOW
    const initialStatus = 'verified';

    try {
      // 1. Save enrollment to database
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: session.user.id,
          course_id: courseId,
          payment_status: initialStatus
        });

      if (enrollError) {
        // ERROR CODE 23505 = Postgres unique violation (already enrolled)
        if (enrollError.code === '23505') {
          console.log("User is already enrolled. Redirecting to learning.");
          if (session) fetchUserData(session.user.id);
          setCurrentPage("learning");
          window.scrollTo(0, 0);
          return;
        }

        console.error("Supabase Error Details:", enrollError);
        throw new Error(enrollError.message);
      }

      // 2. Add an instant notification to the user's dashboard
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: session.user.id,
          title: "Enrollment Successful!",
          message: `You have successfully enrolled in ${course.title}. You can now start learning.`
        });

      if (notificationError) {
        console.error("Notification insert failed:", notificationError);
        throw new Error(notificationError.message);
      }

      // 3. Update local state and redirect to My Learning
      const newEnrollment = {
        ...course,
        course_id: courseId,
        user_id: session.user.id,
        payment_status: initialStatus,
        paymentStatus: initialStatus,
        enrolledAt: new Date().toISOString()
      };

      setEnrolledPrograms((prev) => [...prev, newEnrollment]);
      setCurrentPage("learning");
      window.scrollTo(0, 0);

    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      alert(`Failed to enroll: ${error?.message || 'Unknown database error'}`);
    }
  };

  // 4. Update Payment Success
  const handlePaymentSuccess = async (courseId: number) => {
    if (!session) return;

    try {
      await supabase
        .from('enrollments')
        .update({ payment_status: 'verified' })
        .match({ user_id: session.user.id, course_id: courseId });

      setEnrolledPrograms(prev => 
        prev.map(p => (p.id === courseId || p.course_id === courseId) 
          ? { ...p, paymentStatus: 'verified', payment_status: 'verified' } 
          : p)
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  // 5. Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, isLoggedIn, selectedCourse]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.from('courses').select('*');
        if (error) {
          console.error('Error fetching courses:', error);
          return;
        }
        if (data) {
          setAllCourses(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching courses:', error);
      }
    };

    if (!allCourses.length) {
      fetchCourses();
    }

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
  }, [allCourses.length]);

  if (isLoggedIn) {
    if (currentPage === "landing") {
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
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
            onLoginClick={() => setShowAuth("login")} 
            onProfileClick={() => setCurrentPage("profile")}
            onIncubationClick={() => {
              setCommunityChannel("general");
              setCurrentPage("community");
            }}
            onHomeClick={() => setCurrentPage("dashboard")}
            onCoursesClick={() => {
              const el = document.getElementById('courses');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onAboutClick={() => {
              const el = document.getElementById('about');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          
          <main>
            <Testimonials />
            
            <Hero 
              isLoggedIn={isLoggedIn}
              userProfile={userProfile}
              onStartClick={() => setShowAuth("signup")}
              onDashboardClick={() => {
                setCurrentPage("dashboard");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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

          <Footer 
            aiImage={aiImages?.footerImage}
            isLoggedIn={isLoggedIn}
            onLogoClick={() => {
              setCurrentPage("landing");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAboutClick={() => {
              setCurrentPage("landing");
              setTimeout(() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onSupportClick={() => {
              setCurrentPage("landing");
              setTimeout(() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onPrivacyClick={() => {
              setCurrentPage("landing");
              setTimeout(() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        </div>
      );
    }
    if (currentPage === "profile") {
      return (
        <>
          <ProfilePage 
            onBack={() => setCurrentPage("dashboard")}
            onProfileUpdate={(updatedProfile) => setUserProfile(updatedProfile)}
          />
          {analytics}
        </>
      );
    }
    if (currentPage === "learning") {
      return (
        <>
          <MyLearning 
            userProfile={userProfile}
            enrolledPrograms={enrolledPrograms}
            onBack={() => setCurrentPage("dashboard")}
            onLogoClick={() => setCurrentPage("landing")}
            onViewCourse={(course) => {
              setSelectedCourse(course);
              setCurrentPage("course");
            }}
            onPlayCourse={(course) => {
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
            onLogout={handleLogout}
          />
          {analytics}
        </>
      );
    }
    if (currentPage === "all-programs") {
      return (
        <>
          <AllPrograms 
            userProfile={userProfile}
            programs={Array.isArray(selectedCourse) ? selectedCourse : allCourses} 
            enrolledPrograms={enrolledPrograms}
            onBack={() => setCurrentPage("dashboard")}
            onLogoClick={() => setCurrentPage("landing")}
            onViewDetails={(course) => {
              setSelectedCourse(course);
              setCurrentPage("course");
            }}
            onEnroll={handleEnroll}
          />
          {analytics}
        </>
      );
    }
    if (currentPage === "course" && selectedCourse) {
      const enrollment = enrolledPrograms.find(p => p.id === selectedCourse.id);
      return (
        <>
          <CourseDetails 
            userProfile={userProfile}
            course={selectedCourse} 
            isEnrolled={!!enrollment}
            paymentStatus={enrollment?.paymentStatus}
            onBack={() => {
              setCurrentPage("dashboard");
              setSelectedCourse(null);
            }}
            onLogoClick={() => setCurrentPage("landing")} 
            onEnroll={handleEnroll}
            onPlayCourse={() => setCurrentPage("course-player")}
            onViewProfile={() => setCurrentPage("profile")}
            onViewCommunity={() => setCurrentPage("community")}
            onViewLearning={() => setCurrentPage("learning")}
            onLogout={() => {
              handleLogout();
              setSelectedCourse(null);
            }}
          />
          {analytics}
        </>
      );
    }
    if (currentPage === "course-player" && selectedCourse) {
      return (
        <>
          <CoursePlayer 
            userProfile={userProfile}
            course={selectedCourse} 
            onBack={() => {
              setCurrentPage("learning");
              setSelectedCourse(null);
            }}
            onLogoClick={() => setCurrentPage("landing")} 
            onAwardPoints={handleAwardPoints}
            onViewProfile={() => setCurrentPage("profile")}
            onViewCommunity={() => setCurrentPage("community")}
            onViewLearning={() => setCurrentPage("learning")}
            onLogout={() => {
              handleLogout();
              setSelectedCourse(null);
            }}
          />
          {analytics}
        </>
      );
    }
    if (currentPage === "community") {
      return (
        <>
          <CommunityHub 
            userProfile={userProfile}
            onBack={() => setCurrentPage("dashboard")}
            onLogoClick={() => setCurrentPage("landing") } 
            onProfileClick={() => setCurrentPage("profile")}
            points={points} 
            initialChannel={communityChannel} 
          />
          {analytics}
        </>
      );
    }
    return (
      <Dashboard 
        points={points}
        user={session?.user.user_metadata}
        userProfile={userProfile}
        programs={allCourses}
        enrolledPrograms={enrolledPrograms}
        onLogout={handleLogout}
        onLogoClick={() => setCurrentPage("landing")}
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
        onAboutClick={() => {
          setCurrentPage("landing");
          setTimeout(() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onSupportClick={() => {
          setCurrentPage("landing");
          setTimeout(() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onPrivacyClick={() => {
          setCurrentPage("landing");
          setTimeout(() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
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
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLoginClick={() => setShowAuth("login")} 
        onProfileClick={() => setCurrentPage("profile")}
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
                setShowAuth(null);
                // Session will be set by auth state listener
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Testimonials />
        
        <Hero 
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          onStartClick={() => setShowAuth("signup")}
          onDashboardClick={() => {
            if (isLoggedIn) {
              setCurrentPage("dashboard");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
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

      <Footer 
        aiImage={aiImages?.footerImage}
        isLoggedIn={isLoggedIn}
        onLogoClick={() => {
          setCurrentPage("landing");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAboutClick={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSupportClick={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onPrivacyClick={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      {analytics}

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
