import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, Loader2, Menu, GraduationCap, Users, User, AlertCircle } from "lucide-react";
import Groq from "groq-sdk";
import { ProfileData } from "@/src/lib/profileCompletion";
import BrandLogo from "./BrandLogo";
import NotificationBell from "./NotificationBell";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
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

// Build the system instruction once (pure function, no hooks needed)
function buildSystemInstruction(userName: string, points: number): string {
  return `
YOU ARE: The Paradise Hub Garden Assistant — a warm, knowledgeable guide for the Paradise Hub platform.
TONE: Professional, warm, and encouraging. Occasionally use garden/harvest metaphors (blooming, roots, cultivating, harvest) but don't overdo it.

ABOUT PARADISE HUB:
Paradise Hub is a premier learning and innovation center dedicated to bridging the gap between Agribusiness and Technology. It is built and operated by Pd Farms Ltd. The mission is to cultivate talent and foster innovation that drives sustainable growth across Africa. Paradise Hub empowers the next generation of African leaders through interactive e-learning and a hands-on approach, equipping learners with skills to thrive in the modern economy.

TAGLINES:
- "Cultivating the Next Generation of Agribusiness and Tech Leaders"
- "Cultivate Your Future. Choose Your Harvest."
- "Transform your career. Master the intersection of Agri-business and Technology."
- "The career growth you want, without putting your life on hold."

COURSE TRACKS (Career Tracks):
1. Agribusiness Innovation
   - Focus: Smart farming for a growing world.
   - Drives efficiency through data and automation to build a more resilient global food future.

2. Sustainable Farm Management
   - Focus: Mastering modern agriculture.
   - Bridges eco-friendly farming practices with strategic business growth and value chain success.

3. AI-Powered Business Automation
   - Focus: Work smarter, not harder.
   - Uses AI and low-code tools to eliminate manual tasks, optimize workflows, and scale business impact.

PLATFORM FEATURES:
- Courses (e-learning): Completing a course earns 50 Harvest Points.
- Incubation (Community): Making posts in the community earns 1 Harvest Point per post.
- Rewards Store: Redeem Harvest Points for real rewards.
- New users can get started for free.

REWARDS:
- 600 pts  → Paradise Hub Merch
- 1000 pts → Paradise Hub Hoodie
- 1500 pts → Business Consultation
- 2000 pts → Mentorship Session

NAVIGATION PAGES:
- Courses: Browse and enroll in the three career tracks.
- Incubation: The community space where learners connect, post, and earn points.
- About: Learn more about Paradise Hub's mission and story.
- Login: Access your learner account.
- Support: This assistant — for platform help and questions.
- Privacy Policy: Available in the footer.

USER DATA:
- Name: ${userName}
- Available Harvest Points: ${points}

RULES:
- Plain text only. No markdown, no bolding, no asterisks, no hashes, no bullet symbols in your output.
- Keep responses concise (2-4 sentences when possible).
- If you don't know something or it falls outside the platform, redirect the user to info@paradisehub.com.
- Never make up course prices, dates, or features not listed above.
  `.trim();
}

export default function SupportPage({
  availablePoints,
  onBack,
  userProfile,
  onViewLearning,
  onViewCommunity,
  onRewardsClick,
  onSupportClick,
  onViewProfile,
  currentUserId,
}: SupportPageProps) {
  const userName = userProfile?.full_name || "there";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Initialize Groq client
  const groq = useMemo(() => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }, []);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello ${userName}! I'm your Paradise Hub assistant. How can I help you blossom today?`,
      },
    ]);
  }, [userName]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);



  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !groq) return;

    const userText = input.trim();
    setInput("");

    const newUserMessage: Message = { role: "user", content: userText };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Build full history including system prompt for Groq
      const chatHistory: Message[] = [
        { role: "system", content: buildSystemInstruction(userName, availablePoints) },
        ...messages,
        newUserMessage
      ];

      const stream = await groq.chat.completions.create({
        messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
        model: "llama-3.1-8b-instant",
        stream: true,
      });

      // Add placeholder for AI response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let fullResponse = "";

      for await (const chunk of stream) {
        if (!isMountedRef.current) break;
        
        const content = chunk.choices[0]?.delta?.content || "";
        // Clean markdown as requested in system rules
        const cleanContent = content.replace(/[*#_`]/g, "");
        fullResponse += cleanContent;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullResponse };
          return updated;
        });
      }
    } catch (error: any) {
      console.error("Groq Error:", error);
      let friendlyError = "I encountered a little storm. Could you try asking that again?";
      
      if (error?.status === 429) {
        friendlyError = "The garden is a bit crowded right now. Please wait a moment!";
      }

      if (isMountedRef.current) {
        setMessages((prev) => [...prev, { role: "assistant", content: friendlyError }]);
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [input, isLoading, groq, messages, userName, availablePoints]);

  if (!import.meta.env.VITE_GROQ_API_KEY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-50 text-center">
        <AlertCircle size={48} className="text-emerald-600 mb-4" />
        <h1 className="text-2xl font-bold text-emerald-900">Assistant Offline</h1>
        <p className="text-emerald-700 mt-2">
          The Groq API key is missing. Add <code>VITE_GROQ_API_KEY</code> to your .env file.
        </p>
        <button onClick={onBack} className="mt-6 px-6 py-2 bg-primary text-white rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-ink selection:bg-primary/20">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 px-4 md:px-8 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onViewLearning}
        >
          <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" />
          <span className="font-display font-bold text-xl hidden xs:block">
            Paradise <span className="text-primary">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell
            currentUserId={currentUserId}
            open={isNotificationOpen}
            onOpenChange={setIsNotificationOpen}
          />

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              className="p-2 rounded-full bg-emerald-50 text-emerald-700"
            >
              <Menu size={20} />
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
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 space-y-1"
                  >
                    {[
                      { label: "Dashboard", onClick: onBack },
                      {
                        label: "Learning",
                        icon: <GraduationCap size={16} />,
                        onClick: onViewLearning,
                      },
                      {
                        label: "Incubation",
                        icon: <Users size={16} />,
                        onClick: onViewCommunity,
                      },
                      {
                        label: "Rewards",
                        icon: (
                          <span className="text-xs font-semibold">
                            {availablePoints}
                          </span>
                        ),
                        onClick: onRewardsClick,
                      },
                      {
                        label: "Profile",
                        icon: <User size={16} />,
                        onClick: onViewProfile,
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setIsMenuOpen(false);
                          item.onClick?.();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 flex items-center justify-between font-medium"
                      >
                        {item.label} {item.icon}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* ── Main chat area ── */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col flex-grow">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-primary text-white flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Garden Assistant</h2>
              <p className="text-primary-foreground/70 text-xs">
                Ready to help you grow
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.filter(m => m.role !== 'system').map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-gray-100 border rounded-tl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs ml-2">
                <Loader2 size={14} className="animate-spin" />
                Nurturing response…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 sm:p-6 border-t bg-gray-50/50 flex gap-2">
            <input
              className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // FIX 8: onKeyPress is deprecated — use onKeyDown
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="How can I earn more points?"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-white p-3 rounded-xl hover:opacity-90 disabled:opacity-30 transition-opacity"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}