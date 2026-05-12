import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Bot, ArrowLeft, Send, Loader2, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { ProfileData } from "@/src/lib/profileCompletion";

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
}

export default function SupportPage({ availablePoints, onBack, userProfile }: SupportPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I'm your Paradise Hub assistant. How can I help you blossom today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-bold">
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="flex items-center gap-3 text-primary font-bold">
          <Bot size={20} />
          Support Assistant
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold overflow-hidden">
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(userProfile?.full_name)
          )}
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
