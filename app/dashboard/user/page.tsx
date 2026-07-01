"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { getUserRequests } from "@/services/hireRequests";
import { getUserComments } from "@/services/comments";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaFileContract,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBell,
  FaCog,
  FaInbox,
  FaArrowRight,
} from "react-icons/fa";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  const { data: comments = [] } = useQuery({
    queryKey: ["user-comments", user?.email],
    enabled: !!user?.email,
    queryFn: () => getUserComments(user?.email || ""),
  });

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["requests"],
    enabled: !!user?.email,
    queryFn: () => getUserRequests(user.email),
  });

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (item: any) => item.status === "Pending"
  ).length;

  const approvedRequests = requests.filter(
    (item: any) =>
      item.status?.toLowerCase() === "approved" ||
      item.status?.toLowerCase() === "paid"
  ).length;

  const rejectedRequests = requests.filter(
    (item: any) => item.status === "Rejected"
  ).length;

  const recentComments = useMemo(() => {
    return [...comments].reverse().slice(0, 1);
  }, [comments]);

  const recentRequests = useMemo(() => {
    return [...requests].reverse().slice(0, 1);
  }, [requests]);

  const isPieDataEmpty = pendingRequests === 0 && approvedRequests === 0 && rejectedRequests === 0;

  const chartData = useMemo(() => {
    if (isPieDataEmpty) {
      return [{ name: "No Active Requests", value: 1 }];
    }
    return [
      { name: "Approved", value: approvedRequests },
      { name: "Pending", value: pendingRequests },
      { name: "Rejected", value: rejectedRequests },
    ];
  }, [approvedRequests, pendingRequests, rejectedRequests, isPieDataEmpty]);

  const COLORS = isPieDataEmpty 
    ? ["rgba(255,255,255,0.08)"] 
    : ["#22c55e", "#f59e0b", "#ef4444"];

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 selection:bg-amber-500/30 w-full max-w-full overflow-x-hidden">
      
      {/* --- Ultra Premium Header Grid Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1.5 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Welcome back to your corporate workspace panel.
          </p>
        </div>

        {/* User Profile Widget */}
        <div className="flex items-center gap-4 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl px-4 py-2.5 rounded-2xl shadow-xl w-full md:w-auto max-w-full min-w-0">
          <div className="h-11 w-11 rounded-xl bg-[#090d1f] border border-amber-500/30 p-0.5 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm rounded-lg">
                {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 md:max-w-[200px] lg:max-w-[280px]">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-200 truncate" title={user?.displayName || "User"}>
                {user?.displayName || "Legal Account"}
              </h4>
              <span className="shrink-0 text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                Client
              </span>
            </div>
            <p className="text-slate-400 text-[11px] truncate mt-0.5" title={user?.email || ""}>
              {user?.email || "syncing active..."}
            </p>
          </div>

          <div className="h-6 w-[1px] bg-white/[0.08] hidden xs:block shrink-0"></div>
          
          <div className="flex gap-1.5 items-center shrink-0">
            <Link href="/dashboard/user/notifications" className="p-2 bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl transition text-slate-400 hover:text-white">
              <FaBell size={13} />
            </Link>
            <Link href="/dashboard/user/profile" className="p-2 bg-white/[0.02] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl transition text-slate-400 hover:text-white">
              <FaCog size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* --- Counter Cards Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#020617]/40 backdrop-blur-md border-2 border-blue-500/30 rounded-3xl p-4 sm:p-6 transition duration-300 hover:border-blue-500/60 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-blue-400 text-xs sm:text-sm font-semibold tracking-wide">Total Requests</h3>
            <FaFileContract className="text-blue-500/50 hidden sm:block" size={16} />
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-3 tracking-tight">{totalRequests}</p>
        </div>

        <div className="bg-[#020617]/40 backdrop-blur-md border-2 border-green-500/30 rounded-3xl p-4 sm:p-6 transition duration-300 hover:border-green-500/60 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-green-400 text-xs sm:text-sm font-semibold tracking-wide">Approved / Paid</h3>
            <FaCheckCircle className="text-green-500/50 hidden sm:block" size={16} />
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-3 tracking-tight">{approvedRequests}</p>
        </div>

        <div className="bg-[#020617]/40 backdrop-blur-md border-2 border-orange-500/30 rounded-3xl p-4 sm:p-6 transition duration-300 hover:border-orange-500/60 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-orange-400 text-xs sm:text-sm font-semibold tracking-wide">Pending Requests</h3>
            <FaClock className="text-orange-500/50 hidden sm:block" size={16} />
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-3 tracking-tight">{pendingRequests}</p>
        </div>

        <div className="bg-[#020617]/40 backdrop-blur-md border-2 border-red-500/20 rounded-3xl p-4 sm:p-6 transition duration-300 hover:border-red-500/50 shadow-lg">
          <div className="flex justify-between items-center">
            <p className="text-red-400 text-xs sm:text-sm font-semibold tracking-wide">Rejected Requests</p>
            <FaTimesCircle className="text-red-500/40 hidden sm:block" size={16} />
          </div>
          <p className="text-2xl sm:text-4xl font-bold text-white mt-3 tracking-tight">{rejectedRequests}</p>
        </div>
      </div>

      {/* --- Analytics and Activities Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left Side: Chart Section */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-xl relative">
          <h2 className="text-lg font-bold text-white mb-6 tracking-tight">Request Analytics</h2>
          {isPieDataEmpty && (
            <div className="absolute inset-0 top-12 flex flex-col items-center justify-center z-10 text-center pointer-events-none">
              <FaInbox className="text-slate-600 text-2xl mb-1" />
              <p className="text-slate-400 text-xs font-medium">No metrics data available</p>
            </div>
          )}
          <div className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={isPieDataEmpty ? 0 : 3} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {!isPieDataEmpty && (
                  <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
                )}
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Premium Layout with Separated Sub-sections, Cards & Buttons */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          
          {/* Sub-section 1: Recent Requests */}
          <div className="pb-5">
            <h3 className="text-amber-400 font-bold text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Recent Hiring History
            </h3>

            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request: any) => (
                  <div 
                    key={request._id} 
                    className="flex justify-between items-center bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl gap-3 min-w-0 transition duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]"
                  >
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm sm:text-base truncate">{request.lawyerName || "Professional Counsel"}</p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{request.userEmail}</p>
                    </div>
                    <span className="text-amber-400 text-xs font-bold shrink-0 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 shadow-sm">
                      {request.status}
                    </span>
                  </div>
                ))}
                
                {/* ✨ See All Requests Button */}
                <div className="pt-2 flex justify-end">
                  <Link 
                    href="user/hiring-history" 
                    className="group flex items-center gap-2 text-xs font-bold text-amber-400/90 hover:text-amber-400 transition bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20 px-3 py-1.5 rounded-xl shadow-sm"
                  >
                    See All Requests
                    <FaArrowRight size={10} className="transform transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs">
                <FaInbox size={18} className="mb-1.5 opacity-40" />
                No recent requests found
              </div>
            )}
          </div>

          
          <div className="border-b border-white/[0.08] w-full"></div>

          {/* Sub-section 2: Recent Comments */}
          <div className="pt-5">
            <h3 className="text-emerald-400 font-bold text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Recent Comments
            </h3>

            {recentComments.length > 0 ? (
              <div className="space-y-3">
                {recentComments.map((comment: any) => (
                  <div 
                    key={comment._id} 
                    className="bg-white/[0.02] border border-white/[0.06] p-3.5 rounded-2xl min-w-0 transition duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]"
                  >
                    <p className="text-slate-200 font-semibold text-sm truncate">
                      {comment.lawyerName}
                    </p>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-1.5 leading-relaxed bg-black/10 px-2.5 py-2 rounded-xl border border-white/[0.02]">
                      {comment.comment}
                    </p>
                  </div>
                ))}

                {/* ✨ View All Comments Button */}
                <div className="pt-2 flex justify-end">
                  <Link 
                    href="user/comments" 
                    className="group flex items-center gap-2 text-xs font-bold text-emerald-400/90 hover:text-emerald-400 transition bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 px-3 py-1.5 rounded-xl shadow-sm"
                  >
                    View All Comments
                    <FaArrowRight size={10} className="transform transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs">
                <FaInbox size={18} className="mb-1.5 opacity-40" />
                No comments shared yet
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}