import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, ArrowRight, X } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface NotificationItem {
  id: string;
  type: "post" | "dm";
  text: string;
  relatedId?: string;
  created_at: string;
  isRead: boolean;
}

type NotificationListener = (state: { notifications: NotificationItem[]; unreadCount: number }) => void;

const notificationStore = {
  currentUserId: "",
  notifications: [] as NotificationItem[],
  unreadCount: 0,
  listeners: new Set<NotificationListener>(),
  channel: null as any,
};

const notifyListeners = () => {
  const payload = {
    notifications: notificationStore.notifications,
    unreadCount: notificationStore.unreadCount,
  };
  notificationStore.listeners.forEach((listener) => listener(payload));
};

const addNotification = (notification: Omit<NotificationItem, "id" | "isRead">) => {
  const next: NotificationItem[] = [
    {
      ...notification,
      id: `${Date.now()}-${Math.random()}`,
      isRead: false,
    },
    ...notificationStore.notifications,
  ].slice(0, 12);

  notificationStore.notifications = next;
  notificationStore.unreadCount = next.filter((item) => !item.isRead).length;
  notifyListeners();
};

const markAllNotificationsRead = () => {
  notificationStore.notifications = notificationStore.notifications.map((notification) => ({
    ...notification,
    isRead: true,
  }));
  notificationStore.unreadCount = 0;
  notifyListeners();
};

const timeAgo = (isoDate: string) => {
  const createdAt = new Date(isoDate).getTime();
  const delta = Math.floor((Date.now() - createdAt) / 1000);
  if (delta < 60) return `${delta}s ago`;
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
  return `${Math.floor(delta / 86400)}d ago`;
};

const ensureNotificationSubscription = (userId?: string) => {
  if (!userId) return;
  if (notificationStore.channel && notificationStore.currentUserId === userId) return;

  if (notificationStore.channel) {
    supabase.removeChannel(notificationStore.channel);
    notificationStore.channel = null;
  }

  notificationStore.currentUserId = userId;

  const channel = supabase
    .channel("realtime-notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => {
        const newPost: any = payload.new;
        if (!newPost || newPost.author_id === userId) return;

        addNotification({
          type: "post",
          text: `New post in ${newPost.channel || "community"}`,
          relatedId: newPost.id,
          created_at: new Date().toISOString(),
        });
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "direct_messages" },
      (payload) => {
        const newMessage: any = payload.new;
        if (!newMessage || newMessage.sender_id === userId || newMessage.receiver_id !== userId) return;

        addNotification({
          type: "dm",
          text: "New direct message",
          relatedId: newMessage.id,
          created_at: new Date().toISOString(),
        });
      }
    )
    .subscribe();

  notificationStore.channel = channel;
};

const useNotifications = (currentUserId?: string) => {
  const [state, setState] = useState({
    notifications: notificationStore.notifications,
    unreadCount: notificationStore.unreadCount,
  });

  useEffect(() => {
    const listener: NotificationListener = (next) => setState(next);
    notificationStore.listeners.add(listener);

    if (currentUserId) {
      ensureNotificationSubscription(currentUserId);
    }

    return () => {
      notificationStore.listeners.delete(listener);
    };
  }, [currentUserId]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    markAllRead: markAllNotificationsRead,
  };
};

interface NotificationBellProps {
  currentUserId?: string;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function NotificationBell({ currentUserId, open, onOpenChange }: NotificationBellProps) {
  const { notifications, unreadCount, markAllRead } = useNotifications(currentUserId);
  const [isOpen, setIsOpen] = useState(open ?? false);

  const toggleNotifications = () => {
    const next = open !== undefined ? !open : !isOpen;
    if (open !== undefined) {
      onOpenChange?.(next);
    } else {
      setIsOpen(next);
    }
    if (next) {
      markAllRead();
    }
  };

  const closeNotifications = () => {
    if (open !== undefined) {
      onOpenChange?.(false);
    } else {
      setIsOpen(false);
    }
  };

  const isNotificationOpen = open !== undefined ? open : isOpen;

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="p-2 text-gray-400 hover:text-primary transition-colors relative"
        aria-label="Toggle notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isNotificationOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={closeNotifications} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-[320px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-ink">Notifications</h4>
                <button onClick={markAllRead} className="text-xs text-primary font-bold hover:underline">
                  Mark all as read
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">You&apos;re all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-sm font-bold text-ink">{notification.text}</p>
                        <span className="text-[10px] uppercase text-gray-400">{timeAgo(notification.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{notification.type === "dm" ? "Message" : "Community"}</span>
                        <button className="inline-flex items-center gap-1 text-primary hover:underline">
                          View
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
