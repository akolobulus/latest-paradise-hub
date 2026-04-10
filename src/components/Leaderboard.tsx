import { motion } from "motion/react";
import { Trophy, Medal, Crown, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/src/lib/utils";

const LEADERBOARD_DATA = [
  { id: 1, name: "Chidi Okafor", points: 15420, streak: 42, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "Amaka Eze", points: 14850, streak: 28, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "Tunde Balogun", points: 13900, streak: 15, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
  { id: 4, name: "Zainab Yusuf", points: 12400, streak: 12, avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200&auto=format&fit=crop" },
  { id: 5, name: "Olumide Adeyemi", points: 11200, streak: 8, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
];

export function LeaderboardList({ data = LEADERBOARD_DATA }: { data?: typeof LEADERBOARD_DATA }) {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-4 relative z-10"
    >
      {data.map((user, index) => (
        <motion.div
          key={user.id}
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: { opacity: 1, x: 0 }
          }}
          className={cn(
            "flex items-center justify-between p-4 rounded-2xl border border-white/5 transition-all hover:bg-white/5 group",
            index === 0 && "bg-white/10 border-white/20"
          )}
        >
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <div className="w-6 md:w-8 shrink-0 text-center font-display font-bold text-gray-500 text-sm md:text-base">
              {index === 0 ? <Crown className="text-accent mx-auto" size={18} fill="currentColor" /> : `0${index + 1}`}
            </div>
            <div className="relative shrink-0">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/10"
                referrerPolicy="no-referrer"
              />
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  1
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold truncate text-sm md:text-base">{user.name}</div>
              <div className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                <Flame size={10} fill="currentColor" className="text-accent md:w-3 md:h-3" />
                {user.streak} Day Streak
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <div className="font-display font-bold text-primary-light text-sm md:text-base">{user.points.toLocaleString()}</div>
            <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">POINTS</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Leaderboard() {
  return (
    <section id="leaderboard" className="py-32 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Gamification Intro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-bold text-sm mb-6">
              <Trophy size={16} />
              <span>LEARNERS LEADERBOARD</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-7xl mb-8 leading-tight">
              Fuel Your <span className="text-accent italic">Ambition</span>.
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Paradise Hub is more than just learning. It's a journey. Earn points, maintain your streak, and climb the leaderboard to unlock exclusive rewards and agro-tech certifications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="p-6 bg-white rounded-3xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Flame size={24} fill="currentColor" />
                </div>
                <h4 className="text-xl font-bold mb-2">Daily Streaks</h4>
                <p className="text-gray-500 text-sm">Keep learning every day to multiply your points.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4">
                  <Medal size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Badges</h4>
                <p className="text-gray-500 text-sm">Unlock 50+ unique badges as you master new skills.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Leaderboard UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-ink text-white rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-3xl font-display">Top Learners</h3>
                <div className="flex items-center gap-2 text-primary-light font-bold text-sm">
                  <TrendingUp size={16} />
                  <span>WEEKLY RECAP</span>
                </div>
              </div>

              <LeaderboardList />

              <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
                View Full Leaderboard
              </button>
            </div>

            {/* Floating Achievement Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl shadow-2xl brutal-border hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <Trophy size={32} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">RECENT ACHIEVEMENT</div>
                  <div className="text-lg font-bold">Agro-Tech Pioneer</div>
                  <div className="text-sm text-primary font-bold">+500 XP</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
