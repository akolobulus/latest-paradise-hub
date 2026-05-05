import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Instagram, Twitter, Linkedin, Youtube, Facebook, Users, CheckCircle, X, Globe } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";
import BrandLogo from "./BrandLogo";

export default function Testimonials() {
  return (
    <section id="about" className="mt-4 pt-24 pb-48 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold text-ink mb-6 tracking-tight"
          >
            Welcome to Paradise Hub
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group rounded-[32px] overflow-hidden aspect-video border-4 border-ink shadow-[12px_12px_0px_0px_rgba(17,24,39,1)]"
          >
            <img 
              src="/community-group.jpg" 
              alt="Paradise Hub Community" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-ink/20" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
              >
                <Play size={32} fill="currentColor" />
              </motion.button>
            </div>
          </motion.div>

          {/* About Text Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-ink leading-tight">
              Cultivating the Next Generation of Agribusiness and TechLeaders
            </h3>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Paradise Hub is a premier learning and innovation center dedicated to bridging the gap between Agribusiness and Technology. We empower the next generation of African leaders by providing specialized training in Agribusiness Innovation, Sustainable Farm Management, and AI-Powered Business Automation.
              </p>
              <p>
                Our mission is to cultivate talent and foster innovation that drives sustainable growth across the continent. Through our interactive e-learning platform and hands-on approach, we ensure our learners are equipped with the skills needed to thrive in the modern economy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ 
  aiImage, 
  isLoggedIn,
  onLogoClick,
  onAboutClick,
  onSupportClick,
  onPrivacyClick
}: { 
  aiImage?: string,
  isLoggedIn?: boolean,
  onLogoClick?: () => void,
  onAboutClick?: () => void,
  onSupportClick?: () => void,
  onPrivacyClick?: () => void
}) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [subError, setSubError] = useState("");

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubError("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === "23505") {
          setSubError("You're already subscribed with this email!");
        } else {
          throw error;
        }
      } else {
        setShowSuccess(true);
        setEmail("");
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      setSubError("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-ink text-white pt-32 pb-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section - Overlapping */}
        <div className="absolute top-0 left-4 right-4 -translate-y-1/2 bg-primary rounded-[40px] p-8 md:p-12 text-center shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] max-w-5xl mx-auto border-4 border-ink my-12">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Subscribe to Paradise Updates</h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            We bring together industry leaders to share insights, spark ideas, and help you level up.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              required
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-8 py-4 rounded-full bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-all"
            />
            <button type="submit" disabled={isSubscribing} className="px-12 py-4 rounded-full bg-ink text-white font-bold hover:bg-white hover:text-ink transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] disabled:opacity-50">
              {isSubscribing ? "Wait..." : "SUBSCRIBE"}
            </button>
          </form>
          {subError && <p className="text-red-200 mt-4">{subError}</p>}
        </div>

        <div className="grid md:grid-cols-4 gap-16 mb-24 pt-48">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
              <BrandLogo wrapperClassName="w-10 h-10 rounded-[50%] bg-white shadow-md border-2 border-white" imgClassName="w-full h-full" />
              <span className="font-display font-bold text-2xl tracking-tight">
                Paradise <span className="text-primary-light">Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-8">
              Empowering the next generation of African leaders through interactive e-learning in technology and agribusiness.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={20} />} href="https://www.instagram.com/paradisedynamic/" />
              <SocialIcon icon={<Youtube size={20} />} href="https://www.youtube.com/@PARADISEDYNAMICFARMSLTD" />
              <SocialIcon icon={<Twitter size={20} />} href="https://x.com/pdfarms_48" />
              <SocialIcon icon={<Globe size={20} />} href="https://pdfarms.com/" />
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Career Tracks</h4>
            <ul className="space-y-4 text-gray-400">
              <li><FooterLink href="#">Agribusiness Innovation</FooterLink></li>
              <li><FooterLink href="#">Sustainable Farm Management</FooterLink></li>
              <li><FooterLink href="#">AI-Powered Business Automation</FooterLink></li>
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
          <div>© Copyright 2026 <a href="https://pdfarms.com" target="_blank" rel="noreferrer" className="text-primary hover:text-white transition-colors">Paradise Dynamic Farms</a>. All rights reserved.</div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="pointer-events-auto max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center relative"
              >
                <button
                  onClick={() => setShowSuccess(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-ink hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-ink mb-3">You're on the list!</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Thank you for subscribing. We'll keep you updated with the latest courses, tech trends, and agribusiness news.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Awesome, thanks!
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="hover:text-primary-light transition-colors">
      {children}
    </a>
  );
}
