import { motion } from "motion/react";
import { Trophy, Medal, Crown, Flame, TrendingUp, Star, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { supabase } from "@/src/lib/supabase";

interface LeaderboardMember {
  id: string;
  name: string;
  points: number;
  streak: number;
  avatar: string | null;
  level: number;
  engagement: string;
}

// Helper to get initials from full name
const getInitials = (name?: string) => {
  if (!name) return "U";
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

export function LeaderboardList({ data = [] }: { data?: LeaderboardMember[] }) {
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
      // Added max-height and overflow-y-auto so the full list is scrollable!
      className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
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
              {/* Dynamic Avatar with Initials Fallback */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-primary font-bold text-sm overflow-hidden border-2 border-white/10 bg-white/5">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-white/80">{getInitials(user.name)}</span>
                )}
              </div>
              
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-accent/50">
                  1
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="font-bold truncate text-sm md:text-base text-white flex items-center gap-2">
                {user.name}
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/70 font-medium">
                  Lv. {user.level}
                </span>
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Flame size={10} fill="currentColor" className={user.streak > 5 ? "text-accent" : "text-gray-500"} />
                  {user.streak} Day Streak
                </div>
                <div className="flex items-center gap-1 hidden sm:flex">
                  <Activity size={10} className="text-primary-light" />
                  {user.engagement}
                </div>
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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, points, avatar_url')
          .order('points', { ascending: false }); // Removed .limit(5) to fetch everyone!

        if (!error && data) {
          const mappedData: LeaderboardMember[] = data.map((user: any) => {
            const pts = user.points || 0;
            
            // Calculate dynamic stats based on points
            const calculatedLevel = Math.floor(pts / 500) + 1;
            let engagementStatus = "New Learner";
            if (pts > 2000) engagementStatus = "Top Contributor";
            else if (pts > 1000) engagementStatus = "Highly Active";
            else if (pts > 300) engagementStatus = "Active";

            return {
              id: user.id,
              name: user.full_name || 'Learner',
              points: pts,
              streak: Math.floor(pts / 100), // Approximate streak
              avatar: user.avatar_url,
              level: calculatedLevel,
              engagement: engagementStatus
            };
          });
          setLeaderboardData(mappedData);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to profile changes for real-time leaderboard updates
    const sub = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

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
                  <Star size={24} />
                </div>
                <h4 className="text-xl font-bold mb-2">Level Up</h4>
                <p className="text-gray-500 text-sm">Every 500 points increases your hub level and unlocks perks.</p>
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                  <h3 className="text-3xl font-display">Hub Members</h3>
                  <p className="text-sm text-gray-400 mt-1">{leaderboardData.length} active learners</p>
                </div>
                <div className="flex items-center gap-2 text-primary-light font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-full">
                  <Activity size={16} />
                  <span>LIVE</span>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-white/70">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  Loading leaderboard...
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="text-center py-12 text-white/70">No learners on the board yet!</div>
              ) : (
                <LeaderboardList data={leaderboardData} />
              )}
            </div>

            {/* Floating Achievement Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-2xl brutal-border hidden md:block z-20 bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <Trophy size={32} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase">RECENT ACHIEVEMENT</div>
                  <div className="text-lg font-bold text-ink">Agro-Tech Pioneer</div>
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