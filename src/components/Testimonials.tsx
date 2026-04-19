import { motion } from "motion/react";
import { Play, Instagram, Twitter, Linkedin, Youtube, Facebook, Users } from "lucide-react";
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
              Cultivating the Next Generation of Tech and Agribusiness Leaders
            </h3>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Paradise Hub is a premier learning and innovation center dedicated to bridging the gap between technology and agriculture. We empower the next generation of African leaders by providing specialized training in AI-Powered Business Automation, Sustainable Farm Management, and Agribusiness Innovation.
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

export function Footer({ aiImage }: { aiImage?: string }) {
  return (
    <footer className="bg-ink text-white pt-32 pb-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section - Overlapping */}
        <div className="absolute top-0 left-4 right-4 -translate-y-1/2 bg-primary rounded-[40px] p-8 md:p-12 text-center shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] max-w-5xl mx-auto border-4 border-ink my-12">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Subscribe to Paradise Updates</h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
            We bring together industry leaders to share insights, spark ideas, and help you level up.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-8 py-4 rounded-full bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-all"
            />
            <button className="px-12 py-4 rounded-full bg-ink text-white font-bold hover:bg-white hover:text-ink transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              SUBSCRIBE
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-16 mb-24 pt-48">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <BrandLogo wrapperClassName="w-10 h-10 rounded-[50%] bg-white shadow-md border-2 border-white" imgClassName="w-full h-full" />
              <span className="font-display font-bold text-2xl tracking-tight">
                Paradise <span className="text-primary-light">Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-8">
              Empowering the next generation of African leaders through interactive e-learning in technology and agribusiness.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={20} />} />
              <SocialIcon icon={<Linkedin size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Youtube size={20} />} />
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Career Tracks</h4>
            <ul className="space-y-4 text-gray-400">
              <li><FooterLink href="#">Sustainable Farm Management</FooterLink></li>
              <li><FooterLink href="#">AI-Powered Business Automation</FooterLink></li>
              <li><FooterLink href="#">Agribusiness Innovation</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li><FooterLink href="#">About Us</FooterLink></li>
              <li><FooterLink href="#">Support</FooterLink></li>
              <li><FooterLink href="#">Careers</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
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
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
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
