import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  Grid, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Users,
  Trophy,
  HelpCircle,
  GraduationCap
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import NotificationBell from "./NotificationBell";
import PageFooter from "./PageFooter";
import { cn } from "@/src/lib/utils";
import { ProfileData } from "@/src/lib/profileCompletion";

interface AllProgramsProps {
  currentUserId?: string;
  programs: any[];
  user?: { full_name?: string };
  userProfile?: ProfileData | null;
  points?: number;
  enrolledPrograms?: any[];
  onBack: () => void;
  onLogoClick?: () => void;
  onViewDetails: (program: any) => void;
  onViewCourseByTitle?: (courseTitle: string) => void;
  onViewProfile?: () => void;
  onViewLearning?: () => void;
  onViewCommunity?: () => void;
  onRewardsClick?: () => void;
  onSupportClick?: () => void;
  onEnroll: (program: any) => void;
}

export default function AllPrograms({ currentUserId, programs, user, userProfile, points = 0, enrolledPrograms = [], onBack, onLogoClick, onViewDetails, onViewCourseByTitle, onViewProfile, onViewLearning, onViewCommunity, onRewardsClick, onSupportClick, onEnroll }: AllProgramsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to get initials from full name
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
          <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
          <span className="font-display font-bold text-xl tracking-tight text-ink">
            Paradise <span className="text-primary">Hub</span>
          </span>
        </div>
        
        <div className="relative flex items-center gap-3 md:gap-6">
          <button
            onClick={() => onViewProfile?.()}
            className="bg-accent/10 border border-accent/20 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-accent/90 transition-colors"
          >
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">H</div>
            <span className="text-xs md:text-sm font-bold">{points.toLocaleString()} points</span>
          </button>
          <NotificationBell currentUserId={currentUserId} />
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
          >
            <Grid size={22} />
          </button>
          <button
            onClick={() => onViewProfile?.()}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm md:text-base overflow-hidden border border-gray-200 hover:border-primary transition-all"
          >
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(userProfile?.full_name || user?.full_name)
            )}
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onViewLearning?.();
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <GraduationCap size={24} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Learning</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onViewCommunity?.();
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <Users size={24} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Incubation</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onRewardsClick?.();
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                        <Trophy size={24} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Rewards</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSupportClick?.();
                      }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-primary/5 group-hover:text-primary transition-all">
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
      </nav>

      {/* Hero Banner */}
      <div className="bg-primary text-white py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-yellow-400 font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block">
              Current Programs
            </span>
            <h1 className="text-2xl md:text-6xl font-display font-bold mb-4 md:mb-6">
              Unlock Unlimited Learning
            </h1>
            <p className="text-white/80 text-sm md:text-xl max-w-2xl">
              Find detailed information about your enrolled program here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="bg-white rounded-[32px] p-6 md:p-12 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programs.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onViewDetails(program)}
                className="bg-white rounded-3xl overflow-hidden border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] group flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] cursor-pointer"
              >
                <div className="h-48 md:h-56 overflow-hidden relative">
                  <img 
                    src={program.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={program.title} 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider border border-gray-100">
                    {program.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-ink">{program.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                    {program.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-8 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {program.startDate}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {program.duration}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(program);
                      }}
                      className="py-3 rounded-xl border-2 border-ink font-bold text-sm hover:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      View Details
                    </button>
                    {(() => {
                      const isEnrolled = enrolledPrograms.some(
                        (p) => Number(p.id) === Number(program.id) || Number(p.course_id) === Number(program.id)
                      );
                      return (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isEnrolled) onEnroll(program);
                          }}
                          disabled={isEnrolled}
                          className={cn(
                            "py-3 rounded-xl border-2 font-bold text-sm transition-colors",
                            isEnrolled
                              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#00FF85] border-ink text-ink hover:bg-[#00E676] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                          )}
                        >
                          {isEnrolled ? "Enrolled" : "Enroll Now"}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-gray-100 flex justify-center">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-primary font-bold hover:underline group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PageFooter onLogoClick={onLogoClick} onViewCourseByTitle={onViewCourseByTitle} />
    </div>
  );
}
