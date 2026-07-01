"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";
import toast from "react-hot-toast";
import { 
  FaBell, 
  FaCheckCircle, 
  FaTrash, 
  FaInbox, 
  FaEnvelopeOpen, 
  FaClock 
} from "react-icons/fa";

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  // ==========================
  // Fetch Notifications
  // ==========================
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosPublic.get("/notifications");
      return res.data;
    },
  });

  // ==========================
  // Mark as Read Mutation
  // ==========================
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosPublic.patch(`/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // ==========================
  // Delete Notification Mutation
  // ==========================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosPublic.delete(`/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Notification purged successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  // Derived States for Premium Metrics
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const readCount = notifications.length - unreadCount;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 selection:bg-amber-500/20 animate-in fade-in duration-500 relative w-full max-w-full overflow-x-hidden">
      
      {/* ================================= */}
      {/* Header Panel */}
      {/* ================================= */}
      <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 relative shrink-0">
            <FaBell size={20} className={unreadCount > 0 ? "animate-swing origin-top" : ""} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0f172a] animate-pulse" />
            )}
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              Notifications Hub
            </h1>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
              Monitor real-time system alerts, platform audit logs, and security updates.
            </p>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* Metrics Performance Counters - Updated Custom Responsive Grid */}
      {/* ================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { 
            title: "Total Alerts", 
            count: notifications.length, 
            icon: <FaInbox />, 
            style: "bg-blue-500/10 border-blue-500/20 text-blue-400",
            mobileSpan: "col-span-2 sm:col-span-1" // Mobile: 1st line full width
          },
          { 
            title: "Unread Feeds", 
            count: unreadCount, 
            icon: <FaBell />, 
            style: "bg-amber-500/10 border-amber-500/20 text-amber-400",
            mobileSpan: "col-span-1" // Mobile: 2nd line half width
          },
          { 
            title: "Archived Logs", 
            count: readCount, 
            icon: <FaEnvelopeOpen />, 
            style: "bg-purple-500/10 border-purple-500/20 text-purple-400",
            mobileSpan: "col-span-1" // Mobile: 2nd line half width
          }
        ].map((metric, index) => (
          <div 
            key={index} 
            className={`rounded-2xl p-5 border ${metric.style} ${metric.mobileSpan} shadow-lg backdrop-blur-sm relative overflow-hidden group`}
          >
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.02] text-white font-black text-7xl sm:text-8xl pointer-events-none select-none group-hover:scale-110 transition duration-500">
              {metric.count}
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-80">{metric.title}</h3>
              <span className="text-xs sm:text-sm opacity-60">{metric.icon}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 sm:mt-2 tracking-tight">{metric.count}</h2>
          </div>
        ))}
      </div>

      {/* ================================= */}
      {/* Notification Stream Feed */}
      {/* ================================= */}
      <div className="space-y-4 w-full">
        {notifications.length === 0 ? (
          <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-10 sm:p-16 text-center shadow-inner">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-slate-500/10 border border-slate-500/20 rounded-2xl flex items-center justify-center text-slate-400 text-lg sm:text-xl mb-4">
              <FaEnvelopeOpen />
            </div>
            <h3 className="text-slate-300 font-bold text-sm sm:text-base tracking-tight">Inbox Fully Cleared</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
              There are no internal server logs or profile updates broadcasted to your status yet.
            </p>
          </div>
        ) : (
          notifications.map((item: any) => (
            <div
              key={item._id}
              className={`group rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border transition-all duration-300 backdrop-blur-md w-full ${
                item.isRead
                  ? "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.02]"
                  : "bg-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/20 shadow-[0_0_25px_-5px_rgba(245,158,11,0.02)]"
              }`}
            >
              {/* Message Content Info */}
              <div className="space-y-1.5 flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  {!item.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_#f59e0b] animate-pulse" />
                  )}
                  <h3 className={`font-bold tracking-tight transition truncate max-w-full ${
                    item.isRead ? "text-slate-300 group-hover:text-white text-xs sm:text-sm" : "text-white text-sm sm:text-base"
                  }`}>
                    {item.title}
                  </h3>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed break-words w-full">
                  {item.message}
                </p>

                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] sm:text-[11px] pt-1">
                  <FaClock size={10} className="text-slate-600 shrink-0" />
                  <span>
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Action Control Panel */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 ml-auto sm:ml-0">
                {!item.isRead && (
                  <button
                    onClick={() => markAsReadMutation.mutate(item._id)}
                    disabled={markAsReadMutation.isPending}
                    className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/5 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/10 transition-all duration-200 active:scale-95 cursor-pointer outline-none shadow-md disabled:opacity-50"
                    title="Mark as Read"
                  >
                    <FaCheckCircle size={12} className="sm:w-[13px] sm:h-[13px]" />
                  </button>
                )}

                <button
                  onClick={() => deleteMutation.mutate(item._id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 sm:p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/10 transition-all duration-200 active:scale-95 cursor-pointer outline-none shadow-md disabled:opacity-50"
                  title="Purge Log"
                >
                  <FaTrash size={12} className="sm:w-[13px] sm:h-[13px]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}