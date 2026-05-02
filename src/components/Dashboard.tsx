import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Bell, 
  Grid, 
  Zap, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Trophy, 
  HelpCircle,
  Calendar,
  Clock,
  ArrowRight,
  Linkedin,
  Facebook,
  CircleDollarSign,
  User,
  Settings,
  LogOut,
  Gem,
  MoreHorizontal,
  GraduationCap,
  Check
} from "lucide-react";
import { useState, useMemo } from "react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { calculateProfileCompletion, getProfileSections, ProfileData } from "@/src/lib/profileCompletion";

const RECOMMENDED_PROGRAMS = [
  {
    id: 3,
    title: "Sustainable Farm Management",
    headline: "Eco-Friendly Farming for the Future",
    description: "Master modern farming techniques, sustainable practices, and livestock management for the 21st century.",
    image: "/farm-management.jpg",
    startDate: "11 May 2026",
    duration: "12 weeks",
    commitment: "15-20 hrs/week",
    accessFee: "11k naira only",
    category: "Agri Business",
    includes: [
      "Soil science and management",
      "Sustainable crop production",
      "Livestock health and welfare",
      "Agribusiness fundamentals"
    ],
    structure: [
      {
        title: "Introduction to Modern Farming",
        description: "Core concepts of sustainable agriculture.",
        date: "11 May 2026",
        duration: "1 week",
        status: "Available" as const
      }
    ]
  },
  {
    id: 2,
    title: "AI-Powered Business Automation",
    headline: "Lead the Future of Tech with AI",
    description: "Master the use of AI, low-code tools, and digital automation to streamline business processes and drive modern innovation.",
    image: "/ai-automation.jpg",
    startDate: "18 May 2026",
    duration: "24 weeks",
    commitment: "20-30 hrs/week",
    accessFee: "11k naira only",
    category: "Tech",
    includes: [
      "AI and machine learning basics",
      "Low-code automation tools",
      "Digital transformation strategy",
      "Cloud computing for AI"
    ],
    structure: [
      {
        title: "AI Fundamentals",
        description: "Understanding LLMs and automation.",
        date: "18 May 2026",
        duration: "4 weeks",
        status: "Available" as const
      }
    ]
  },
  {
    id: 1,
    title: "Agribusiness Innovation",
    headline: "The Ultimate Hybrid Career",
    description: "Harness the power of IoT, satellite imagery, and data analytics to revolutionize modern farming and ensure food security.",
    image: "/agribusiness-innovation.jpg",
    startDate: "25 May 2026",
    duration: "16 weeks",
    commitment: "15-25 hrs/week",
    accessFee: "11k naira only",
    category: "Agro-Tech",
    includes: [
      "IoT in agriculture",
      "Precision farming with AI",
      "Supply chain optimization",
      "Data-driven farm management"
    ],
    structure: [
      {
        title: "IoT and Sensors",
        description: "Connecting the farm to the cloud.",
        date: "25 May 2026",
        duration: "3 weeks",
        status: "Available" as const
      }
    ]
  },
  {
    id: 4,
    title: "Agri Value Chain Optimization",
    headline: "Maximize Profit from Farm to Table",
    description: "Learn the end-to-end business of agriculture, from sustainable farm management to profitable value chain optimization.",
    image: "/farm-management.jpg",
    startDate: "01 June 2026",
    duration: "10 weeks",
    commitment: "12-18 hrs/week",
    accessFee: "11k naira only",
    category: "Agri Business",
    includes: [
      "Supply chain logistics",
      "Market analysis",
      "Value addition strategies",
      "Export requirements"
    ],
    structure: [
      {
        title: "Value Chain Basics",
        description: "Introduction to agricultural logistics.",
        date: "01 June 2026",
        duration: "2 weeks",
        status: "Available" as const
      }
    ]
  },
  {
    id: 5,
    title: "Low-Code App Development",
    headline: "Build Apps Without Coding",
    description: "Build world-class software solutions using low-code platforms and lead digital transformation in your organization.",
    image: "/ai-automation.jpg",
    startDate: "08 June 2026",
    duration: "8 weeks",
    commitment: "10-15 hrs/week",
    accessFee: "11k naira only",
    category: "Tech",
    includes: [
      "No-code/Low-code platforms",
      "UI/UX design basics",
      "Database management",
      "App deployment"
    ],
    structure: [
      {
        title: "Platform Overview",
        description: "Choosing the right low-code tool.",
        date: "08 June 2026",
        duration: "1 week",
        status: "Available" as const
      }
    ]
  }
];

