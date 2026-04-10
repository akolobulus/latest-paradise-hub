import { motion } from "motion/react";
import { 
  Bell, 
  Grid, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ExternalLink,
  Search,
  Facebook,
  Linkedin,
  Users
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import BrandLogo from "./BrandLogo";
import { PaystackButton } from "react-paystack";

interface EnrolledProgram {
  id: number;
  title: string;
  image: string;
  category: string;
  startDate: string;
  duration: string;
  paymentStatus: 'pending' | 'verified';
  accessFee: string;
}

interface MyLearningProps {
  enrolledPrograms: EnrolledProgram[];
  onBack: () => void;
  onViewCourse: (course: any) => void;
  onViewAllPrograms: (programs: any[]) => void;
  onPaymentSuccess: (courseId: number) => void;
}

export default function MyLearning({ enrolledPrograms, onBack, onViewCourse, onViewAllPrograms, onPaymentSuccess }: MyLearningProps) {
  const pendingPrograms = enrolledPrograms.filter(p => p.paymentStatus === 'pending');
  const verifiedPrograms = enrolledPrograms.filter(p => p.paymentStatus === 'verified');

  // Paystack Public Key from environment variables
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_your_public_key_here";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
          <span className="font-display font-bold text-xl tracking-tight text-ink">
            Paradise <span className="text-primary">Hub</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button className="text-sm font-bold text-primary border-b-2 border-primary pb-1">My Learning</button>
          <button className="text-sm font-bold text-gray-400 hover:text-ink transition-colors">Incubation</button>
          <button className="text-sm font-bold text-gray-400 hover:text-ink transition-colors">Rewards</button>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100">
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

      <main className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl md:text-5xl font-display font-bold text-ink mb-2">My Learning</h1>
            <p className="text-gray-500 text-sm md:text-base">Track your progress and access your enrolled programs.</p>
          </div>
          <button 
            onClick={() => onViewAllPrograms([])}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all active:scale-95"
          >
            <Search size={18} />
            Explore More Programs
          </button>
        </div>

        {enrolledPrograms.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-12 md:p-20 border border-dashed border-gray-300 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <PlayCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-4">No programs enrolled yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              You haven't enrolled in any programs. Start your learning journey today by exploring our tech and agriculture courses.
            </p>
            <button 
              onClick={() => onViewAllPrograms([])}
              className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Browse Programs
            </button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Pending Verification Section */}
            {pendingPrograms.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-ink">Pending Verification</h2>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {pendingPrograms.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {pendingPrograms.map((program) => {
                    // Extract numeric amount from string like "₦5,000" or "11k naira only"
                    let amountStr = program.accessFee.toLowerCase();
                    let numericValue = 0;
                    
                    if (amountStr.includes('k')) {
                      numericValue = parseFloat(amountStr.replace(/[^0-9.]/g, '')) * 1000;
                    } else {
                      numericValue = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
                    }
                    
                    const amount = numericValue * 100; // Paystack expects amount in kobo

                    const componentProps = {
                      email: "peninahalhassan@gmail.com",
                      amount,
                      metadata: {
                        custom_fields: [
                          {
                            display_name: "Program Title",
                            variable_name: "program_title",
                            value: program.title,
                          },
                        ],
                      },
                      publicKey,
                      text: "Pay Now",
                      onSuccess: () => onPaymentSuccess(program.id),
                      onClose: () => console.log("Payment closed"),
                    };

                    return (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl overflow-hidden border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] relative group transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(17,24,39,1)]"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img src={program.image} className="w-full h-full object-cover grayscale-[0.5]" alt={program.title} />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-gray-100">
                              <Lock size={16} className="text-amber-600" />
                              <span className="text-xs font-bold text-ink uppercase tracking-wider">Locked</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{program.category}</span>
                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                              <Clock size={12} />
                              Awaiting Payment
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-ink mb-6 line-clamp-1">{program.title}</h3>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                              <p className="text-xs text-amber-800 leading-relaxed">
                                Access fee: <span className="font-bold">{program.accessFee}</span>. Please complete your payment.
                              </p>
                            </div>
                            
                            <PaystackButton 
                              {...componentProps}
                              className="w-full py-3 bg-ink text-white font-bold rounded-xl hover:bg-ink/90 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Verified Programs Section */}
            {verifiedPrograms.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <CheckCircle2 size={20} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-ink">Active Programs</h2>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {verifiedPrograms.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {verifiedPrograms.map((program) => (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-3xl overflow-hidden border-2 border-ink shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] hover:shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] transition-all group cursor-pointer hover:-translate-x-1 hover:-translate-y-1"
                      onClick={() => onViewCourse(program)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img src={program.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={program.title} />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider">
                          {program.category}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-xl">
                            <PlayCircle size={24} />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-ink mb-4 group-hover:text-primary transition-colors">{program.title}</h3>
                        
                        <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            Started: {program.startDate}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {program.duration}
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-500">Course Progress</span>
                            <span className="text-xs font-bold text-primary">
                              {program.id === 101 ? '15%' : '0%'}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000" 
                              style={{ width: program.id === 101 ? '15%' : '0%' }} 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav Spacer */}
      <div className="h-20 md:hidden" />

      {/* Footer */}
      <footer className="bg-ink text-white pt-24 pb-12 px-4 relative overflow-hidden mt-20">
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
                Empowering the next generation of African leaders through gamified e-learning in technology and agriculture.
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
                <li><a href="#" className="hover:text-primary-light transition-colors">Agro-Tech Innovation</a></li>
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
