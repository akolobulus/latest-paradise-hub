
import { useState, useEffect, useRef } from "react";
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
  Trophy,
  Edit2,
  Trash2,
  X // Added X icon for the modal close button
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import { cn } from "@/src/lib/utils";
import { LeaderboardList } from "./Leaderboard";
import { supabase } from "@/src/lib/supabase";
import { calculateTrendingTopics, TrendingTopic, formatNumber } from "@/src/lib/trendingUtils";

interface Post {
  id: string;
  author: {
    id: string;
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

// Helper to format timestamps
const timeAgo = (dateStr: string) => {
  const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const CHANNELS = [
  { name: "general", icon: Hash },
  { name: "agribusiness", icon: Hash },
  { name: "career-advice", icon: Hash },
  { name: "showcase", icon: Hash },
  { name: "leaderboard", icon: Trophy },
  { name: "help-desk", icon: MessageSquare },
  { name: "announcements", icon: Bell }
];

const TRENDING = [
  "#Agribusiness2026",
  "#NoCodeRevolution",
  "#ParadiseHub",
  "#AutomationTips",
  "#SustainableFarming"
];

interface CommunityHubProps {
  onBack: () => void;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  points: number;
  userProfile?: { full_name?: string; avatar_url?: string | null } | null;
  initialChannel?: string;
}

export default function CommunityHub({ onBack, onLogoClick, onProfileClick, points, userProfile, initialChannel = "general" }: CommunityHubProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Real-time data state
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [onlineMembers, setOnlineMembers] = useState(0);

  // Edit & Delete State
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // --- New States for Threads & DMs ---
  const [activeView, setActiveView] = useState<"channel" | "thread" | "dm">("channel");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [showAllDms, setShowAllDms] = useState(false);
  const [activeDmUser, setActiveDmUser] = useState<any>(null);
  const [activeThreadPost, setActiveThreadPost] = useState<Post | null>(null);
  const [threadComments, setThreadComments] = useState<any[]>([]);
  const [newThreadComment, setNewThreadComment] = useState("");
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [newDmContent, setNewDmContent] = useState("");
  
  // --- State for Profile Pop-up Modal ---
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);

  // Helper to get initials from full name
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    setActiveChannel(initialChannel);
  }, [initialChannel]);

