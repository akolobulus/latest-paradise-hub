import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  ArrowLeft, 
  Bell, 
  Grid, 
  Play, 
  Check, 
  Calendar, 
  Clock, 
  FileText, 
  ChevronRight,
  ArrowRight,
  Facebook,
  Linkedin,
  Users,
  User,
  Settings,
  HelpCircle,
  GraduationCap,
  LogOut
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";

interface CourseDetailsProps {
  course: {
    id: number;
    title: string;
    headline: string;
    description: string;
    duration: string;
    commitment: string;
    startDate: string;
    accessFee: string;
    image: string;
    includes: string[];
    structure: {
      title: string;
      description: string;
      date: string;
      duration: string;
      status: "Available" | "TBA";
    }[];
  };
  userProfile?: { full_name?: string; avatar_url?: string | null } | null;
  onBack: () => void;
  onLogoClick?: () => void;
  onEnroll: (course: any) => void;
  isEnrolled?: boolean;
  paymentStatus?: 'pending' | 'verified';
  onViewProfile?: () => void;
  onViewCommunity?: () => void;
  onViewLearning?: () => void;
  onLogout?: () => void;
}

export default function CourseDetails({ course, userProfile, onBack, onLogoClick, onEnroll, isEnrolled, paymentStatus, onViewProfile, onViewCommunity, onViewLearning, onLogout }: CourseDetailsProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Helper to get initials from full name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-2 md:gap-8">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
            <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
            <span className="font-display font-bold text-xl tracking-tight hidden xs:block">
              Paradise <span className="text-primary">Hub</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100">
            <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xs md:text-sm font-bold">0 points</span>
          </div>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsMenuOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2 text-gray-400 hover:text-primary transition-colors relative"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button 
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <Grid size={22} />
          </button>
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 md:gap-3 group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-transparent group-hover:border-primary transition-all text-sm md:text-base overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(userProfile?.full_name)
                )}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-bold text-ink">{userProfile?.full_name || "Learner"}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Learner</div>
              </div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    {/* Dark Mode Toggle */}
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-5 rounded-full relative transition-colors duration-300 cursor-pointer",
                          isDarkTheme ? "bg-primary" : "bg-gray-200"
                        )} onClick={() => setIsDarkTheme(!isDarkTheme)}>
                          <div className={cn(
                            "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                            isDarkTheme ? "left-6" : "left-1"
                          )} />
                        </div>
                        <span className="text-sm font-bold text-ink">View dark theme</span>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-2" />
                    
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        onViewProfile?.();
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink"
                    >
                      <User size={18} className="text-gray-400" />
                      <span className="text-sm font-bold">View profile</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        onViewLearning?.();
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink"
                    >
                      <GraduationCap size={18} className="text-gray-400" />
                      <span className="text-sm font-bold">My Learning</span>
                    </button>

                    <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink">
                      <Settings size={18} className="text-gray-400" />
                      <span className="text-sm font-bold">Settings</span>
                    </button>

                    <div className="h-px bg-gray-100 mx-2" />

                    <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink">
                      <HelpCircle size={18} className="text-gray-400" />
                      <span className="text-sm font-bold">Support</span>
                    </button>

                    <div className="h-px bg-gray-100 mx-2" />

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-500"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-bold">Logout</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsNotificationsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 md:right-8 top-16 w-[320px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-ink">Notifications</h4>
                <button className="text-xs text-primary font-bold hover:underline">Mark all as read</button>
              </div>
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={24} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">No active notifications</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsMenuOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 md:right-8 top-16 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
            >
              <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onViewCommunity?.();
                  }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <Users size={20} />
                  </div>
                  <span className="text-xs font-bold text-ink">Incubation</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    onBack();
                  }}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                    <ArrowLeft size={20} />
                  </div>
                  <span className="text-xs font-bold text-ink">Dashboard</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-light rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm md:text-lg mb-4 block">
              {course.title}
            </span>
            <h1 className="text-3xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
              {course.headline}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-primary text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-12">
            <div className="pr-4">
              <p className="text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Duration</p>
              <p className="text-sm md:text-lg font-bold">{course.duration}</p>
            </div>
            <div className="border-l border-white/20 pl-4 md:pl-12">
              <p className="text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Commitment</p>
              <p className="text-sm md:text-lg font-bold">{course.commitment}</p>
            </div>
            <div className="border-l-0 sm:border-l border-white/20 sm:pl-4 md:pl-12">
              <p className="text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Start Date</p>
              <p className="text-sm md:text-lg font-bold">{course.startDate}</p>
            </div>
            <div className="border-l border-white/20 pl-4 md:pl-12">
              <p className="text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Access Fee</p>
              <p className="text-sm md:text-lg font-bold">{course.accessFee}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12 md:space-y-16">
            <section>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-ink mb-8">
                From Beginner to Pro
              </h2>
              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>{course.description}</p>
                <p></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-ink mb-8">Program structure</h2>
              <div className="space-y-4">
                {course.structure.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex items-start gap-6 group hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-50 flex items-center justify-center text-ink group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <FileText className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-ink group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm">
                          <span>Class {item.status}</span>
                          <Calendar size={16} />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm md:text-base mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs md:text-sm font-bold text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {item.date}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {item.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 sticky top-24">
              {/* Video Thumbnail */}
              <div className="relative aspect-video group cursor-pointer">
                <img 
                  src={course.image} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Course Preview" 
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h3 className="text-lg md:text-xl font-bold text-ink mb-6">This program Includes:</h3>
                <ul className="space-y-4 mb-10">
                  {course.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm md:text-base">
                      <Check size={18} className="text-red-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {isEnrolled && paymentStatus === 'verified' ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-400 uppercase tracking-wider">Lessons completed</span>
                          <span className="text-ink">0/35</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-400 uppercase tracking-wider">Quizzes completed</span>
                          <span className="text-ink">0/1</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onEnroll(course)}
                      className="w-full py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mb-6 active:scale-95"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => onEnroll(course)}
                    className="w-full py-4 bg-[#00FF85] text-ink font-bold rounded-full hover:bg-[#00E676] transition-all shadow-lg shadow-[#00FF85]/20 mb-6 active:scale-95"
                  >
                    {isEnrolled && paymentStatus === 'pending' ? 'Complete Payment' : 'Enroll Now'}
                  </button>
                )}

                <button 
                  onClick={onBack}
                  className="w-full flex items-center justify-center gap-2 text-primary font-bold hover:underline group"
                >
                  Back to All Programs
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-ink text-white pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <BrandLogo wrapperClassName="w-10 h-10 rounded-full shadow-inner bg-white" imgClassName="w-full h-full" />
                <span className="font-display font-bold text-2xl tracking-tight">
                  Paradise <span className="text-primary-light">Hub</span>
                </span>
              </div>
              <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-8">
                Empowering the next generation of African leaders through an interactive e-learning agribusiness technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                  <Users size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">Career Tracks</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary-light transition-colors">Agribusiness Innovation</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Sustainable Farm Management</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">AI-Powered Business Automation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-primary-light transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <div>© Copyright 2026 Paradise Dynamic Farms. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
