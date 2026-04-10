import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowLeft, 
  Github, 
  Chrome, 
  Linkedin, 
  Facebook,
  Sparkles
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";

export default function AuthPage({ initialMode = "login", onBack, onLoginSuccess }: { initialMode?: "login" | "signup", onBack: () => void, onLoginSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock successful login/signup
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Branding & Visual - Hidden on mobile for better focus */}
      <div className="relative hidden lg:flex w-[45%] h-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop" 
          alt="Agro-Tech Future" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Animated Overlay */}
        <motion.div 
          animate={{ 
            backgroundColor: [
              "rgba(10, 10, 10, 0.8)", // Dark
              "rgba(6, 95, 70, 0.8)",   // Green (Primary)
              "rgba(240, 253, 244, 0.4)" // Light Green
            ]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          className="absolute inset-0 mix-blend-multiply" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
        
        <div className="relative h-full p-16 flex flex-col justify-between text-white">
          <motion.button 
            onClick={onBack}
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors w-fit bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Home</span>
          </motion.button>

          <div className="max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <BrandLogo wrapperClassName="w-12 h-12 rounded-2xl overflow-hidden shadow-xl" imgClassName="w-full h-full" />
              <span className="font-display font-bold text-3xl tracking-tight drop-shadow-md">
                Paradise <span className="text-primary-light">Hub</span>
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-primary-light drop-shadow-lg">
                  {mode === "login" ? "Welcome back to the Hub!" : "Start Your Agro-Tech Journey."}
                </h1>
                <p className="text-xl text-white font-medium leading-relaxed drop-shadow-md">
                  {mode === "login" 
                    ? "Continue your path to becoming a world-class professional. Your progress is waiting." 
                    : "Join learners building the next generation of solutions for Africa's future."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold text-white shadow-sm">
            <span className="bg-black/20 backdrop-blur-sm px-2 py-1 rounded">© 2026 Paradise Hub Nigeria</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 h-full overflow-y-auto bg-white p-6 lg:p-16 flex flex-col items-center">
        <div className="w-full max-w-md pt-12 lg:pt-20">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-12">
            <motion.button 
              onClick={onBack}
              className="absolute top-6 left-6 text-gray-400 hover:text-ink transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <BrandLogo wrapperClassName="w-12 h-12 rounded-2xl shadow-lg mb-4" imgClassName="w-full h-full" />
            <h1 className="font-display font-bold text-2xl tracking-tight text-ink">
              Paradise <span className="text-primary">Hub</span>
            </h1>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-3 text-ink">
              {mode === "login" ? "Welcome back!" : "Sign up for Paradise Hub"}
            </h2>
            <p className="text-gray-600 font-medium">
              {mode === "login" ? "Please enter your details." : "Join our talent community today!"}
            </p>
          </div>

          {/* Social Sign In */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-gray-500 font-bold tracking-widest">Social sign {mode === "login" ? "in" : "up"} options</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SocialButton icon={<Chrome className="text-primary" size={20} />} />
              <SocialButton icon={<Linkedin className="text-primary" size={20} />} />
              <SocialButton icon={<Facebook className="text-primary" size={20} />} />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-gray-500 font-bold tracking-widest">Manual sign {mode === "login" ? "in" : "up"}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" placeholder="John" icon={<User size={18} />} />
                    <InputField label="Last Name" placeholder="Doe" icon={<User size={18} />} />
                  </div>
                )}
                
                <InputField label="Email" type="email" placeholder="name@example.com" icon={<Mail size={18} />} />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink">Password</label>
                    {mode === "login" && (
                      <button className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-ink placeholder:text-gray-400"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-ink transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      I agree to receive commercial communications from Paradise Hub through all available channels and may opt out at any time.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg brutal-border-hover shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              {mode === "login" ? "Sign In" : "Create Account"}
              <Sparkles size={20} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary font-bold hover:underline"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Struggling to log in or sign up? <br />
              <button className="text-primary font-bold hover:underline">Click here</button> to contact us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center py-3 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
    >
      {icon}
    </motion.button>
  );
}

function InputField({ label, placeholder, type = "text", icon }: { label: string, placeholder: string, type?: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-ink">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-ink placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
