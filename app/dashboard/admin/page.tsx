"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/lib/axios";
import {
  FaUsers,
  FaGavel,
  FaMoneyBillWave,
  FaFileContract,
  FaArrowUp,
  FaUserShield,
  FaBell,
  FaCog,
  FaInbox,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import useSound from "use-sound";
import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    },
  });

  const { data: lawyers = [], isLoading: lawyersLoading } = useQuery({
    queryKey: ["admin-lawyers"],
    queryFn: async () => {
      const res = await axiosPublic.get("/lawyers");
      return res.data;
    },
  });

  const { data: hireRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["admin-hireRequests"],
    queryFn: async () => {
      const res = await axiosPublic.get("/hire-requests");
      return res.data;
    },
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const res = await axiosPublic.get("/transactions");
      return res.data;
    },
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosPublic.get("/notifications");
      return res.data;
    },
    refetchInterval: 5000,
  });

  const loading = usersLoading || lawyersLoading || requestsLoading || transactionsLoading;
  const unreadCount = notifications.filter((item: any) => !item.isRead).length;

  const [play] = useSound("/sounds/notification.wav");
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
  if (
    unreadCount > previousCount &&
    previousCount > 0
  ) {
    play();
  }

  setPreviousCount(unreadCount);
}, [unreadCount, play]);

  const totalRevenue = useMemo(() => {
    return transactions.reduce(
      (sum: number, item: any) => sum + Number(item.amount || item.price || 0),
      0
    );
  }, [transactions]);

  const pendingRequests = hireRequests.filter(
    (item: any) => item.status?.toLowerCase() === "pending"
  ).length;

  const approvedRequests = hireRequests.filter(
    (item: any) =>
      item.status?.toLowerCase() === "approved" ||
      item.status?.toLowerCase() === "paid" ||
      item.status?.toLowerCase() === "completed"
  ).length;

  const rejectedRequests = hireRequests.filter(
    (item: any) => item.status?.toLowerCase() === "rejected"
  ).length;

  const analyticsData = [
    { name: "Users", total: users.length },
    { name: "Lawyers", total: lawyers.length },
    { name: "Requests", total: hireRequests.length },
    { name: "Payments", total: transactions.length },
  ];

  const isPieDataEmpty = pendingRequests === 0 && approvedRequests === 0 && rejectedRequests === 0;

  const pieData = useMemo(() => {
    if (isPieDataEmpty) {
      return [{ name: "No Active Requests", value: 1 }];
    }
    return [
      { name: "Approved", value: approvedRequests },
      { name: "Pending", value: pendingRequests },
      { name: "Rejected", value: rejectedRequests },
    ];
  }, [approvedRequests, pendingRequests, rejectedRequests, isPieDataEmpty]);

  const COLORS = isPieDataEmpty ? ["rgba(255,255,255,0.08)"] : ["#10b981", "#f59e0b", "#ef4444"];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 selection:bg-amber-500/20 w-full max-w-full overflow-x-hidden">
      
      {/* Control Center Header */}
      <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              👑 Admin Control Center
            </h1>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
              Manage users, lawyers, requests and revenue.
            </p>
          </div>

          <div className="flex gap-3 items-center justify-end w-full sm:w-auto">
            <Link 
              href="/dashboard/admin/notifications" 
              className="relative p-2.5 bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 rounded-xl transition text-slate-300 flex items-center justify-center border border-white/5 shadow-md cursor-pointer"
            >
              <FaBell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link 
              href="/dashboard/admin/settings" 
              className="p-2.5 bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 rounded-xl transition text-slate-300 flex items-center justify-center border border-white/5 shadow-md cursor-pointer group"
            >
              <FaCog size={16} className="group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid - Updated: 2 Columns on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Total Users", count: users.length, icon: <FaUsers className="text-blue-400" size={18} /> },
          { title: "Total Lawyers", count: lawyers.length, icon: <FaGavel className="text-purple-400" size={18} /> },
          { title: "Hire Requests", count: hireRequests.length, icon: <FaFileContract className="text-amber-400" size={18} /> },
          { title: "Total Revenue", count: `৳ ${totalRevenue.toLocaleString()}`, icon: <FaMoneyBillWave className="text-emerald-400" size={18} /> }
        ].map((card, idx) => (
          <div key={idx} className="rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-4 sm:p-5 hover:border-white/[0.15] transition duration-300 group shadow-lg min-w-0">
            <div className="flex justify-between items-center">
              <div className="p-2 sm:p-2.5 bg-white/[0.04] rounded-xl group-hover:scale-105 transition duration-300 shrink-0">
                {card.icon}
              </div>
              <FaArrowUp className="text-slate-500 opacity-0 group-hover:opacity-100 transition duration-300 shrink-0" size={10} />
            </div>
            <h3 className="text-slate-400 text-[11px] sm:text-sm font-medium mt-3 truncate">{card.title}</h3>
            <h2 className="text-lg sm:text-3xl font-bold text-white mt-1 tracking-tight break-all truncate">{card.count}</h2>
          </div>
        ))}
      </div>

      {/* Metrics Grid Breakdown - Updated: Custom Responsive Row Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Pending Requests (Takes full row on mobile) */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 sm:p-5 text-center sm:text-left col-span-2 sm:col-span-1">
          <h2 className="text-amber-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Pending Requests</h2>
          <p className="text-2xl sm:text-4xl font-black text-amber-500 mt-1">{pendingRequests}</p>
        </div>

        {/* Card 2: Approved */}
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 sm:p-5 text-center sm:text-left col-span-1">
          <h2 className="text-emerald-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Approved</h2>
          <p className="text-2xl sm:text-4xl font-black text-emerald-400 mt-1">{approvedRequests}</p>
        </div>

        {/* Card 3: Rejected */}
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 sm:p-5 text-center sm:text-left col-span-1">
          <h2 className="text-red-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">Rejected</h2>
          <p className="text-2xl sm:text-4xl font-black text-red-400 mt-1">{rejectedRequests}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl overflow-x-auto">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Platform Analytics</h2>
          <div className="min-w-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl relative">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Request Distribution</h2>
          {isPieDataEmpty && (
            <div className="absolute inset-0 top-12 flex flex-col items-center justify-center z-10 text-center pointer-events-none">
              <FaInbox className="text-slate-600 text-2xl mb-1" />
              <p className="text-slate-400 text-xs font-medium">No distribution data available</p>
            </div>
          )}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={85} 
                paddingAngle={isPieDataEmpty ? 0 : 4} 
                dataKey="value" 
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {!isPieDataEmpty && (
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
              )}
              <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Latest Users</h2>
          <div className="space-y-2.5">
            {users.slice(-5).reverse().map((user: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] transition min-w-0 gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-slate-200 truncate">{user.name}</h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                  <FaUserShield size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Recent Transactions</h2>
          <div className="space-y-2.5">
            {transactions.slice(0, 5).map((transaction: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] transition min-w-0 gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-slate-200 truncate">{transaction.userName || "Client"}</h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{transaction.userEmail}</p>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs border border-emerald-500/20 shrink-0">
                  ৳{(transaction.amount || transaction.price || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white mb-4 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          <Link
            href="/dashboard/admin/manage-users"
            className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 transition active:scale-95 text-xs sm:text-sm text-center flex items-center justify-center"
          >
            Manage Users
          </Link>
          <Link href="/dashboard/admin/manage-lawyers" className="w-full">
            <button className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 transition active:scale-95 text-xs sm:text-sm w-full h-full">
              Manage Lawyers
            </button>
          </Link>
          <Link href="/dashboard/admin/hire-requests" className="w-full">
            <button className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 transition active:scale-95 text-xs sm:text-sm w-full h-full">
              Hire Requests
            </button>
          </Link>
          <Link href="/dashboard/admin/transactions" className="w-full">
            <button className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 transition active:scale-95 text-xs sm:text-sm w-full h-full">
              Transactions
            </button>
          </Link>
          <Link href="/dashboard/admin/analytics" className="w-full col-span-2 sm:col-span-1">
            <button className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 transition active:scale-95 text-xs sm:text-sm w-full h-full">
              Analytics
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}