
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Search, 
  Plus, 
  Hash, 
  Users, 
  TrendingUp, 
  Image as ImageIcon, 
  Smile, 
  Send,
  ArrowLeft,
  Bell,
  Filter,
  Trophy
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { LeaderboardList } from "./Leaderboard";

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  category: string;
  isLiked?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      role: "AgroTech Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      isVerified: true
    },
    content: "Just finished the Week 2 module on IoT sensors in irrigation. The practical session on Airtable integration was a game changer! Has anyone tried connecting it with Zapier for automated alerts? 🌾🚀",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1000",
    likes: 124,
    comments: 18,
    shares: 5,
    timestamp: "2h ago",
    category: "AgroTech"
  },
  {
    id: "2",
    author: {
      name: "David Okoro",
      role: "Student @ Paradise Hub",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    },
    content: "The community here is amazing. I was struggling with my first automation workflow and three people reached out to help within minutes. Grateful for the support! #LearningTogether",
    likes: 89,
    comments: 12,
    shares: 2,
    timestamp: "4h ago",
    category: "General"
  },
  {
    id: "3",
    author: {
      name: "Elena Rodriguez",
      role: "Software Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      isVerified: true
    },
    content: "Pro tip: When using low-code tools, always document your logic in a separate doc. It makes debugging so much easier when your workflows get complex. Check out my latest template in the resources section! 🛠️",
    likes: 256,
    comments: 42,
    shares: 15,
    timestamp: "6h ago",
    category: "Tips & Tricks"
  }
];

const CHANNELS = [
  { name: "general", icon: Hash },
  { name: "agrotech", icon: Hash },
  { name: "career-advice", icon: Hash },
  { name: "showcase", icon: Hash },
  { name: "leaderboard", icon: Trophy },
  { name: "help-desk", icon: MessageSquare },
  { name: "announcements", icon: Bell }
];

const TRENDING = [
  "#AgroTech2024",
  "#NoCodeRevolution",
  "#ParadiseHub",
  "#AutomationTips",
  "#SustainableFarming"
];

interface CommunityHubProps {
  onBack: () => void;
  points: number;
  initialChannel?: string;
}

export default function CommunityHub({ onBack, points, initialChannel = "general" }: CommunityHubProps) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    setActiveChannel(initialChannel);
  }, [initialChannel]);
  const [isPosting, setIsPosting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    setIsPosting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        author: {
          name: "You",
          role: "Learner",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You"
        },
        content: newPostContent,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Just now",
        category: activeChannel
      };
      
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setIsPosting(false);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
                  <span className="font-display font-bold text-xl tracking-tight text-ink">
                    Incubation
                  </span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Channels</h3>
                  <div className="space-y-1">
                    {CHANNELS.map((channel) => (
                      <button
                        key={channel.name}
                        onClick={() => {
                          setActiveChannel(channel.name);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                          activeChannel === channel.name 
                            ? "bg-primary/5 text-primary" 
                            : "text-gray-500 hover:bg-gray-50 hover:text-ink"
                        )}
                      >
                        <channel.icon size={18} />
                        <span>{channel.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Left Sidebar - Channels (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2">
            <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
            <span className="font-display font-bold text-xl tracking-tight text-ink">
              Incubation <span className="text-primary">Hub</span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Channels</h3>
            <div className="space-y-1">
              {CHANNELS.map((channel) => (
                <button
                  key={channel.name}
                  onClick={() => setActiveChannel(channel.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeChannel === channel.name 
                      ? "bg-primary/5 text-primary" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-ink"
                  )}
                >
                  <channel.icon size={18} />
                  <span>{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Direct Messages</h3>
            <div className="space-y-3 px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} 
                      className="w-8 h-8 rounded-full bg-gray-100"
                      alt="User"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">Member {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Feed Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Hash size={20} className="text-primary" />
            </button>
            <button className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-primary transition-colors" onClick={onBack}>
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-base md:text-lg font-bold text-ink flex items-center gap-2">
              <span className="hidden sm:inline">#</span>
              {activeChannel}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-2 w-64">
              <Search size={16} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search incubation..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-6">
            {activeChannel === "leaderboard" ? (
              <div className="bg-ink text-white rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <h3 className="text-3xl font-display">Top Learners</h3>
                  <div className="flex items-center gap-2 text-primary-light font-bold text-sm">
                    <TrendingUp size={16} />
                    <span>WEEKLY RECAP</span>
                  </div>
                </div>
                <LeaderboardList />
                <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                  <div className="flex items-center justify-between p-6 bg-white/10 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        YOU
                      </div>
                      <div>
                        <div className="font-bold">Your Current Rank</div>
                        <div className="text-xs text-gray-400">Keep learning to climb higher!</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-primary-light">{points.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">YOUR POINTS</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Create Post Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-4">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" 
                  className="w-10 h-10 rounded-full bg-gray-100"
                  alt="Avatar"
                />
                <div className="flex-1">
                  <textarea
                    placeholder={`What's on your mind, learner? Share in #${activeChannel}...`}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <ImageIcon size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Smile size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Filter size={20} />
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || isPosting}
                      className={cn(
                        "px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                        newPostContent.trim() 
                          ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {isPosting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Post</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {posts.filter(p => activeChannel === "general" || p.category === activeChannel).map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <img 
                          src={post.author.avatar} 
                          className="w-10 h-10 rounded-full bg-gray-100"
                          alt={post.author.name}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-bold text-ink text-sm">{post.author.name}</h4>
                            {post.author.isVerified && (
                              <div className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                                <Plus size={8} className="text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.author.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{post.timestamp}</span>
                        <button className="p-1 text-gray-400 hover:text-ink">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {post.content}
                      </p>
                      
                      {post.image && (
                        <div className="rounded-2xl overflow-hidden border border-gray-100">
                          <img 
                            src={post.image} 
                            className="w-full h-auto object-cover max-h-[400px]"
                            alt="Post visual"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            "flex items-center gap-2 text-sm font-bold transition-colors",
                            post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                          )}
                        >
                          <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                          <MessageSquare size={18} />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                          <Share2 size={18} />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Stats & Trending */}
      <aside className="hidden xl:flex w-80 flex-col bg-white border-l border-gray-100 p-6 space-y-8">
        <div>
          <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            Trending Topics
          </h3>
          <div className="space-y-3">
            {TRENDING.map((tag) => (
              <div key={tag} className="group cursor-pointer">
                <p className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">{tag}</p>
                <p className="text-[10px] text-gray-400">1.2k posts this week</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
          <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <Users size={18} />
            Incubation Stats
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xl font-bold text-ink">12.4k</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Members</p>
            </div>
            <div>
              <p className="text-xl font-bold text-ink">842</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Online</p>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-colors">
            Invite Friends
          </button>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {[
              { title: "AgroTech Webinar", date: "Tomorrow, 2 PM", type: "Live" },
              { title: "No-Code Workshop", date: "Friday, 10 AM", type: "Workshop" }
            ].map((event, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">APR</span>
                  <span className="text-sm font-bold text-ink">{12 + i}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">{event.title}</h4>
                  <p className="text-[10px] text-gray-400">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
