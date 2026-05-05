import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Trophy, Gift, GraduationCap, ChevronDown, ChevronUp, Clock, ArrowUpRight, ExternalLink, Plus, Sparkles } from "lucide-react";

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  image: string;
  category: string;
  badge?: string;
}

interface EarningMethod {
  category: string;
  items: {
    points: number;
    title: string;
    description?: string;
    actionLabel?: string;
  }[];
}

const EARNING_METHODS: EarningMethod[] = [
  {
    category: "Engage with the Community",
    items: [
      { points: 1, title: "Each post on community", description: "Share your thoughts and insights with the hub", actionLabel: "Post" },
      { points: 10, title: "Popular Topic Bonus", description: "Earned when your post gets at least 5 likes or comments", actionLabel: "View Stats" },
      { points: 20, title: "Invite a Friend", description: "Earn rewards when someone signs up using your referral link", actionLabel: "Invite" },
    ]
  },
  {
    category: "Nurture Your Growth",
    items: [
      { points: 20, title: "Full Profile Completion", description: "Includes profile picture and all details filled meticulously", actionLabel: "Update Profile" },
    ]
  },
  {
    category: "Learning & Mastery",
    items: [
      { points: 50, title: "Each course completed", description: "Successfully blossom through a full learning module", actionLabel: "Start Learning" },
    ]
  }
];

const REWARDS: Reward[] = [
  {
    id: "1",
    title: "Branded Merch from Paradise Hub",
    description: "Exclusive branded merchandise sponsored by Pd Farms ltd.",
    points: 600,
    image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=800",
    category: "Merchandise",
    badge: "600 pts"
  },
  {
    id: "2",
    title: "Branded Paradise Hoodie",
    description: "Stay warm and stylish with our premium organic cotton hub hoodie.",
    points: 1000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
    category: "Apparel",
    badge: "1000 pts"
  },
  {
    id: "3",
    title: "1-on-1 Growth Consultation",
    description: "Gain personal insights and personalized career strategy from hub professionals.",
    points: 1500,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    category: "Mentorship",
    badge: "1500 pts"
  },
  {
    id: "4",
    title: "Internship / Elite Mentorship",
    description: "Unlock high-level career opportunities and recurring direct guidance from industry masters.",
    points: 2000,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    category: "Career",
    badge: "2000 pts"
  }
];

interface RewardsPageProps {
  availablePoints: number;
  expiringPoints?: number;
  onBack: () => void;
}

export default function RewardsPage({ availablePoints, expiringPoints = 0, onBack }: RewardsPageProps) {
  const [isWaysToEarnOpen, setIsWaysToEarnOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background text-ink selection:bg-primary/20 selection:text-primary">
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 px-4 md:px-8 h-20 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-bold">
          <ArrowUpRight size={18} className="rotate-180" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-primary" />
          <span className="text-sm font-bold">Harvest Rewards</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold">RH</div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl sm:text-6xl font-bold text-primary leading-none">
              {availablePoints}
            </motion.h1>
            <p className="text-gray-500 font-medium pl-1 text-base sm:text-lg">Harvest Points Available</p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 w-full md:min-w-[320px] md:w-auto">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-sm border border-gray-100">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{expiringPoints} Harvest Points expiring</p>
              <p className="text-xs text-gray-500">at the end of this season</p>
            </div>
          </motion.div>
        </section>

        <section className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-display font-bold text-primary">Nurture Your Harvest Points</h2>
            <p className="text-gray-600 leading-relaxed">
              Harvest Points are designed to support and celebrate your growth in the Sanctuary. As you take action, you'll earn points that blossom into exciting rewards at full bloom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "Earn Points", color: "bg-green-100 text-green-700", desc: "Complete milestones and engage with the community to grow your stash!" },
              { icon: GraduationCap, title: "Grow & Skill", color: "bg-blue-100 text-blue-700", desc: "Complete your specialized paths to unlock premium redemptions!" },
              { icon: Gift, title: "Redeem Rewards", color: "bg-amber-100 text-amber-700", desc: "Select exciting rewards, submit your request, and enjoy your harvest!" },
              { icon: Trophy, title: "Celebrate Success", color: "bg-purple-100 text-purple-700", desc: "Use your reward and celebrate—you've cultivated this excellence!" },
            ].map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center space-y-4 group">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="font-bold text-primary group-hover:text-primary-light transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed px-4">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
          <button onClick={() => setIsWaysToEarnOpen(!isWaysToEarnOpen)} className="w-full h-24 px-8 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Plus size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold">Ways to Earn Harvest Points</h2>
            </div>
            {isWaysToEarnOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          <AnimatePresence>
            {isWaysToEarnOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                <div className="p-8 pt-0 space-y-8 divide-y divide-gray-100">
                  {EARNING_METHODS.map((method) => (
                    <div key={method.category} className="pt-8 first:pt-0 space-y-6">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-light rounded-full" />
                        <h3 className="font-display font-medium text-gray-800 tracking-wide text-lg underline underline-offset-8 decoration-primary-light/30 italic">{method.category}</h3>
                      </div>
                      <div className="space-y-4">
                        {method.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between group p-3 hover:bg-gray-50 rounded-xl transition-all gap-4 sm:gap-2">
                            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                              <span className="font-mono text-primary font-bold text-lg min-w-[60px] sm:min-w-[70px] mt-0.5 sm:mt-0">{item.points} pts</span>
                              <div>
                                <p className="font-medium text-gray-900 flex flex-wrap items-center gap-2">
                                  {item.title}
                                  {item.actionLabel && (
                                    <span className="text-primary-light text-[10px] uppercase tracking-wider font-bold bg-primary-light/10 px-2 py-0.5 rounded flex items-center gap-1 group-hover:bg-primary-light/20 transition-colors cursor-pointer">
                                      {item.actionLabel} <ExternalLink size={10} />
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500 italic mt-0.5 leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 p-2 text-primary hover:bg-primary/10 rounded-lg transition-all transform scale-90 group-hover:scale-100 self-end sm:self-auto">
                              <ArrowUpRight size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold">Rewards</h2>
            <p className="text-gray-600 max-w-3xl leading-relaxed">
              Cultivate your specialized skills to unlock exciting seasonal rewards! Meanwhile, rack up Harvest Points by completing milestones, building readiness, and engaging with the Paradise Hub Community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REWARDS.map((reward, i) => (
              <motion.div key={reward.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={reward.image} alt={reward.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {reward.badge && (
                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-md text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {reward.badge}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                    <Gift size={18} />
                  </div>
                </div>
                <div className="p-6 space-y-4 flex-grow flex flex-col">
                  <div className="space-y-2 flex-grow">
                    <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">{reward.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{reward.description}</p>
                  </div>
                  <div className="pt-4 space-y-4 border-t border-gray-50">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>Progress</span>
                      <span className="text-primary">{availablePoints}/{reward.points} Points</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-light transition-all duration-1000 ease-out" style={{ width: `${Math.min((availablePoints / reward.points) * 100, 100)}%` }} />
                    </div>
                    <button disabled={availablePoints < reward.points} className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${availablePoints >= reward.points ? 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}>
                      Redeem Reward
                    </button>
                    <button className="w-full text-sm font-bold text-primary-light hover:text-primary transition-colors py-1">
                      Learn more
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