const EXPLORE_CARDS = [
  { title: "Start Learning", icon: <BookOpen />, desc: "Access your program and stay on track with your learning journey here.", color: "bg-primary", image: "/start-learning.jpg" },
  { title: "Connect to Incubation", icon: <Users />, desc: "Collaborate with fellow learners to get peer support and celebrate successes.", color: "bg-green-500", image: "/connect-incubation.jpg" },
  { title: "Earn Rewards", icon: <Trophy />, desc: "Check how many Legacy Points you have earned and how you can redeem them.", color: "bg-orange-500", image: "/earn-rewards.jpg" },
  { title: "Need Support?", icon: <HelpCircle />, desc: "Chat with our AI learner support expert, LEA, or contact our support team directly.", color: "bg-primary-light", image: "/need-support.jpg" },
];

const DASHBOARD_VIDEOS = [
  {
    id: 1,
    title: "Welcome Video",
    description: "This is your gateway to learning, community, and opportunity at Paradise Hub. Here, you can keep up with your learning through your personal profile and access the community.",
    image: "/welcome-hero.jpg"
  },
  {
    id: 2,
    title: "Orientation Video",
    description: "This video will guide you through onboarding and help you unlock the full potential of the Hub at Paradise Hub. Be sure to refer back to this video to help you along your orientation experience.",
    image: "/hello-welcome.jpg"
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Join your incubation",
    description: "Welcome to the Hub. Connect with your peers in your incubation space. It's a great place to share and learn together.",
    linkText: "Go to incubation",
    icon: <Users size={18} />,
    color: "text-primary bg-primary/10"
  }
];

interface DashboardProps {
  points: number;
  user?: { full_name?: string; email?: string };
  userProfile?: ProfileData | null;
  onLogout: () => void;
  onLogoClick?: () => void;
  onViewProfile: () => void;
  onViewCourse: (course: any) => void;
  onViewAllPrograms: (programs: any[]) => void;
  onEnroll: (course: any) => void;
  onViewLearning: () => void;
  onViewCommunity: () => void;
  onAboutClick?: () => void;
  onSupportClick?: () => void;
  onPrivacyClick?: () => void;
}

