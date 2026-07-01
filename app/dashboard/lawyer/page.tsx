"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getLawyerRequests } from "@/services/hireRequests";
import { getLawyerByEmail } from "@/services/lawyers";
import Link from "next/link";
import { getCommentsByLawyer } from "@/services/comments";
import { getTransactionsByLawyer } from "@/services/transactions";
import { useState } from "react";
import useSound from "use-sound";
import { useEffect } from "react";

export default function LawyerDashboardPage() {

  const { user } = useContext(AuthContext);

  const { data: requests = [] } = useQuery({
    queryKey: ["lawyerRequests", user?.email],
    queryFn: () => getLawyerRequests(user!.email!),
    enabled: !!user?.email,
  });

  const { data: lawyer } = useQuery({
    queryKey: ["lawyer", user?.email],
    queryFn: () => getLawyerByEmail(user!.email!),
    enabled: !!user?.email,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", lawyer?._id],
    queryFn: () => getCommentsByLawyer(lawyer._id),
    enabled: !!lawyer?._id,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", user?.email],
    queryFn: () => getTransactionsByLawyer(user!.email!),
    enabled: !!user?.email,
  });

  const totalRequests = requests.length;
  const acceptedRequests = requests.filter((r: any) => r.status === "Approved").length;
  const rejectedRequests = requests.filter((r: any) => r.status === "Rejected").length;
  const pendingRequests = requests.filter((r: any) => r.status === "Pending").length;

  const totalEarnings = transactions.reduce(
    (sum: number, item: any) => sum + Number(item.amount || 0),
    0
  );

  const paidRequests = requests.filter((r: any) => r.status === "Paid").length;
  const currentMonth = new Date().getMonth();

  const monthlyEarnings = transactions
    .filter((item: any) => new Date(item.paidAt).getMonth() === currentMonth)
    .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

  const today = new Date().toDateString();

  const todayEarnings = transactions
    .filter((item: any) => new Date(item.paidAt).toDateString() === today)
    .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

  const [openNotification, setOpenNotification] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("lawyerReadNotifications");
    if (saved) {
      setReadNotifications(JSON.parse(saved));
    }
  }, []);

  const notifications = [
    ...requests.map((request: any) => ({
      id: request._id,
      type: "request",
      title: "New Hiring Request",
      message: `${request.userName} sent a hiring request`,
      time: request.createdAt,
    })),
    ...transactions.map((item: any) => ({
      id: item._id,
      type: "payment",
      title: "Payment Received",
      message: `${item.userName} paid ৳${item.amount}`,
      time: item.paidAt,
    })),
    ...comments.map((comment: any) => ({
      id: comment._id,
      type: "review",
      title: "New Review",
      message: `${comment.userName} left a review`,
      time: comment.createdAt,
    })),
  ].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const unreadCount = notifications.filter(
    (item) => !readNotifications.includes(item.id)
  ).length;

  const markAsRead = (id: string) => {
    if (!readNotifications.includes(id)) {
      const updated = [...readNotifications, id];
      setReadNotifications(updated);
      localStorage.setItem("lawyerReadNotifications", JSON.stringify(updated));
    }
  };

  const [play] = useSound("/sounds/notification.wav");

  useEffect(() => {
    if (unreadCount > 0) {
      play();
    }
  }, [unreadCount]);

  return (
    <div
      className="
      min-h-screen
      bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
      from-[#0f172a]
      via-[#05070f]
      to-[#020408]
      p-4
      sm:p-6
      md:p-10
      space-y-8
      md:space-y-12
      "
    >
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900/20 backdrop-blur-md border border-slate-800/60 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <span
              className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-gradient-to-r
              from-amber-500/10
              to-amber-600/5
              border
              border-amber-500/30
              text-amber-400
              text-xs
              font-semibold
              tracking-wide
              uppercase
              backdrop-blur-md
              "
            >
              ⚖️ Legal Professional Dashboard
            </span>

            <div className="relative">
              <button
                onClick={() => setOpenNotification(true)}
                className="
                h-11
                w-11
                flex
                items-center
                justify-center
                rounded-2xl
                bg-slate-950/60
                border
                border-slate-800
                text-xl
                hover:border-amber-500/40
                hover:bg-slate-900
                transition-all
                duration-300
                shadow-inner
                "
              >
                🔔
              </button>

              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 animate-ping" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
                    {unreadCount}
                  </span>
                </>
              )}
            </div>
          </div>

          <h1
            className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            font-black
            text-white
            mt-6
            tracking-tight
            leading-[1.15]
            "
          >
            Welcome Back,
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              {lawyer?.name || user?.displayName || "Advocate"}
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-4 max-w-xl mx-auto lg:mx-0">
            Manage client hiring requests, update your legal profile, monitor your services and grow your professional legal presence.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
            <img
              src={
                lawyer?.image && lawyer.image.trim() !== ""
                  ? lawyer.image
                  : "/images/default-lawyer.png"
              }
              alt="Lawyer"
              className="
              w-36
              h-36
              sm:w-44
              sm:h-44
              lg:w-52
              lg:h-52
              rounded-full
              object-cover
              border-2
              border-amber-500/40
              p-2
              bg-slate-950/40
              backdrop-blur-md
              shadow-[0_0_50px_rgba(0,0,0,0.6)]
              transition-transform
              duration-500
              group-hover:scale-105
              "
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
        {[
          { title: "Total Requests", value: totalRequests, borderColor: "border-amber-500/20", textColor: "text-white" },
          { title: "Accepted", value: acceptedRequests, borderColor: "border-emerald-500/20", textColor: "text-emerald-400" },
          { title: "Paid", value: paidRequests, borderColor: "border-amber-400/20", textColor: "text-amber-400" },
          { title: "Pending", value: pendingRequests, borderColor: "border-blue-500/20", textColor: "text-blue-400" },
          { title: "Rejected", value: rejectedRequests, borderColor: "border-rose-500/20", textColor: "text-rose-400", colSpan: "col-span-2 grid-cols-1 md:col-span-1" }
        ].map((card, idx) => (
          <div 
            key={idx}
            className={`bg-slate-900/40 backdrop-blur-md border ${card.borderColor} rounded-2xl md:rounded-3xl p-4 sm:p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-950/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] ${card.colSpan || ""}`}
          >
            <p className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{card.title}</p>
            <h2 className={`text-2xl sm:text-4xl font-black mt-2 sm:mt-3 tracking-tight ${card.textColor}`}>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Hiring Requests Card */}
        <div
          className="
          bg-gradient-to-b
          from-slate-900/60
          to-slate-950/40
          backdrop-blur-xl
          border
          border-slate-800
          hover:border-amber-500/30
          rounded-[2rem]
          p-6
          sm:p-8
          shadow-[0_20px_40px_rgba(0,0,0,0.4)]
          transition-all
          duration-500
          hover:shadow-[0_20px_40px_rgba(245,158,11,0.05)]
          "
        >
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl border border-amber-500/20 mb-6">📩</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Hiring Requests</h2>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Review incoming client requests, accept cases and manage your consultations.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/40 p-3 rounded-2xl border border-slate-900 w-full">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              ⏳ {pendingRequests} Pending Requests
            </span>

            <Link
              href="/dashboard/lawyer/hiring-history"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300"
            >
              View All →
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl border border-amber-500/20 mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Client Reviews</h2>
            <p className="text-slate-400 text-sm mt-1">View all feedback from your clients.</p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 bg-slate-950/40 p-3 rounded-2xl border border-slate-900 w-full">
              {comments.length > 0 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                  ⭐ {comments.length} Reviews
                </span>
              ) : (
                <span className="text-slate-500 text-xs pl-2">No reviews yet.</span>
              )}

              <Link
                href="/dashboard/lawyer/reviews"
                className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300"
              >
                View All →
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Services Card */}
        <div
          className="
          bg-gradient-to-b
          from-slate-900/60
          to-slate-950/40
          backdrop-blur-xl
          border
          border-slate-800
          hover:border-amber-500/30
          rounded-[2rem]
          p-6
          sm:p-8
          shadow-[0_20px_40px_rgba(0,0,0,0.4)]
          transition-all
          duration-500
          hover:shadow-[0_20px_40px_rgba(245,158,11,0.05)]
          "
        >
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl border border-amber-500/20 mb-6">📂</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Legal Services</h2>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Your current legal profile and consultation details.
          </p>

          <div className="mt-6 space-y-4 bg-slate-950/30 border border-slate-900 p-4 rounded-2xl">
            {[
              { label: "⚖️ Specialization", value: lawyer?.specialty || "Not Added", valColor: "text-amber-400" },
              { label: "💰 Consultation Fee", value: `৳ ${lawyer?.fee || 0}`, valColor: "text-emerald-400" },
              { label: "🏆 Experience", value: `${lawyer?.experience || 0} Years`, valColor: "text-amber-400" }
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 last:border-none pb-3 last:pb-0 gap-2">
                <span className="text-slate-400 text-sm font-medium whitespace-nowrap">{row.label}</span>
                <span className={`text-sm font-bold text-right ${row.valColor} break-all`}>{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              ✅ Profile Active
            </span>

            <Link
              href="/dashboard/lawyer/manage-legal-profile"
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300"
            >
              Manage Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Earnings + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Requests */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-5 sm:p-6 lg:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>Recent Hiring Requests</span>
          </h2>

          <div className="space-y-4">
            {requests.slice(0, 2).map((request: any) => (
              <div
                key={request._id}
                className="
                flex
                items-center
                justify-between
                bg-slate-950/40
                p-4
                rounded-2xl
                border
                border-slate-900
                gap-2
                "
              >
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm break-all">{request.userName}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium whitespace-nowrap">
                  {request.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Link
              href="/dashboard/lawyer/hiring-history"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
            >
              View All Requests →
            </Link>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-5 sm:p-6 lg:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🪙 Earnings Overview</span>
          </h2>

          <div className="space-y-4 bg-slate-950/40 border border-slate-900 p-4 rounded-2xl">
            {[
              { label: "Today", value: todayEarnings, weight: "font-semibold" },
              { label: "This Month", value: monthlyEarnings, weight: "font-semibold" },
              { label: "Total Earnings", value: totalEarnings, weight: "font-black text-base text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text" }
            ].map((row, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 last:border-none pb-2 last:pb-0 gap-2">
                <span className="text-slate-400 text-sm whitespace-nowrap">{row.label}</span>
                <span className={`text-emerald-400 text-sm ${row.weight} break-all`}>৳{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/dashboard/lawyer/payment-history"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
            >
              View All Earnings →
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics + Clients + Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Side Analytics */}
        <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-[2rem] p-5 sm:p-6 lg:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold text-white mb-6">📊 Analytics Overview</h2>

          <div className="space-y-3 bg-slate-950/40 border border-slate-900 p-4 sm:p-5 rounded-2xl">
            {[
              { label: "Total Requests", value: totalRequests, color: "text-white" },
              { label: "Accepted Cases", value: acceptedRequests, color: "text-emerald-400" },
              { label: "Paid Cases", value: paidRequests, color: "text-amber-400" },
              { label: "Rejected Cases", value: rejectedRequests, color: "text-rose-400" }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-800/60 pb-3 gap-2">
                <span className="text-slate-400 text-sm whitespace-nowrap">{item.label}</span>
                <span className={`font-bold text-sm ${item.color} break-all`}>{item.value}</span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 gap-2">
              <span className="text-slate-300 text-sm font-semibold whitespace-nowrap">Total Earnings</span>
              <span className="text-emerald-400 text-lg sm:text-xl font-black break-all">৳{totalEarnings}</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Top Clients */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
            <h2 className="text-lg font-bold text-white mb-4">⭐ Top Clients</h2>
            <div className="space-y-3">
              {transactions.slice(0, 1).map((item: any) => (
                <div key={item._id} className="flex justify-between items-center bg-slate-950/30 border border-slate-900 p-3 rounded-xl gap-2">
                  <span className="text-slate-300 text-sm font-medium break-all">{item.userName || "Client"}</span>
                  <span className="text-emerald-400 font-bold text-sm whitespace-nowrap">৳{item.amount}</span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-slate-500 text-xs italic pl-1">No clients found.</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
            <h2 className="text-lg font-bold text-white mb-4">💰 Recent Payments</h2>
            <div className="space-y-3">
              {transactions.slice(0, 1).map((item: any) => (
                <div key={item._id} className="flex justify-between items-center bg-slate-950/30 border border-slate-900 p-3 rounded-xl gap-2">
                  <div>
                    <p className="text-slate-200 text-sm font-semibold break-all">{item.userName || "Client"}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {item.paidAt ? new Date(item.paidAt).toLocaleDateString() : "No Date"}
                    </p>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm whitespace-nowrap">৳{item.amount}</span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-slate-500 text-xs italic pl-1">No payments found.</p>
              )}
            </div>

            <div className="mt-5">
              <Link
                href="/dashboard/lawyer/payment-history"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
              >
                View All Payments →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center Modal */}
      {openNotification && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-end pb-10 sm:items-center sm:pb-4 justify-center p-4 md:p-6 animate-fadeIn"
          onClick={() => setOpenNotification(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[75vh] sm:max-h-[85vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)]
            scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-amber-500/20 hover:scrollbar-thumb-amber-500/40"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-900 sticky top-0 bg-slate-950 z-10">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">🔔 Notification Center</h2>
              <button
                onClick={() => setOpenNotification(false)}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all duration-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notifications.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group min-w-0 ${
                    readNotifications.includes(item.id)
                      ? "border-slate-900 bg-slate-900/20 opacity-70"
                      : "border-amber-500/20 bg-amber-500/[0.02] shadow-[0_4px_20px_rgba(245,158,11,0.02)] hover:border-amber-500/50 hover:bg-amber-500/[0.04]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                        {item.type === "request" && "📩"}
                        {item.type === "payment" && "💰"}
                        {item.type === "review" && "⭐"}
                      </div>

                      {!readNotifications.includes(item.id) && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>

                    <h3 className="text-slate-200 font-bold text-sm tracking-tight group-hover:text-amber-400 transition-colors truncate">{item.title}</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed break-words">{item.message}</p>
                  </div>

                  <p className="text-slate-500 text-[10px] mt-5 font-semibold">
                    {new Date(item.time).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            {notifications.length === 0 && (
              <p className="text-slate-500 text-center py-12 text-sm italic">No notifications found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}