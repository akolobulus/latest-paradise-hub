import { motion } from "motion/react";
import { 
  Bell, 
  Grid, 
  Calendar, 
  Clock, 
  ArrowLeft
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";

interface AllProgramsProps {
  programs: any[];
  userProfile?: { full_name?: string; avatar_url?: string | null } | null;
  enrolledPrograms?: any[];
  onBack: () => void;
  onLogoClick?: () => void;
  onViewDetails: (program: any) => void;
  onEnroll: (program: any) => void;
}

export default function AllPrograms({ programs, userProfile, enrolledPrograms = [], onBack, onLogoClick, onViewDetails, onEnroll }: AllProgramsProps) {
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
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100">
            <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xs md:text-sm font-bold">0 points</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <Grid size={22} />
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm md:text-base">
            PA
          </div>
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
                className="bg-white rounded-3xl overflow-hidden border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] group flex flex-col transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(17,24,39,1)]"
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
                      onClick={() => onViewDetails(program)}
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
                          onClick={() => !isEnrolled && onEnroll(program)}
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
      <footer className="bg-ink text-white pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <BrandLogo wrapperClassName="w-10 h-10 rounded-lg shadow-inner" imgClassName="w-full h-full" />
                <span className="font-display font-bold text-2xl tracking-tight">
                  Paradise <span className="text-primary-light">Hub</span>
                </span>
              </div>
              <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-8">
                Empowering the next generation of African leaders through an interactive e-learning in technology and agribusiness.
              </p>
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
                <li><a href="#" className="hover:text-primary-light transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-primary-light transition-colors">Careers</a></li>
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
