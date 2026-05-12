import { Instagram, Twitter, Youtube, Globe } from "lucide-react";
import BrandLogo from "./BrandLogo";

const COURSE_TITLES = [
  "Agribusiness Innovation",
  "Sustainable Farm Management",
  "AI-Powered Business Automation"
];

interface PageFooterProps {
  onViewCourseByTitle?: (courseTitle: string) => void;
  onLogoClick?: () => void;
  onAboutClick?: () => void;
  onSupportClick?: () => void;
  onPrivacyClick?: () => void;
}

export default function PageFooter({
  onViewCourseByTitle,
  onLogoClick,
  onAboutClick,
  onSupportClick,
  onPrivacyClick,
}: PageFooterProps) {
  return (
    <footer className="bg-ink text-white pt-24 pb-12 px-4 relative overflow-hidden mt-20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
              <BrandLogo wrapperClassName="w-10 h-10 rounded-full shadow-inner bg-white" imgClassName="w-full h-full" />
              <span className="font-display font-bold text-2xl tracking-tight">
                Paradise <span className="text-primary-light">Hub</span>
              </span>
            </div>
            <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-8">
              Empowering the next generation of African leaders through interactive e-learning in agribusiness and technology.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/paradisedynamic/"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@PARADISEDYNAMICFARMSLTD"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://x.com/pdfarms_48"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://pdfarms.com/"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Career Tracks</h4>
            <ul className="space-y-4 text-gray-400">
              {COURSE_TITLES.map((title) => (
                <li key={title}>
                  {onViewCourseByTitle ? (
                    <button
                      type="button"
                      onClick={() => onViewCourseByTitle(title)}
                      className="hover:text-primary-light transition-colors text-left"
                    >
                      {title}
                    </button>
                  ) : (
                    <a href="#" className="hover:text-primary-light transition-colors">
                      {title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                {onAboutClick ? (
                  <button onClick={onAboutClick} className="hover:text-primary-light transition-colors">
                    About Us
                  </button>
                ) : (
                  <a href="#about" className="hover:text-primary-light transition-colors">
                    About Us
                  </a>
                )}
              </li>
              <li>
                {onSupportClick ? (
                  <button onClick={onSupportClick} className="hover:text-primary-light transition-colors">
                    Support
                  </button>
                ) : (
                  <a href="#support" className="hover:text-primary-light transition-colors">
                    Support
                  </a>
                )}
              </li>
              <li>
                {onPrivacyClick ? (
                  <button onClick={onPrivacyClick} className="hover:text-primary-light transition-colors">
                    Privacy Policy
                  </button>
                ) : (
                  <a href="#privacy" className="hover:text-primary-light transition-colors">
                    Privacy Policy
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
          <div>
            © Copyright 2026 Paradise Hub by <a href="https://pdfarms.com" target="_blank" rel="noreferrer" className="text-primary hover:text-white transition-colors">Paradise Dynamic Farms LTD</a>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