export default function Dashboard({ points, user, userProfile, onLogout, onLogoClick, onViewProfile, onViewCourse, onViewAllPrograms, onEnroll, onViewLearning, onViewCommunity, onAboutClick, onSupportClick, onPrivacyClick }: DashboardProps) {
  const [activeVideoSlide, setActiveVideoSlide] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => calculateProfileCompletion(userProfile || null), [userProfile]);
  const profileSections = useMemo(() => getProfileSections(userProfile || null), [userProfile]);

  // Helper to get initials from full name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const nextVideo = () => setActiveVideoSlide((prev) => (prev + 1) % DASHBOARD_VIDEOS.length);
  const prevVideo = () => setActiveVideoSlide((prev) => (prev - 1 + DASHBOARD_VIDEOS.length) % DASHBOARD_VIDEOS.length);

  // Format user display name (first name only)
  const getUserDisplayName = () => {
    if (!user?.full_name) return "Learner";
    return user.full_name.split(" ")[0];
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 selection:bg-primary selection:text-white",
      isDarkTheme ? "bg-ink text-white" : "bg-[#F8FAFC] text-ink"
    )}>
      {/* Dashboard Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-8">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
              <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
              <span className="font-display font-bold text-xl tracking-tight hidden xs:block">
                Paradise <span className="text-primary">Hub</span>
              </span>
            </div>
            
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
              <Search size={18} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search courses, resources..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-orange-100">
              <div className="w-5 h-5 bg-orange-400 rounded flex items-center justify-center text-white">
                <Gem size={12} fill="currentColor" />
              </div>
              <span className="text-xs md:text-sm font-bold">{points.toLocaleString()} points</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 md:p-2 text-gray-400 hover:text-primary transition-colors relative"
              >
                <Bell size={20} className="md:w-[22px] md:h-[22px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

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
                      className="absolute right-0 mt-2 w-[320px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-ink">Notifications</h4>
                        <button className="text-xs text-primary font-bold hover:underline">Mark all as read</button>
                      </div>

                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {MOCK_NOTIFICATIONS.map((notif) => (
                          <div key={notif.id} className="flex gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group relative">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notif.color)}>
                              <GraduationCap size={20} />
                            </div>
                            <div className="flex-1 pr-6">
                              <h5 className="text-sm font-bold text-ink mb-1">{notif.title}</h5>
                              <p className="text-xs text-gray-500 leading-relaxed mb-3">{notif.description}</p>
                              <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                                {notif.linkText}
                                <ArrowRight size={12} />
                              </button>
                            </div>
                            <button className="absolute top-4 right-4 text-gray-400 hover:text-ink">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {MOCK_NOTIFICATIONS.length === 0 && (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={24} className="text-gray-300" />
                          </div>
                          <p className="text-sm text-gray-400">No active notifications</p>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 md:p-2 text-gray-400 hover:text-primary transition-colors"
              >
                <Grid size={20} className="md:w-[22px] md:h-[22px]" />
              </button>

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
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                    >
                      <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                        <button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            onViewLearning();
                          }}
                          className="flex flex-col items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <GraduationCap size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Learning</span>
                        </button>

                        <button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            onViewCommunity();
                          }}
                          className="flex flex-col items-center gap-3 group"
                        >
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <Users size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Incubation</span>
                        </button>

                        <button className="flex flex-col items-center gap-3 group">
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <Trophy size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Rewards</span>
                        </button>

                        <button className="flex flex-col items-center gap-3 group">
                          <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                            <HelpCircle size={24} />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Support</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 md:h-8 w-px bg-gray-200 mx-1" />

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 md:gap-3 group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-transparent group-hover:border-primary transition-all text-sm md:text-base overflow-hidden">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(userProfile?.full_name || user?.full_name)
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-ink">{userProfile?.full_name || user?.full_name || "Learner"}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Learner</div>
                </div>
              </button>

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
                          onViewProfile();
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-ink"
                      >
                        <User size={18} className="text-gray-400" />
                        <span className="text-sm font-bold">View profile</span>
                      </button>

                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          onViewLearning();
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
                        onClick={onLogout}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-500"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-bold">Log out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 md:space-y-12">
        {/* Hero Banner */}
        <section className="relative rounded-[32px] md:rounded-[40px] overflow-hidden bg-ink min-h-[250px] md:min-h-[300px] flex items-center p-6 md:p-16">
          <img 
            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            alt="Dashboard Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
          
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-primary-light font-bold tracking-widest uppercase text-[10px] md:text-sm mb-2 md:mb-4 block">Welcome to the Hub, {getUserDisplayName()}</span>
              <h1 className="text-2xl md:text-6xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
                Your Learning Journey <br className="hidden md:block" /> Starts Here
              </h1>
              <p className="text-white/70 text-sm md:text-xl mb-0">
                Track your progress, achieve your goals, and master the future of Agribusiness.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Recommended Programs */}
        <section>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-display font-bold text-ink">Recommended Programs</h2>
            <button 
              onClick={() => onViewAllPrograms(RECOMMENDED_PROGRAMS)}
              className="text-primary text-sm md:text-base font-bold hover:underline flex items-center gap-1 md:gap-2"
            >
              View All
              <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {RECOMMENDED_PROGRAMS.slice(0, 3).map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="h-40 md:h-48 overflow-hidden relative">
                  <img src={program.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={program.title} />
                  <div className="absolute top-3 left-3 md:top-4 left-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-wider">
                    {program.category}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-ink">{program.title}</h3>
                  <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed">
                    {program.description}
                  </p>
                  
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 text-[10px] md:text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="md:w-[14px] md:h-[14px]" />
                      {program.startDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="md:w-[14px] md:h-[14px]" />
                      {program.duration}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <button 
                      onClick={() => onViewCourse(program)}
                      className="py-2.5 md:py-3 rounded-xl border-2 border-ink font-bold text-xs md:text-sm hover:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => onEnroll(program)}
                      className="py-2.5 md:py-3 rounded-xl bg-[#00FF85] border-2 border-ink text-ink font-bold text-xs md:text-sm hover:bg-[#00E676] transition-colors shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 md:mt-12 flex justify-center">
            <button 
              onClick={() => onViewAllPrograms(RECOMMENDED_PROGRAMS)}
              className="px-8 py-3 rounded-full border-2 border-primary text-primary font-bold text-sm md:text-base hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              View All Programs
            </button>
          </div>
        </section>

        {/* Carousel Section: Welcome Video / Profile Progress */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-12">
            
            <div className="relative w-full md:w-[300px] aspect-video md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer z-10 shrink-0">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeVideoSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  src={DASHBOARD_VIDEOS[activeVideoSlide].image} 
                  className="w-full h-full object-cover" 
                  alt="Video Thumbnail" 
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                  <Play size={20} className="md:w-6 md:h-6" fill="currentColor" />
                </div>
              </div>
              
              {/* Mobile Navigation Arrows on Video */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between md:hidden pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevVideo(); }}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-ink pointer-events-auto shadow-lg"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextVideo(); }}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-ink pointer-events-auto shadow-lg"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 z-10 text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVideoSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg md:text-2xl font-display font-bold mb-2 md:mb-4">{DASHBOARD_VIDEOS[activeVideoSlide].title}</h3>
                  <p className="text-gray-500 text-xs md:text-base leading-relaxed mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
                    {DASHBOARD_VIDEOS[activeVideoSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button 
                  onClick={prevVideo}
                  className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {DASHBOARD_VIDEOS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300",
                        activeVideoSlide === i ? "bg-primary w-3 md:w-4" : "bg-gray-200"
                      )} 
                    />
                  ))}
                </div>
                <button 
                  onClick={nextVideo}
                  className="hidden md:flex w-10 h-10 rounded-full border border-gray-200 items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Complete Your Profile</h3>
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 md:mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-gray-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                <circle 
                  className="text-primary stroke-current transition-all duration-1000" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * profileCompletion) / 100}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-display font-bold">{profileCompletion}%</span>
              </div>
            </div>
            <ul className="text-left w-full space-y-2 md:space-y-3 mb-6 md:mb-8">
              {profileSections.map((section, idx) => (
                <ProfileStep key={idx} label={section.label} completed={section.completed} />
              ))}
            </ul>
            <button 
              onClick={onViewProfile}
              className="w-full py-2.5 md:py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
            >
              {profileCompletion === 100 ? "Profile Complete!" : "Add Personal Info"}
            </button>
          </div>
        </section>

        {/* Current Programs Section */}
        <section>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-display font-bold text-ink">Current Programs</h2>
            <button className="text-primary text-sm md:text-base font-bold hover:underline flex items-center gap-1">
              View More
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-ink">No Programs Yet</h3>
            <p className="text-gray-500 text-xs md:text-sm max-w-xs leading-relaxed">
              Explore a world of knowledge. Start your learning journey today!
            </p>
            <button className="px-6 md:px-8 py-2.5 md:py-3 rounded-full border-2 border-primary text-primary font-bold text-xs md:text-sm hover:bg-primary hover:text-white transition-all">
              Apply to new programs
            </button>
          </div>
        </section>

        {/* Explore the eHub */}
        <section>
          <h2 className="text-xl md:text-3xl font-display font-bold text-ink mb-6 md:mb-8">Explore the Hub</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {EXPLORE_CARDS.map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                onClick={() => {
                  if (card.title === "Connect to Incubation") onViewCommunity();
                  if (card.title === "Start Learning") onViewLearning();
                }}
                className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border-2 border-ink shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] group cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]"
              >
                <div className="h-28 md:h-32 relative overflow-hidden">
                  <img src={card.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={card.title} />
                  <div className={cn("absolute inset-0 opacity-40", card.color)} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-ink shadow-lg">
                      {card.icon}
                    </div>
                  </div>
                </div>
                <div className="p-5 md:p-6 text-center">
                  <h4 className="font-bold text-sm md:text-base text-ink mb-1 md:mb-2">{card.title}</h4>
                  <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Dashboard Footer */}
      <footer className="bg-ink text-white pt-24 pb-12 px-4 relative overflow-hidden mt-20">
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
                Empowering the next generation of African leaders through an interactive e-learning in technology and agribusiness.
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
                <li><a href="#" className="hover:text-primary-light transition-colors">Sustainable Farm Management</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">AI-Powered Business Automation</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Agribusiness Innovation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-8">Company</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button onClick={onAboutClick} className="hover:text-primary-light transition-colors">About Us</button></li>
                <li><button onClick={onSupportClick} className="hover:text-primary-light transition-colors">Support</button></li>
                <li><button onClick={onPrivacyClick} className="hover:text-primary-light transition-colors">Privacy Policy</button></li>
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

function ProfileStep({ label, completed }: { label: string; completed: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
        completed ? "bg-primary border-primary text-white" : "border-gray-200"
      )}>
        {completed && <Check size={12} />}
      </div>
      <span className={cn("text-sm font-medium", completed ? "text-ink" : "text-gray-400")}>{label}</span>
    </li>
  );
}
