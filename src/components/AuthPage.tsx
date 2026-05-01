import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowLeft,
  Sparkles
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";

export default function AuthPage({ initialMode = "login", onBack, onLoginSuccess }: { initialMode?: "login" | "signup", onBack: () => void, onLoginSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: `${firstName} ${lastName}`.trim() }
          }
        });
        if (signUpError) throw signUpError;
        alert("Check your email for the confirmation link!");
        // Clear form
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Login Handler - Updated with redirectTo
  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // This ensures Google sends them back to your app after logging in
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
    } catch (err: any) {
      setError(err.message);
    }
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
              <BrandLogo wrapperClassName="w-12 h-12 rounded-full overflow-hidden shadow-xl bg-white" imgClassName="w-full h-full" />
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
            <p className="text-gray-500 font-medium">
              {mode === "login" ? "Please enter your details." : "Join our talent community today!"}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
            >
              <p className="text-red-700 font-bold text-sm">{error}</p>
            </motion.div>
          )}

          {/* Single Google Sign In Button */}
          <div className="mb-8">
            <SocialButton 
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              } 
              text={`Continue with Google`}
              onClick={handleGoogleLogin} 
            />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-gray-500 font-bold tracking-widest">Or sign {mode === "login" ? "in" : "up"} with email</span>
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
                    <InputField 
                      label="First Name" 
                      placeholder="John" 
                      icon={<User size={18} />}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <InputField 
                      label="Last Name" 
                      placeholder="Doe" 
                      icon={<User size={18} />}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                )}
                
                <InputField 
                  label="Email" 
                  type="email" 
                  placeholder="name@example.com" 
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-ink">Password</label>
                    {mode === "login" && (
                      <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                    <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary focus:ring-primary" required />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      I agree to receive commercial communications from Paradise Hub through all available channels and may opt out at any time.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg brutal-border-hover shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <Sparkles size={20} />
                </>
              )}
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

// Updated SocialButton to accept text and span full width
function SocialButton({ icon, text, onClick }: { icon: React.ReactNode, text?: string, onClick?: () => void }) {
  return (
    <motion.button 
      onClick={onClick}
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center gap-3 w-full py-3.5 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all shadow-sm"
    >
      {icon}
      {text && <span className="font-bold text-ink text-sm">{text}</span>}
    </motion.button>
  );
}

function InputField({ label, placeholder, type = "text", icon, value, onChange }: { label: string, placeholder: string, type?: string, icon: React.ReactNode, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
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
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl border-2 border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium text-ink placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}