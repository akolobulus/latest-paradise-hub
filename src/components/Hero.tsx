import { motion } from "motion/react";
import { ArrowRight, Sparkles, Sprout, Cpu } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Hero({ 
  isLoggedIn, 
  userProfile,
  onStartClick,
  onDashboardClick
}: { 
  isLoggedIn?: boolean,
  userProfile?: { full_name?: string, avatar_url?: string | null } | null,
  onStartClick?: () => void,
  onDashboardClick?: () => void
}) {  // Helper to get initials from full name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F8FAFC]">
      {/* Decorative Tech-Agri Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#065F46 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-96 h-96 border-[1px] border-primary/10 rounded-full" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] border-[1px] border-primary/5 rounded-full" 
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-ink leading-[1.1] tracking-tighter">
              Cultivate Your <span className="relative inline-block">
                <span className="relative z-10">Future</span>
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute bottom-2 left-0 h-4 bg-[#A3E635]/40 -z-10" 
                />
              </span>.
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl font-medium leading-relaxed"
          >
            Choose Your Path. Transform your career. Master the intersection of <span className="text-primary font-bold">Agri-business</span> and <span className="text-primary font-bold">Technology</span>.
          </motion.h2>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-gray-500 mb-12 max-w-xl leading-relaxed"
          >
            Join learners building the next generation of agri-business solutions in Africa. <br className="hidden md:block" />
            We currently offer specialized Agribusiness and Tech courses to accelerate your career.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            {isLoggedIn && userProfile ? (
              <>
                <div className="flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden border-2 border-primary/20">
                    {userProfile.avatar_url ? (
                      <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(userProfile.full_name)
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Welcome back,</p>
                    <p className="font-bold text-ink text-lg">{userProfile.full_name || 'Learner'}</p>
                  </div>
                </div>
                <button 
                  onClick={onDashboardClick}
                  className="group relative bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all brutal-border hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]"
                >
                  <span className="flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onStartClick}
                  className="group relative bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all brutal-border hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]"
                >
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="text-ink font-bold text-lg hover:text-primary transition-colors flex items-center gap-2 group">
                  Browse Courses
                  <div className="w-6 h-[2px] bg-primary/20 group-hover:w-10 transition-all" />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