  // Fetch current user on mount
  useEffect(() => {
    const setupUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    setupUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsersList();
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeThreadPost) {
      fetchThreadComments(activeThreadPost.id);
    }
  }, [activeThreadPost]);

  useEffect(() => {
    if (activeDmUser) {
      fetchDmMessages(activeDmUser.id);
    }
  }, [activeDmUser]);

  // Fetch posts and set up Realtime EVERY TIME the activeChannel changes
  useEffect(() => {
    fetchPosts();
    fetchMemberStats();
    calculateTrendingTopicsFromAllPosts();

    // Setup Realtime isolated to the current channel
    const targetChannel = activeChannel === 'leaderboard' ? 'general' : activeChannel;
    
    const channelSub = supabase
      .channel(`room:${targetChannel}`) // Unique socket channel name
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'posts',
        filter: `channel=eq.${targetChannel}` // Only listen to this specific chat room!
      }, () => {
        fetchPosts();
        calculateTrendingTopicsFromAllPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, [activeChannel]);

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Force leaderboard to fetch from general, otherwise STRICTLY isolate the active channel
      const targetChannel = activeChannel === 'leaderboard' ? 'general' : activeChannel;
      
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          channel,
          created_at,
          author_id,
          profiles (id, full_name, avatar_url),
          post_likes (user_id),
          post_comments (id)
        `)
        .eq('channel', targetChannel) // FIX: This strictly isolates every room
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (!error && data) {
        const mappedPosts: Post[] = data.map((post: any) => ({
          id: post.id,
          author: {
            // Using author_id as fallback ensures we always have the ID to compare for Edit/Delete
            id: post.author_id || post.profiles?.id, 
            name: post.profiles?.full_name || 'Learner',
            role: 'Learner',
            avatar: post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_id}`
          },
          content: post.content,
          image: post.image_url,
          likes: post.post_likes ? post.post_likes.length : 0,
          comments: post.post_comments ? post.post_comments.length : 0,
          shares: 0,
          timestamp: timeAgo(post.created_at),
          category: post.channel,
          isLiked: user && post.post_likes 
            ? post.post_likes.some((like: any) => like.user_id === user.id) 
            : false
        }));
        setPosts(mappedPosts);
        
        // Calculate trending topics from ALL posts (not just active channel)
        calculateTrendingTopicsFromAllPosts();
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Fetch all posts to calculate trending topics
  const calculateTrendingTopicsFromAllPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('content')
        .limit(100); // Get recent posts

      if (!error && data) {
        const trending = calculateTrendingTopics(data, 5);
        setTrendingTopics(trending);
      }
    } catch (error) {
      console.error('Error calculating trending topics:', error);
    }
  };

  // Fetch member stats
  const fetchMemberStats = async () => {
    try {
      // Get total members from profiles table
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setTotalMembers(totalCount || 0);

      // For "online" members, we can approximate based on recent activity
      // Get users who had activity in the last 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { count: onlineCount } = await supabase
        .from('posts')
        .select('author_id', { count: 'exact', head: true })
        .gte('created_at', thirtyMinutesAgo);

      setOnlineMembers(onlineCount || 0);
    } catch (error) {
      console.error('Error fetching member stats:', error);
    }
  };

  const fetchUsersList = async () => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', currentUser.id)
        .order('full_name', { ascending: true });

      if (!error && data) setUsersList(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchThreadComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('id, content, created_at, author_id, profiles (id, full_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) setThreadComments(data);
    } catch (error) {
      console.error('Error fetching thread comments:', error);
    }
  };

  const fetchDmMessages = async (userId: string) => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('id, content, created_at, sender_id, receiver_id')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id}))`)
        .order('created_at', { ascending: true });

      if (!error && data) setDmMessages(data);
    } catch (error) {
      console.error('Error fetching direct messages:', error);
    }
  };

  const sendThreadComment = async () => {
    if (!newThreadComment.trim() || !currentUser || !activeThreadPost) return;

    try {
      const content = newThreadComment;
      setNewThreadComment("");
      const { error } = await supabase.from('post_comments').insert({
        post_id: activeThreadPost.id,
        author_id: currentUser.id,
        content,
      });
      if (error) throw error;
      await fetchThreadComments(activeThreadPost.id);
      await fetchPosts();
    } catch (error) {
      console.error('Error sending thread comment:', error);
      setNewThreadComment(newThreadComment);
    }
  };

  const sendDirectMessage = async () => {
    if (!newDmContent.trim() || !currentUser || !activeDmUser) return;

    try {
      const content = newDmContent;
      setNewDmContent("");
      const { error } = await supabase.from('direct_messages').insert({
        sender_id: currentUser.id,
        receiver_id: activeDmUser.id,
        content,
      });
      if (error) throw error;
      await fetchDmMessages(activeDmUser.id);
    } catch (error) {
      console.error('Error sending DM:', error);
      setNewDmContent(newDmContent);
    }
  };

  const addNotification = (notification: { type: string; text: string; relatedId?: string }) => {
    setNotifications((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        isRead: false,
        created_at: new Date().toISOString(),
        ...notification,
      },
      ...prev,
    ].slice(0, 12));
    setUnreadCount((count) => count + 1);
  };

  const toggleNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const notificationChannel = supabase
      .channel('community-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        const newPost: any = payload.new;
        if (currentUser && newPost.author_id === currentUser.id) return;
        addNotification({
          type: 'post',
          text: `New post in #${newPost.channel}`,
          relatedId: newPost.id,
        });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, (payload) => {
        const newMessage: any = payload.new;
        if (!currentUser || newMessage.sender_id === currentUser.id) return;
        if (newMessage.receiver_id === currentUser.id) {
          const sender = usersList.find((user) => user.id === newMessage.sender_id);
          addNotification({
            type: 'dm',
            text: `New message from ${sender?.full_name || 'Someone'}`,
            relatedId: newMessage.id,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
    };
  }, [currentUser, usersList]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!currentUser) {
      alert('Please log in to like posts');
      return;
    }

    // Optimistic UI update
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !isLiked
        };
      }
      return post;
    }));

    try {
      if (isLiked) {
        await supabase.from('post_likes').delete().match({ post_id: postId, user_id: currentUser.id });
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: currentUser.id });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      await fetchPosts(); // Revert on failure
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !currentUser) return;
    
    setIsPosting(true);
    const contentToPost = newPostContent;
    const targetChannel = activeChannel === 'leaderboard' ? 'general' : activeChannel;
    
    try {
      setNewPostContent(""); // Clear input immediately for snappy UX
      
      const { error } = await supabase.from('posts').insert({
        author_id: currentUser.id,
        content: contentToPost,
        channel: targetChannel
      });

      if (error) throw error;
      
      // Force an immediate fetch so the user sees their post instantly, 
      // rather than waiting for the Realtime broadcast to bounce back.
      await fetchPosts();
      
    } catch (error) {
      console.error('Error creating post:', error);
      setNewPostContent(contentToPost); // Restore text if it failed
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  // ----- EDIT & DELETE HANDLERS -----

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    setOpenDropdownId(null);
    setPosts(prev => prev.filter(p => p.id !== postId)); // Optimistic delete
    
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      await fetchPosts(); // Revert on error
    }
  };

  const startEditing = (post: Post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setOpenDropdownId(null);
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdatePost = async (postId: string) => {
    if (!editContent.trim()) return;
    
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: editContent } : p)); // Optimistic update
    setEditingPostId(null);

    try {
      const { error } = await supabase.from('posts').update({ content: editContent }).eq('id', postId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating post:', error);
      await fetchPosts(); // Revert on error
    }
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" onClick={() => setOpenDropdownId(null)}>
      
      {/* Profile Pop-up Modal */}
      <AnimatePresence>
        {selectedUserProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUserProfile(null)}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-[101]"
            >
              <button
                onClick={() => setSelectedUserProfile(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-ink hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mb-4 overflow-hidden shadow-inner border border-primary/20">
                  {selectedUserProfile.avatar || selectedUserProfile.avatar_url ? (
                    <img
                      src={selectedUserProfile.avatar || selectedUserProfile.avatar_url}
                      alt={selectedUserProfile.name || selectedUserProfile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(selectedUserProfile.name || selectedUserProfile.full_name)
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-ink">{selectedUserProfile.name || selectedUserProfile.full_name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedUserProfile.role || "Learner"}
                </p>
                
                {currentUser?.id !== selectedUserProfile.id && (
                  <button
                    onClick={() => {
                      setSelectedUserProfile(null); // Close modal
                      setActiveView("dm"); // Switch view
                      
                      // Map format so activeDmUser handles both post.author structures and regular user structures
                      setActiveDmUser({
                        id: selectedUserProfile.id,
                        full_name: selectedUserProfile.name || selectedUserProfile.full_name,
                        avatar_url: selectedUserProfile.avatar || selectedUserProfile.avatar_url
                      });
                      
                      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                    }}
                    className="mt-8 w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageSquare size={18} />
                    Message Directly
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
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
                          setActiveView("channel");
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

                <div>
                  <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Direct Messages</h3>
                  <div className="space-y-3 px-4">
                    {usersList.slice(0, showAllDms ? usersList.length : 3).map((user) => (
                      <div 
                        key={user.id}
                        onClick={() => {
                          setActiveView("dm");
                          setActiveDmUser(user);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-all",
                          activeView === "dm" && activeDmUser?.id === user.id ? "bg-primary/5" : "hover:bg-gray-50"
                        )}
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-primary/20">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.full_name || "User"} className="w-full h-full object-cover" />
                            ) : (
                              getInitials(user.full_name)
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <span className={cn(
                          "text-sm font-medium transition-colors truncate",
                          activeView === "dm" && activeDmUser?.id === user.id ? "text-primary font-bold" : "text-gray-600 group-hover:text-primary"
                        )}>
                          {user.full_name || "Learner"}
                        </span>
                      </div>
                    ))}

                    {usersList.length > 3 && (
                      <button 
                        onClick={() => setShowAllDms(!showAllDms)}
                        className="w-full text-left px-2 py-1 text-xs font-bold text-primary hover:underline"
                      >
                        {showAllDms ? "Show Less" : `View ${usersList.length - 3} More`}
                      </button>
                    )}
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
          
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
            <BrandLogo wrapperClassName="w-8 h-8 rounded-lg shadow-inner" imgClassName="w-full h-full" />
            <span className="font-display font-bold text-xl tracking-tight text-ink">
              Incubation <span className="text-primary">Hub</span>
            </span>
          </div>

          {/* User Profile Card in Sidebar */}
          {userProfile && (
            <div
              onClick={() => onProfileClick?.()}
              className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-3xl p-3 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                {userProfile.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(userProfile.full_name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-ink truncate">{userProfile.full_name || "Learner"}</div>
                <div className="text-xs text-gray-400">{points} points</div>
              </div>
            </div>
          )}
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
                    setActiveView("channel");
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

          <div>
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Direct Messages</h3>
            <div className="space-y-3 px-4">
              {usersList.slice(0, showAllDms ? usersList.length : 3).map((user) => (
                <div 
                  key={user.id}
                  onClick={() => {
                    setActiveView("dm");
                    setActiveDmUser(user);
                  }}
                  className={cn(
                    "flex items-center gap-3 group cursor-pointer p-2 rounded-xl transition-all",
                    activeView === "dm" && activeDmUser?.id === user.id ? "bg-primary/5" : "hover:bg-gray-50"
                  )}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden border border-primary/20">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name || "User"} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.full_name)
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <span className={cn(
                    "text-sm font-medium transition-colors truncate",
                    activeView === "dm" && activeDmUser?.id === user.id ? "text-primary font-bold" : "text-gray-600 group-hover:text-primary"
                  )}>
                    {user.full_name || "Learner"}
                  </span>
                </div>
              ))}

              {usersList.length > 3 && (
                <button 
                  onClick={() => setShowAllDms(!showAllDms)}
                  className="w-full text-left px-2 py-1 text-xs font-bold text-primary hover:underline"
                >
                  {showAllDms ? "Show Less" : `View ${usersList.length - 3} More`}
                </button>
              )}
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
              <button
                type="button"
                onClick={() => searchInputRef.current?.focus()}
                className="text-gray-400 mr-2"
              >
                <Search size={16} />
              </button>
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={toggleNotifications}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-ink">Notifications</p>
                        <p className="text-xs text-gray-500">{notifications.length} recent update{notifications.length === 1 ? '' : 's'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifications([]);
                          setUnreadCount(0);
                        }}
                        className="text-[10px] uppercase text-primary font-bold"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-400">No new notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "px-4 py-3 border-b border-gray-100",
                              notification.isRead ? "bg-white" : "bg-primary/5"
                            )}
                          >
                            <p className="text-sm text-gray-700">{notification.text}</p>
                            <p className="mt-1 text-[10px] text-gray-400">{timeAgo(notification.created_at)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {userProfile && (
              <div
                onClick={() => onProfileClick?.()}
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border-2 border-transparent hover:border-primary transition-all overflow-hidden cursor-pointer"
              >
                {userProfile.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(userProfile.full_name)
                )}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-6">
            {activeView === "dm" && activeDmUser ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                <button 
                  onClick={() => setActiveView("channel")}
                  className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary"
                >
                  <ArrowLeft size={16} /> Back to #{activeChannel}
                </button>
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-4">
                  <div 
                    onClick={() => setSelectedUserProfile(activeDmUser)}
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base overflow-hidden border border-primary/20 shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
                  >
                    {activeDmUser.avatar_url ? (
                      <img src={activeDmUser.avatar_url} alt={activeDmUser.full_name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(activeDmUser.full_name)
                    )}
                  </div>
                  <div>
                    <h2 
                      onClick={() => setSelectedUserProfile(activeDmUser)}
                      className="font-bold text-lg text-ink cursor-pointer hover:text-primary transition-colors"
                    >
                      {activeDmUser.full_name}
                    </h2>
                    <p className="text-xs text-gray-400">Direct Message</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {dmMessages.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center mt-10">No direct messages yet. Start the conversation.</p>
                  ) : (
                    dmMessages.map((message) => (
                      <div 
                        key={message.id}
                        className={cn(
                          "rounded-3xl p-4 border max-w-[80%]",
                          message.sender_id === currentUser?.id ? "bg-primary/5 border-primary/20 self-end" : "bg-gray-50 border-gray-100 self-start"
                        )}
                      >
                        <p className="text-sm text-gray-700">{message.content}</p>
                        <p className="mt-2 text-[10px] text-gray-400">{timeAgo(message.created_at)}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-auto relative">
                  <textarea 
                    value={newDmContent}
                    onChange={(e) => setNewDmContent(e.target.value)}
                    placeholder={`Message @${activeDmUser.full_name}...`}
                    className="w-full bg-gray-50 rounded-2xl p-4 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[100px]"
                  />
                  <button 
                    onClick={sendDirectMessage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : activeView === "thread" && activeThreadPost ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <button 
                  onClick={() => setActiveView("channel")}
                  className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary"
                >
                  <ArrowLeft size={16} /> Back to #{activeChannel}
                </button>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activeThreadPost.author.avatar} 
                      className="w-12 h-12 rounded-full bg-gray-100 object-cover cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                      alt={activeThreadPost.author.name}
                      onClick={() => setSelectedUserProfile(activeThreadPost.author)}
                    />
                    <div>
                      <p 
                        className="font-bold text-ink cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setSelectedUserProfile(activeThreadPost.author)}
                      >
                        {activeThreadPost.author.name}
                      </p>
                      <p className="text-sm text-gray-500">{activeThreadPost.content}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{activeThreadPost.comments} replies</div>
                </div>

                <div className="space-y-4 mb-6">
                  {threadComments.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No replies yet. Be the first to reply.</p>
                  ) : (
                    threadComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-3xl p-4 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div 
                            onClick={() => setSelectedUserProfile({
                              id: comment.author_id,
                              name: comment.profiles?.full_name || 'Learner',
                              avatar: comment.profiles?.avatar_url
                            })}
                            className="w-6 h-6 rounded-full bg-primary/10 overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary/30"
                          >
                            {comment.profiles?.avatar_url ? (
                              <img src={comment.profiles.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-primary">
                                {getInitials(comment.profiles?.full_name)}
                              </div>
                            )}
                          </div>
                          <p 
                            className="text-sm font-bold text-ink cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setSelectedUserProfile({
                              id: comment.author_id,
                              name: comment.profiles?.full_name || 'Learner',
                              avatar: comment.profiles?.avatar_url
                            })}
                          >
                            {comment.profiles?.full_name || 'Learner'}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 pl-8">{comment.content}</p>
                        <p className="mt-2 text-[10px] text-gray-400 pl-8">{timeAgo(comment.created_at)}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-auto relative">
                  <textarea 
                    value={newThreadComment}
                    onChange={(e) => setNewThreadComment(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-gray-50 rounded-2xl p-4 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[100px]"
                  />
                  <button 
                    onClick={sendThreadComment}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : activeChannel === "leaderboard" ? (
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
              </div>
            ) : (
              <>
                {/* Create Post Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex gap-4">
                    <img 
                      src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.id || 'guest'}`}
                      className="w-10 h-10 rounded-full bg-gray-100 object-cover"
                      alt="Your Avatar"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder={`What's on your mind, learner? Share in #${activeChannel}...`}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none"
                        disabled={!currentUser}
                      />
                      {!currentUser && (
                        <p className="text-xs text-gray-400 mt-2">Please log in to create posts</p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" disabled={!currentUser}>
                            <ImageIcon size={20} />
                          </button>
                        </div>
                        <button
                          onClick={handleCreatePost}
                          disabled={!newPostContent.trim() || isPosting || !currentUser}
                          className={cn(
                            "px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                            newPostContent.trim() && currentUser
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
                <div className="space-y-6 pb-20">
                  {isLoadingPosts ? (
                    <div className="text-center p-10 text-gray-400 font-medium">Loading posts...</div>
                  ) : posts.length === 0 ? (
                    <div className="text-center p-10 text-gray-400 font-medium">Be the first to post in this channel!</div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center p-10 text-gray-400 font-medium">No posts match your search.</div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {filteredPosts.map((post) => (
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
                              className="w-10 h-10 rounded-full bg-gray-100 object-cover cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                              alt={post.author.name}
                              onClick={() => setSelectedUserProfile(post.author)}
                            />
                            <div>
                              <div className="flex items-center gap-1">
                                <h4 
                                  className="font-bold text-ink text-sm cursor-pointer hover:text-primary transition-colors"
                                  onClick={() => setSelectedUserProfile(post.author)}
                                >
                                  {post.author.name}
                                </h4>
                                {post.author.isVerified && (
                                  <div className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                                    <Plus size={8} className="text-white" />
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.author.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 relative">
                            <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md hidden sm:block">
                              #{post.category}
                            </span>
                            <span className="text-xs text-gray-400">{post.timestamp}</span>

                            {/* Dropdown Menu (Only visible to post author) */}
                            {currentUser?.id === post.author.id && (
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownId(openDropdownId === post.id ? null : post.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-ink rounded-full transition-colors ml-2 focus:outline-none"
                                >
                                  <MoreHorizontal size={18} />
                                </button>
                                
                                <AnimatePresence>
                                  {openDropdownId === post.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-[0px_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 origin-top-right"
                                    >
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); startEditing(post); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-gray-50 text-ink transition-colors"
                                      >
                                        <Edit2 size={16} className="text-gray-400" /> Edit
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-50 text-red-500 transition-colors mt-1"
                                      >
                                        <Trash2 size={16} /> Delete
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Render Edit Mode or Normal Content */}
                          {editingPostId === post.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-gray-50 rounded-xl p-4 text-sm outline-none border-2 border-gray-200 focus:border-primary min-h-[100px] resize-none"
                              />
                              <div className="flex gap-3 justify-end">
                                <button 
                                  onClick={() => setEditingPostId(null)} 
                                  className="px-5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleUpdatePost(post.id)} 
                                  className="px-5 py-2 text-xs font-bold bg-primary text-white hover:bg-primary-light rounded-lg transition-colors shadow-lg shadow-primary/20"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {post.content}
                            </p>
                          )}
                          
                          {post.image && !editingPostId && (
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
                              onClick={() => handleLike(post.id, !!post.isLiked)}
                              className={cn(
                                "flex items-center gap-2 text-sm font-bold transition-colors",
                                post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                              )}
                            >
                              <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                              <span>{post.likes}</span>
                            </button>
                            <button 
                            onClick={() => {
                              setActiveView("thread");
                              setActiveThreadPost(post);
                            }}
                            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors"
                          >
                              <MessageSquare size={18} />
                              <span>{post.comments}</span>
                          </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  )}
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
            {trendingTopics.length > 0 ? (
              trendingTopics.map((topic, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <p className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">{topic.tag}</p>
                  <p className="text-[10px] text-gray-400">{formatNumber(topic.count)} posts this week</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">No trending topics yet</p>
            )}
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
          <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <Users size={18} />
            Incubation Stats
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xl font-bold text-ink">{formatNumber(totalMembers)}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Members</p>
            </div>
            <div>
              <p className="text-xl font-bold text-ink">{formatNumber(onlineMembers)}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Active</p>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-colors">
            Invite Friends
          </button>
        </div>
      </aside>
    </div>
  );
}
