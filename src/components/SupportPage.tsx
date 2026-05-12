import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, ArrowLeft, Send, Loader2, Sparkles, Menu, Bell, GraduationCap, Users, Trophy, HelpCircle, User } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from "@/src/lib/profileCompletion";
import BrandLogo from "./BrandLogo";
import NotificationBell from "./NotificationBell";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

interface Message {
  role: "user" | "model";
  text: string;
}

interface SupportPageProps {
  availablePoints: number;
  onBack: () => void;
  userProfile?: ProfileData | null;
  onViewLearning?: () => void;
  onViewCommunity?: () => void;
  onRewardsClick?: () => void;
  onSupportClick?: () => void;
  onViewProfile?: () => void;
  currentUserId?: string;
}

export default function SupportPage({ availablePoints, onBack, userProfile, onViewLearning, onViewCommunity, onRewardsClick, onSupportClick, onViewProfile, currentUserId }: SupportPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I'm your Paradise Hub assistant. How can I help you blossom today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper to get initials from full name
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    if (!geminiApiKey) {
      setMessages(prev => [...prev, { role: "model", text: "Hello Welcome TO Paradise Hub" }]);
      setIsLoading(false);
      return;
    }

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are the Paradise Hub Support Assistant. 
          You help users understand how to earn and redeem Harvest Points.
          Points Earning Rules:
          - Each post on community: 1 point
          - Popular Topic Bonus (at least 5 likes/comments): 10 points
          - Full Profile Completion (pic + all details): 20 points
          - Each course completed: 50 points
          - Referral signup (someone signs up using your link): 20 points
          Available Rewards:
          - 600 pts: Branded Merch from Paradise Hub (sponsored by Pd Farms ltd)
          - 1000 pts: Branded Paradise Hoodie
          - 1500 pts: 1-on-1 Growth Consultation
          - 2000 pts: Internship/Elite Mentorship Series
          Tone: Helpful, encouraging, professional but warm (using garden/growth metaphors like blossom, nurture, harvest).
          Keep responses concise and plain text ONLY. Do NOT use markdown formatting like bolding, italics, or asterisks.
          `
        },
        history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      let fullResponse = "";
      setMessages(prev => [...prev, { role: "model", text: "" }]);

      for await (const chunk of result) {
        const cleanChunk = chunk.text.replace(/\*/g, "");
        fullResponse += cleanChunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullResponse;
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", text: "I'm sorry, I encountered a little storm in the garden. Could you try blooming that question again?" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-ink selection:bg-primary/20 selection:text-primary">
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-8">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onViewLearning}>
            <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
            <span className="font-display font-bold text-xl tracking-tight hidden xs:block">
              Paradise <span className="text-primary">Hub</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:block">
            <NotificationBell currentUserId={currentUserId} open={isNotificationOpen} onOpenChange={setIsNotificationOpen} />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 md:p-2 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <Menu size={20} className="md:w-[22px] md:h-[22px]" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                  >
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onBack();
                        }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Dashboard</span>
                      </button>

                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewLearning?.();
                        }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Learning</span>
                        <GraduationCap size={20} className="text-primary" />
                      </button>

                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewCommunity?.();
                        }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Incubation</span>
                        <Users size={20} className="text-primary" />
                      </button>

                      <button
                        onClick={() => { setIsMenuOpen(false); onRewardsClick?.(); }}
                        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-bold text-ink">Rewards</span>
                        <span className="text-sm text-gray-500">{availablePoints.toLocaleString()}</span>
                      </button>

                      <button onClick={() => { setIsMenuOpen(false); onSupportClick?.(); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="font-bold text-ink">Support</span>
                        <HelpCircle size={20} className="text-primary" />
                      </button>

                      <button onClick={() => { setIsMenuOpen(false); onViewProfile?.(); }} className="w-full rounded-2xl px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="font-bold text-ink">Profile</span>
                        <User size={20} className="text-primary" />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)]">
        <div className="hidden sm:flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} />
            <span className="font-display font-bold text-sm">Paradise Hub Support</span>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">H</div>
            <span className="font-bold text-sm tracking-tight">{availablePoints} points</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col flex-grow relative">
          <div className="p-4 sm:p-6 border-b bg-primary text-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-inner">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-white font-display font-bold text-base sm:text-lg">Support</h2>
                <p className="text-primary-foreground/80 text-[10px] sm:text-xs">Always here to help you bloom</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
            {messages.map((message, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl flex flex-col gap-1 shadow-sm ${message.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-gray-100 text-ink rounded-tl-none border border-gray-200"}`}>
                  <span className="text-[9px] sm:text-[10px] opacity-50 font-bold uppercase tracking-widest">{message.role === "user" ? "You" : "Assistant"}</span>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-2xl flex gap-2 items-center text-gray-400">
                  <Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-medium">Assistant is thinking...</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 sm:p-6 border-t bg-gray-50/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} placeholder="Ask about points..." className="flex-grow bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner" />
              <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-primary text-white p-3 sm:p-3.5 rounded-xl hover:bg-primary-light transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100">
                <Send size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 text-center mt-3 uppercase tracking-[0.2em] font-medium">Paradise Hub AI</p>
          </div>
        </div>
      </main>
    </div>
  );
}
