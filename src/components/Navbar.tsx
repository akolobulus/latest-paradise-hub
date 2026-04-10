import { motion } from "motion/react";
import { Menu, X, Flame, Trophy, User, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import BrandLogo from "./BrandLogo";

export default function Navbar({ 
  onLoginClick, 
  onIncubationClick,
  onHomeClick,
  onCoursesClick,
  onAboutClick
}: { 
  onLoginClick?: () => void, 
  onIncubationClick?: () => void,
  onHomeClick?: () => void,
  onCoursesClick?: () => void,
  onAboutClick?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-8 py-3 flex items-center justify-between shadow-xl border border-gray-100">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              onHomeClick?.();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <BrandLogo wrapperClassName="w-10 h-10 rounded-full shadow-inner" imgClassName="w-full h-full" />
            <span className="font-display font-bold text-2xl tracking-tight text-ink">
              Paradise <span className="text-primary">Hub</span>
            </span>
          </motion.div>

          {/* Desktop Nav Links - Centered */}
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={onCoursesClick} className="text-gray-600 hover:text-primary font-semibold transition-colors">Courses</button>
            <button onClick={onIncubationClick} className="text-gray-600 hover:text-primary font-semibold transition-colors">Incubation</button>
            <button onClick={onAboutClick} className="text-gray-600 hover:text-primary font-semibold transition-colors">About</button>
          </div>

          {/* Right Side: Stats & Login */}
          <div className="hidden md:flex items-center gap-4">
            <div className="h-8 w-px bg-gray-100 mx-2" />
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-100 shadow-sm">
                <Flame size={18} fill="currentColor" />
                <span className="font-bold">7</span>
              </div>
              
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full border border-yellow-100 shadow-sm">
                <Zap size={18} fill="currentColor" />
                <span className="font-bold">1,240</span>
              </div>
            </div>

            <button 
              onClick={onLoginClick}
              className="bg-[#064E3B] text-white px-8 py-2.5 rounded-full font-bold hover:bg-ink transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
            >
              <User size={18} />
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-100 shadow-sm">
                <Flame size={18} fill="currentColor" />
                <span className="font-bold">7</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full border border-yellow-100 shadow-sm">
                <Zap size={18} fill="currentColor" />
                <span className="font-bold">1,240</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              onCoursesClick?.();
              setIsOpen(false);
            }}
            className="text-left text-gray-600 hover:text-primary font-medium transition-colors"
          >
            Courses
          </button>
          <button 
            onClick={() => {
              onIncubationClick?.();
              setIsOpen(false);
            }}
            className="text-left text-gray-600 hover:text-primary font-medium transition-colors"
          >
            Incubation
          </button>
          <button 
            onClick={() => {
              onAboutClick?.();
              setIsOpen(false);
            }}
            className="text-left text-gray-600 hover:text-primary font-medium transition-colors"
          >
            About
          </button>
          <hr className="border-gray-100" />
          <button 
            onClick={() => {
              onLoginClick?.();
              setIsOpen(false);
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium w-full"
          >
            Login
          </button>
        </motion.div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href}
      className="text-gray-600 hover:text-primary font-medium transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </a>
  );
}
